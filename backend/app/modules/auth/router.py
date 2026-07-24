from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_active_user
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
    UsernameAlreadyExistsError,
)
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
)
from app.modules.auth.service import (
    authenticate_user,
    get_authenticated_user_profile,
    register_user,
    request_password_reset,
    reset_password,
)
from app.modules.users.models import User

router = APIRouter(prefix='/auth', tags=['Authentication'])


@router.post(
    '/register',
    response_model=RegisterResponse,
    status_code=status.HTTP_201_CREATED,
    responses={status.HTTP_409_CONFLICT: {'description': 'Duplicate email, username, or NIC number.'}},
)
def register(registration: UserRegisterRequest, db: Session = Depends(get_db)) -> RegisterResponse:
    """Register a new user account."""
    try:
        return register_user(db, registration)
    except (EmailAlreadyExistsError, UsernameAlreadyExistsError, NICAlreadyExistsError, UserAlreadyExistsError) as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(exc)) from exc


@router.post(
    '/login',
    response_model=LoginResponse,
    responses={
        status.HTTP_401_UNAUTHORIZED: {'description': 'Wrong email or password.'},
        status.HTTP_403_FORBIDDEN: {'description': 'Inactive account.'},
    },
)
def login(credentials: LoginRequest, db: Session = Depends(get_db)) -> LoginResponse:
    try:
        return authenticate_user(db, credentials)
    except InvalidCredentialsError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(exc)) from exc
    except InactiveUserError as exc:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(exc)) from exc


@router.post(
    '/forgot-password',
    response_model=ForgotPasswordResponse,
    responses={status.HTTP_200_OK: {'description': 'Generic reset response.'}},
)
def forgot_password(request: ForgotPasswordRequest, db: Session = Depends(get_db)) -> ForgotPasswordResponse:
    return request_password_reset(db, request)


@router.post(
    '/reset-password',
    response_model=ResetPasswordResponse,
    responses={
        status.HTTP_400_BAD_REQUEST: {'description': 'Invalid, expired, used, or rejected password reset request.'},
        status.HTTP_403_FORBIDDEN: {'description': 'Inactive account.'},
        status.HTTP_500_INTERNAL_SERVER_ERROR: {'description': 'Password could not be reset.'},
    },
)
def reset_password_endpoint(request: ResetPasswordRequest, db: Session = Depends(get_db)) -> ResetPasswordResponse:
    """Reset a password using a valid single-use reset token."""
    try:
        return reset_password(db, request)
    except (
        ExpiredResetTokenError,
        InvalidResetTokenError,
        PasswordReuseError,
        ResetTokenAlreadyUsedError,
    ) as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc
    except InactiveUserError as exc:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(exc)) from exc
    except DatabaseOperationError as exc:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(exc)) from exc


@router.get('/me', response_model=AuthUserResponse)
def get_me(current_user: User = Depends(get_current_active_user)) -> AuthUserResponse:
    """Return the authenticated user's auth profile."""
    return get_authenticated_user_profile(current_user)
