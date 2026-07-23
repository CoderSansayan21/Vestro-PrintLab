from typing import Any

from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.exceptions import AccessDeniedError, InactiveUserError, InvalidTokenError, UnverifiedUserError, UserNotFoundError
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
    payload = decode_access_token(token)
    user_id = _get_user_id_from_payload(payload)
    user = users_repository.get_user_by_id(db, user_id)

    if user is None:
        raise UserNotFoundError('User could not be found for the supplied token.')

    return user


def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    if not current_user.is_active:
        raise InactiveUserError('This account is inactive.')

    return current_user


def get_current_verified_user(current_user: User = Depends(get_current_active_user)) -> User:
    if not current_user.is_verified:
        raise UnverifiedUserError('This account has not been verified.')

    return current_user


def get_current_admin_user(current_user: User = Depends(get_current_active_user)) -> User:
    if current_user.role.lower() != 'admin':
        raise AccessDeniedError('Admin access is required.')

    return current_user
