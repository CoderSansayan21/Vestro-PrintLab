from typing import Any

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.exceptions import (
    AccessDeniedError,
    ExpiredTokenError,
    InactiveUserError,
    InvalidTokenError,
    UnverifiedUserError,
    UserNotFoundError,
)
from app.core.jwt import decode_access_token
from app.modules.users import repository as users_repository
from app.modules.users.models import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl='/api/v1/auth/login')


def _get_user_id_from_payload(payload: dict[str, Any]) -> int:
    subject = payload.get('sub')

    if not isinstance(subject, str) or not subject.isdigit():
        raise InvalidTokenError('Authentication token contains an invalid subject.')

    return int(subject)


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    """Resolve the authenticated user from a JWT bearer token."""
    try:
        payload = decode_access_token(token)
    except ExpiredTokenError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(exc),
            headers={'WWW-Authenticate': 'Bearer'},
        ) from exc
    except InvalidTokenError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(exc),
            headers={'WWW-Authenticate': 'Bearer'},
        ) from exc

    try:
        user_id = _get_user_id_from_payload(payload)
    except InvalidTokenError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(exc),
            headers={'WWW-Authenticate': 'Bearer'},
        ) from exc

    user = users_repository.get_user_by_id(db, user_id)

    if user is None:
        exc = UserNotFoundError('User could not be found for the supplied token.')
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        ) from exc

    return user


def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    """Require an authenticated user with an active account."""
    if not current_user.is_active:
        exc = InactiveUserError('This account is inactive.')
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(exc)) from exc

    return current_user


def get_current_verified_user(current_user: User = Depends(get_current_active_user)) -> User:
    """Require an authenticated active user with a verified account."""
    if not current_user.is_verified:
        exc = UnverifiedUserError('This account has not been verified.')
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(exc)) from exc

    return current_user


def get_current_admin_user(current_user: User = Depends(get_current_active_user)) -> User:
    """Require an authenticated active administrator."""
    if current_user.role.lower() != 'admin':
        exc = AccessDeniedError('Admin access is required.')
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(exc)) from exc

    return current_user
