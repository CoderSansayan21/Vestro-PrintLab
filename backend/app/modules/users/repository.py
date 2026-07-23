from collections.abc import Mapping
from datetime import datetime, timezone
from typing import Any

from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.modules.users.models import User

UserData = Mapping[str, Any]
USER_MODEL_FIELDS = set(User.__mapper__.attrs.keys())


def _user_model_data(user_data: UserData) -> dict[str, Any]:
    return {field: value for field, value in user_data.items() if field in USER_MODEL_FIELDS}


def _commit_refresh(db: Session, instance: User) -> User:
    try:
        db.add(instance)
        db.commit()
        db.refresh(instance)
        return instance
    except SQLAlchemyError:
        db.rollback()
        raise


def create_user(db: Session, user_data: UserData) -> User:
    user = User(**_user_model_data(user_data))
    return _commit_refresh(db, user)


def get_user_by_id(db: Session, user_id: int) -> User | None:
    return db.get(User, user_id)


def get_user_by_email(db: Session, email: str) -> User | None:
    return db.scalar(select(User).where(User.email == email))


def get_user_by_username(db: Session, username: str) -> User | None:
    return db.scalar(select(User).where(User.username == username))


def get_user_by_nic(db: Session, nic_number: str) -> User | None:
    return db.scalar(select(User).where(User.nic_number == nic_number))


def get_user_by_nic_number(db: Session, nic_number: str) -> User | None:
    return get_user_by_nic(db, nic_number)


def update_user(db: Session, user_id: int, user_data: UserData) -> User | None:
    user = get_user_by_id(db, user_id)

    if user is None:
        return None

    for field, value in _user_model_data(user_data).items():
        setattr(user, field, value)

    if hasattr(user, 'updated_at'):
        user.updated_at = datetime.now(timezone.utc)

    return _commit_refresh(db, user)


def delete_user(db: Session, user_id: int) -> User | None:
    user = get_user_by_id(db, user_id)

    if user is None:
        return None

    try:
        db.delete(user)
        db.commit()
        return user
    except SQLAlchemyError:
        db.rollback()
        raise


def list_users(db: Session, *, offset: int = 0, limit: int = 100) -> list[User]:
    statement = select(User).order_by(User.created_at.desc()).offset(offset).limit(limit)
    return list(db.scalars(statement).all())
