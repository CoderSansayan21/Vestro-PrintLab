from collections.abc import Callable, Mapping
from typing import Any

from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.exceptions import EmailAlreadyExistsError, NICAlreadyExistsError, UsernameAlreadyExistsError
from app.core.security import hash_password
from app.modules.users import repository
from app.modules.users.models import User

UserInput = BaseModel | Mapping[str, Any]
UserLookup = Callable[[Session, str], User | None]
DomainErrorFactory = Callable[[], Exception]


def _to_dict(data: UserInput, *, exclude_unset: bool = False) -> dict[str, Any]:
    if isinstance(data, BaseModel):
        return data.model_dump(mode='json', exclude_unset=exclude_unset)

    return dict(data)


def _ensure_unique_value(
    db: Session,
    value: str,
    lookup: UserLookup,
    error_factory: DomainErrorFactory,
    *,
    current_user_id: int | None = None,
) -> None:
    existing_user = lookup(db, value)

    if existing_user and existing_user.id != current_user_id:
        raise error_factory()


def _ensure_unique_email(db: Session, email: str, *, current_user_id: int | None = None) -> None:
    _ensure_unique_value(
        db,
        email,
        repository.get_user_by_email,
        EmailAlreadyExistsError,
        current_user_id=current_user_id,
    )


def _ensure_unique_username(db: Session, username: str, *, current_user_id: int | None = None) -> None:
    _ensure_unique_value(
        db,
        username,
        repository.get_user_by_username,
        UsernameAlreadyExistsError,
        current_user_id=current_user_id,
    )


def _ensure_unique_nic(db: Session, nic_number: str, *, current_user_id: int | None = None) -> None:
    _ensure_unique_value(
        db,
        nic_number,
        repository.get_user_by_nic,
        NICAlreadyExistsError,
        current_user_id=current_user_id,
    )


def _prepare_create_data(user_data: UserInput) -> dict[str, Any]:
    data = _to_dict(user_data)
    data.pop('confirm_password', None)
    password = data.pop('password', None)

    if password is not None and 'password_hash' not in data:
        data['password_hash'] = hash_password(password)

    return data


def _prepare_update_data(user_data: UserInput) -> dict[str, Any]:
    return _to_dict(user_data, exclude_unset=True)


def create_user(db: Session, user_data: UserInput) -> User:
    data = _prepare_create_data(user_data)

    _ensure_unique_email(db, data['email'])
    _ensure_unique_username(db, data['username'])
    _ensure_unique_nic(db, data['nic_number'])

    return repository.create_user(db, data)


def get_user(db: Session, user_id: int) -> User | None:
    return repository.get_user_by_id(db, user_id)


def get_user_by_email(db: Session, email: str) -> User | None:
    return repository.get_user_by_email(db, email)


def get_user_by_username(db: Session, username: str) -> User | None:
    return repository.get_user_by_username(db, username)


def get_user_by_nic(db: Session, nic_number: str) -> User | None:
    return repository.get_user_by_nic(db, nic_number)


def update_user(db: Session, user_id: int, user_data: UserInput) -> User | None:
    data = _prepare_update_data(user_data)

    if not data:
        return repository.get_user_by_id(db, user_id)

    if 'email' in data:
        _ensure_unique_email(db, data['email'], current_user_id=user_id)

    if 'username' in data:
        _ensure_unique_username(db, data['username'], current_user_id=user_id)

    if 'nic_number' in data:
        _ensure_unique_nic(db, data['nic_number'], current_user_id=user_id)

    return repository.update_user(db, user_id, data)


def delete_user(db: Session, user_id: int) -> User | None:
    return repository.delete_user(db, user_id)


def list_users(db: Session, *, offset: int = 0, limit: int = 100) -> list[User]:
    return repository.list_users(db, offset=max(offset, 0), limit=max(1, limit))
