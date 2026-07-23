from datetime import datetime, timezone
from typing import TypeVar

from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.modules.auth.models import PasswordResetToken
from app.modules.users import repository as users_repository
from app.modules.users.models import User

OrmModel = TypeVar('OrmModel', PasswordResetToken, User)


def _commit_refresh(db: Session, instance: OrmModel) -> OrmModel:
    try:
        db.add(instance)
        db.commit()
        db.refresh(instance)
        return instance
    except SQLAlchemyError:
        db.rollback()
        raise


def get_user_by_id(db: Session, user_id: int) -> User | None:
    return users_repository.get_user_by_id(db, user_id)


def get_user_by_email(db: Session, email: str) -> User | None:
    return users_repository.get_user_by_email(db, email)


def get_user_by_username(db: Session, username: str) -> User | None:
    return users_repository.get_user_by_username(db, username)


def get_user_by_nic_number(db: Session, nic_number: str) -> User | None:
    return users_repository.get_user_by_nic_number(db, nic_number)


def get_user_by_phone(db: Session, phone: str) -> User | None:
    return get_user_by_nic_number(db, phone)


def create_user(
    db: Session,
    *,
    full_name: str,
    username: str,
    email: str,
    nic_number: str,
    password_hash: str,
    role: str,
) -> User:
    return users_repository.create_user(
        db,
        {
            'full_name': full_name,
            'username': username,
            'email': email,
            'nic_number': nic_number,
            'password_hash': password_hash,
            'role': role,
        },
    )


def store_password_reset_token(
    db: Session,
    *,
    user_id: int,
    hashed_token: str,
    expires_at: datetime,
) -> PasswordResetToken:
    reset_token = PasswordResetToken(user_id=user_id, hashed_token=hashed_token, expires_at=expires_at)
    return _commit_refresh(db, reset_token)


def create_password_reset_token(
    db: Session,
    *,
    user_id: int,
    hashed_token: str,
    expires_at: datetime,
) -> PasswordResetToken:
    return store_password_reset_token(
        db,
        user_id=user_id,
        hashed_token=hashed_token,
        expires_at=expires_at,
    )


def get_password_reset_token(db: Session, hashed_token: str) -> PasswordResetToken | None:
    return db.scalar(select(PasswordResetToken).where(PasswordResetToken.hashed_token == hashed_token))


def invalidate_password_reset_token(db: Session, reset_token: PasswordResetToken | None) -> PasswordResetToken | None:
    if reset_token is None:
        return None

    reset_token.used_at = datetime.now(timezone.utc)
    return _commit_refresh(db, reset_token)


def mark_password_reset_token_used(db: Session, reset_token: PasswordResetToken) -> PasswordResetToken | None:
    return invalidate_password_reset_token(db, reset_token)


def update_user_password(db: Session, user: User | None, password_hash: str) -> User | None:
    if user is None:
        return None

    return users_repository.update_user(db, user.id, {'password_hash': password_hash})
