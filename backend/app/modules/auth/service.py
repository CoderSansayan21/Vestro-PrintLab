import secrets
from collections.abc import Callable
from datetime import datetime, timedelta, timezone

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.exceptions import (
    EmailAlreadyExistsError,
    InactiveUserError,
    InvalidCredentialsError,
    InvalidResetTokenError,
    NICAlreadyExistsError,
    UserAlreadyExistsError,
    UserNotFoundError,
    UsernameAlreadyExistsError,
)
from app.core.jwt import create_access_token
from app.core.security import hash_password, verify_password
from app.modules.auth import repository
from app.modules.auth.email_service import EmailService, get_email_service
from app.modules.auth.models import PasswordResetToken
from app.modules.auth.schemas import (
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    LoginRequest,
    LoginResponse,
    ResetPasswordRequest,
    ResetPasswordResponse,
    UserRegisterRequest,
)
from app.modules.users.models import User

INVALID_CREDENTIALS_MESSAGE = 'Invalid email or password.'
PASSWORD_RESET_GENERIC_MESSAGE = 'If an account exists, password reset instructions have been sent.'
PASSWORD_RESET_INVALID_MESSAGE = 'Invalid or expired password reset token.'
PASSWORD_RESET_EXPIRE_MINUTES = 15
UserLookup = Callable[[Session, str], User | None]
DuplicateErrorFactory = Callable[[], UserAlreadyExistsError]


def generate_reset_token() -> str:
    return secrets.token_urlsafe(32)


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


def register_user(db: Session, registration: UserRegisterRequest) -> User:
    _check_duplicate_email(db, registration.email)
    _check_duplicate_username(db, registration.username)
    _check_duplicate_nic(db, registration.nic_number)

    try:
        return repository.create_user(
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


def _authenticate_user_model(db: Session, credentials: LoginRequest) -> User:
    user = repository.get_user_by_email(db, credentials.email)

    if not user or not verify_password(credentials.password, user.password_hash):
        raise InvalidCredentialsError(INVALID_CREDENTIALS_MESSAGE)

    if not user.is_active:
        raise InactiveUserError('This account is inactive.')

    return user


def authenticate_user(db: Session, credentials: LoginRequest) -> LoginResponse:
    user = _authenticate_user_model(db, credentials)
    access_token = create_access_token(user_id=user.id, email=user.email, role=user.role)
    return LoginResponse(access_token=access_token, token_type='Bearer', user=user)


def forgot_password(
    db: Session,
    request: ForgotPasswordRequest,
    email_service: EmailService | None = None,
) -> PasswordResetToken | None:
    user = repository.get_user_by_email(db, request.email)

    if not user or not user.is_active:
        return None

    reset_token = generate_reset_token()
    stored_token = repository.store_password_reset_token(
        db,
        user_id=user.id,
        hashed_token=reset_token,
        expires_at=datetime.now(timezone.utc) + timedelta(minutes=PASSWORD_RESET_EXPIRE_MINUTES),
    )

    email_sender = email_service or get_email_service()
    email_sender.send_password_reset_email(recipient=user.email, reset_token=reset_token)

    return stored_token


def _reset_password_user(db: Session, request: ResetPasswordRequest) -> User:
    reset_token = repository.get_password_reset_token(db, request.token)

    if not reset_token or reset_token.used_at is not None:
        raise InvalidResetTokenError(PASSWORD_RESET_INVALID_MESSAGE)

    if as_aware_utc(reset_token.expires_at) <= datetime.now(timezone.utc):
        raise InvalidResetTokenError(PASSWORD_RESET_INVALID_MESSAGE)

    user = repository.get_user_by_id(db, reset_token.user_id)

    if not user or not user.is_active:
        raise InvalidResetTokenError(PASSWORD_RESET_INVALID_MESSAGE)

    updated_user = repository.update_user_password(db, user, hash_password(request.new_password))
    repository.invalidate_password_reset_token(db, reset_token)

    if updated_user is None:
        raise InvalidResetTokenError(PASSWORD_RESET_INVALID_MESSAGE)

    return updated_user


def reset_password(db: Session, request: ResetPasswordRequest) -> ResetPasswordResponse:
    _reset_password_user(db, request)
    return ResetPasswordResponse(message='Password has been reset successfully.')


def register_customer(db: Session, registration: UserRegisterRequest) -> User:
    return register_user(db, registration)


def request_password_reset(
    db: Session,
    request: ForgotPasswordRequest,
    email_service: EmailService | None = None,
) -> ForgotPasswordResponse:
    forgot_password(db, request, email_service)
    return ForgotPasswordResponse(message=PASSWORD_RESET_GENERIC_MESSAGE)


def get_user_from_token_payload(db: Session, payload: dict) -> User:
    user_id = payload.get('user_id')

    if not isinstance(user_id, int):
        raise InvalidCredentialsError('Invalid authentication token.')

    user = repository.get_user_by_id(db, user_id)

    if not user:
        raise UserNotFoundError('User could not be found for the supplied token.')

    return user
