from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_active_user
from app.modules.auth.schemas import (
    AuthUserResponse,
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    LoginRequest,
    LoginResponse,
    ResetPasswordRequest,
    ResetPasswordResponse,
    UserRegisterRequest,
    UserResponse,
)
from app.modules.auth.service import authenticate_user, register_customer, request_password_reset, reset_password
from app.modules.users.models import User

router = APIRouter(prefix='/auth', tags=['Authentication'])


@router.post('/register', response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(registration: UserRegisterRequest, db: Session = Depends(get_db)) -> User:
    return register_customer(db, registration)


@router.post('/login', response_model=LoginResponse)
def login(credentials: LoginRequest, db: Session = Depends(get_db)) -> LoginResponse:
    return authenticate_user(db, credentials)


@router.post('/forgot-password', response_model=ForgotPasswordResponse)
def forgot_password(request: ForgotPasswordRequest, db: Session = Depends(get_db)) -> ForgotPasswordResponse:
    return request_password_reset(db, request)


@router.post('/reset-password', response_model=ResetPasswordResponse)
def reset_password_endpoint(request: ResetPasswordRequest, db: Session = Depends(get_db)) -> ResetPasswordResponse:
    return reset_password(db, request)


@router.get('/me', response_model=AuthUserResponse)
def get_me(current_user: User = Depends(get_current_active_user)) -> User:
    return current_user