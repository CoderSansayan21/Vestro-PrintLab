import hashlib
import logging
import secrets
from collections.abc import Callable
from datetime import datetime, timedelta, timezone
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.exceptions import (
    DatabaseOperationError,
    EmailAlreadyExistsError,
    ExpiredResetTokenError,
    InactiveUserError,
    InvalidCredentialsError,
    InvalidResetTokenError,
    NICAlreadyExistsError,
    PasswordReuseError,
    ResetTokenAlreadyUsedError,
    UserAlreadyExistsError,
    UserNotFoundError,
    UsernameAlreadyExistsError,
)
from app.core.jwt import create_access_token
from app.core.security import hash_password, verify_password
from app.modules.auth import repository
from app.modules.auth.email_service import EmailDeliveryError, EmailService, get_email_service
from app.modules.auth.schemas import (
    AuthUserResponse,
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    LoginRequest,
    LoginResponse,
    RegisterResponse,
    ResetPasswordRequest,
    ResetPasswordResponse,
    UserRegisterRequest,
    UserResponse,
)
from app.modules.users.models import User

INVALID_CREDENTIALS_MESSAGE = 'Invalid email or password.'
PASSWORD_RESET_GENERIC_MESSAGE = 'If an account exists for this email, a password reset link has been sent.'
PASSWORD_RESET_INVALID_MESSAGE = 'Invalid or expired password reset token.'
PASSWORD_RESET_SUCCESS_MESSAGE = 'Password reset successfully. You can now log in with your new password.'
UserLookup = Callable[[Session, str], User | None]
DuplicateErrorFactory = Callable[[], UserAlreadyExistsError]
logger = logging.getLogger(__name__)


def generate_reset_token() -> str:
    return secrets.token_urlsafe(32)


def hash_reset_token(token: str) -> str:
    """Hash a raw password reset token before database storage."""
    return hashlib.sha256(token.encode('utf-8')).hexdigest()


def build_reset_password_url(raw_token: str) -> str:
    """Build the frontend reset-password URL with the raw token."""
    template = get_settings().frontend_reset_password_url

    if '{token}' in template:
        return template.format(token=raw_token)

    split_url = urlsplit(template)
    query = urlencode({**dict(parse_qsl(split_url.query)), 'token': raw_token})
    return urlunsplit((split_url.scheme, split_url.netloc, split_url.path, query, split_url.fragment))


def as_aware_utc(value: datetime) -> datetime:
    if value.tzinfo is None:
        return value.replace(tzinfo=timezone.utc)

    return value.astimezone(timezone.utc)


def _ensure_unique_identity(
    db: Session,
    value: str,
    lookup: UserLookup,
    error_factory: DuplicateErrorFactory,
) -> None:
    if lookup(db, value):
        raise error_factory()


def _check_duplicate_email(db: Session, email: str) -> None:
    _ensure_unique_identity(db, email, repository.get_user_by_email, EmailAlreadyExistsError)


def _check_duplicate_username(db: Session, username: str) -> None:
    _ensure_unique_identity(db, username, repository.get_user_by_username, UsernameAlreadyExistsError)


def _check_duplicate_nic(db: Session, nic_number: str) -> None:
    _ensure_unique_identity(db, nic_number, repository.get_user_by_nic_number, NICAlreadyExistsError)


def register_user(db: Session, registration: UserRegisterRequest) -> RegisterResponse:
    """Validate register business rules, hash the password, and persist the user."""
    _check_duplicate_email(db, registration.email)
    _check_duplicate_username(db, registration.username)
    _check_duplicate_nic(db, registration.nic_number)

    try:
        user = repository.create_user(
            db,
            full_name=registration.full_name,
            username=registration.username,
            email=registration.email,
            nic_number=registration.nic_number,
            password_hash=hash_password(registration.password),
            role=registration.role,
        )
    except IntegrityError as exc:
        db.rollback()
        raise UserAlreadyExistsError('identity', 'An account with these details already exists.') from exc

    logger.info('User registered successfully: user_id=%s role=%s', user.id, user.role)
    return RegisterResponse(message='Registration successful', user=UserResponse.model_validate(user))


def _authenticate_user_model(db: Session, credentials: LoginRequest) -> User:
    user = repository.get_user_by_email(db, credentials.email)

    if not user or not verify_password(credentials.password, user.password_hash):
        logger.warning('Failed login attempt for email=%s', credentials.email)
        raise InvalidCredentialsError(INVALID_CREDENTIALS_MESSAGE)

    if not user.is_active:
        logger.warning('Inactive account login attempt for user_id=%s', user.id)
        raise InactiveUserError('This account is inactive.')

    return user


def authenticate_user(db: Session, credentials: LoginRequest) -> LoginResponse:
    """Authenticate a user, enforce account status, and return a JWT access token."""
    user = _authenticate_user_model(db, credentials)
    access_token = create_access_token(user_id=user.id, email=user.email, role=user.role)
    logger.info('User logged in successfully: user_id=%s', user.id)
    return LoginResponse(access_token=access_token, token_type='Bearer', user=user)


def get_authenticated_user_profile(current_user: User) -> AuthUserResponse:
    """Return the authenticated user's auth profile response."""
    return AuthUserResponse.model_validate(current_user)


def forgot_password(
    db: Session,
    request: ForgotPasswordRequest,
    email_service: EmailService | None = None,
) -> None:
    """Create and send a password reset link without revealing account existence."""
    user = repository.get_user_by_email(db, request.email)

    if not user or not user.is_active:
        logger.info('Password reset requested for non-actionable email=%s', request.email)
        return

    reset_token = generate_reset_token()
    reset_url = build_reset_password_url(reset_token)
    settings = get_settings()

    repository.invalidate_unused_password_reset_tokens(db, user.id)
    repository.store_password_reset_token(
        db,
        user_id=user.id,
        hashed_token=hash_reset_token(reset_token),
        expires_at=datetime.now(timezone.utc) + timedelta(minutes=settings.password_reset_token_expire_minutes),
    )

    email_sender = email_service or get_email_service()
    try:
        email_sender.send_password_reset_email(recipient=user.email, reset_url=reset_url)
    except EmailDeliveryError:
        logger.exception('Password reset email delivery failed for user_id=%s.', user.id)

    logger.info('Password reset requested successfully: user_id=%s', user.id)


def _reset_password_user(db: Session, request: ResetPasswordRequest) -> User:
    """Validate a reset token and update the related user's password."""
    reset_token = repository.get_password_reset_token(db, hash_reset_token(request.token))

    if not reset_token:
        raise InvalidResetTokenError(PASSWORD_RESET_INVALID_MESSAGE)

    if reset_token.used_at is not None:
        raise ResetTokenAlreadyUsedError(PASSWORD_RESET_INVALID_MESSAGE)

    if as_aware_utc(reset_token.expires_at) <= datetime.now(timezone.utc):
        raise ExpiredResetTokenError(PASSWORD_RESET_INVALID_MESSAGE)

    user = repository.get_user_by_id(db, reset_token.user_id)

    if not user:
        raise InvalidResetTokenError(PASSWORD_RESET_INVALID_MESSAGE)

    if not user.is_active:
        raise InactiveUserError('This account is inactive.')

    if verify_password(request.new_password, user.password_hash):
        raise PasswordReuseError('New password must be different from the current password.')

    try:
        return repository.complete_password_reset(
            db,
            user=user,
            reset_token=reset_token,
            password_hash=hash_password(request.new_password),
        )
    except SQLAlchemyError as exc:
        raise DatabaseOperationError('Unable to reset password at this time.') from exc



def reset_password(db: Session, request: ResetPasswordRequest) -> ResetPasswordResponse:
    """Reset a user's password using a valid single-use reset token."""
    user = _reset_password_user(db, request)
    logger.info('Password reset completed successfully: user_id=%s', user.id)
    return ResetPasswordResponse(message=PASSWORD_RESET_SUCCESS_MESSAGE)


def register_customer(db: Session, registration: UserRegisterRequest) -> RegisterResponse:
    return register_user(db, registration)


def request_password_reset(
    db: Session,
    request: ForgotPasswordRequest,
    email_service: EmailService | None = None,
) -> ForgotPasswordResponse:
    """Handle forgot-password requests with a generic public response."""
    try:
        forgot_password(db, request, email_service)
    except SQLAlchemyError:
        logger.exception('Password reset request failed due to a database error.')

    return ForgotPasswordResponse(message=PASSWORD_RESET_GENERIC_MESSAGE)


def get_user_from_token_payload(db: Session, payload: dict) -> User:
    user_id = payload.get('user_id')

    if not isinstance(user_id, int):
        raise InvalidCredentialsError('Invalid authentication token.')

    user = repository.get_user_by_id(db, user_id)

    if not user:
        raise UserNotFoundError('User could not be found for the supplied token.')

    return user
