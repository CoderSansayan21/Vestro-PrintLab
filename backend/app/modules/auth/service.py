import hashlib
import secrets
from datetime import datetime, timedelta, timezone

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import create_access_token, hash_password, verify_password
from app.modules.auth import repository
from app.modules.auth.email_service import EmailService, get_email_service
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


def hash_reset_token(token: str) -> str:
    return hashlib.sha256(token.encode('utf-8')).hexdigest()


def generate_reset_token() -> str:
    return secrets.token_urlsafe(32)


def as_aware_utc(value: datetime) -> datetime:
    if value.tzinfo is None:
        return value.replace(tzinfo=timezone.utc)
    return value.astimezone(timezone.utc)


def register_customer(db: Session, registration: UserRegisterRequest) -> User:
    if repository.get_user_by_email(db, registration.email):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail='An account with this email already exists.',
        )

    if registration.phone and repository.get_user_by_phone(db, registration.phone):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail='An account with this phone number already exists.',
        )

    hashed_password = hash_password(registration.password)

    return repository.create_user(
        db,
        full_name=registration.full_name,
        email=registration.email,
        phone=registration.phone,
        hashed_password=hashed_password,
    )


def authenticate_user(db: Session, credentials: LoginRequest) -> LoginResponse:
    user = repository.get_user_by_email(db, credentials.email)

    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=INVALID_CREDENTIALS_MESSAGE)

    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail='This account is inactive.')

    access_token = create_access_token(user_id=user.user_id, role=user.role)
    return LoginResponse(access_token=access_token, user=user)


def request_password_reset(
    db: Session,
    request: ForgotPasswordRequest,
    email_service: EmailService | None = None,
) -> ForgotPasswordResponse:
    user = repository.get_user_by_email(db, request.email)

    if user and user.is_active:
        reset_token = generate_reset_token()
        repository.create_password_reset_token(
            db,
            user_id=user.user_id,
            hashed_token=hash_reset_token(reset_token),
            expires_at=datetime.now(timezone.utc) + timedelta(minutes=PASSWORD_RESET_EXPIRE_MINUTES),
        )
        service = email_service or get_email_service()
        service.send_password_reset_email(recipient=user.email, reset_token=reset_token)

    return ForgotPasswordResponse(message=PASSWORD_RESET_GENERIC_MESSAGE)


def reset_password(db: Session, request: ResetPasswordRequest) -> ResetPasswordResponse:
    reset_token = repository.get_password_reset_token(db, hash_reset_token(request.token))

    if not reset_token or reset_token.used_at is not None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=PASSWORD_RESET_INVALID_MESSAGE)

    if as_aware_utc(reset_token.expires_at) <= datetime.now(timezone.utc):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=PASSWORD_RESET_INVALID_MESSAGE)

    user = repository.get_user_by_id(db, reset_token.user_id)

    if not user or not user.is_active:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=PASSWORD_RESET_INVALID_MESSAGE)

    repository.update_user_password(db, user, hash_password(request.new_password))
    repository.mark_password_reset_token_used(db, reset_token)

    return ResetPasswordResponse(message='Password has been reset successfully.')


def get_user_from_token_payload(db: Session, payload: dict) -> User:
    user_id = payload.get('user_id')

    if not isinstance(user_id, int):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Invalid authentication token.',
            headers={'WWW-Authenticate': 'Bearer'},
        )

    user = repository.get_user_by_id(db, user_id)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Invalid authentication token.',
            headers={'WWW-Authenticate': 'Bearer'},
        )

    return user