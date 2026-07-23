from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.modules.auth.models import PasswordResetToken
from app.modules.users.models import User


def get_user_by_id(db: Session, user_id: int) -> User | None:
    return db.get(User, user_id)


def get_user_by_email(db: Session, email: str) -> User | None:
    return db.scalar(select(User).where(User.email == email))


def get_user_by_username(db: Session, username: str) -> User | None:
    return db.scalar(select(User).where(User.username == username))


def get_user_by_nic_number(db: Session, nic_number: str) -> User | None:
    return db.scalar(select(User).where(User.nic_number == nic_number))


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
    user = User(
        full_name=full_name,
        username=username,
        email=email,
        nic_number=nic_number,
        password_hash=password_hash,
        role=role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def create_password_reset_token(
    db: Session,
    *,
    user_id: int,
    hashed_token: str,
    expires_at: datetime,
) -> PasswordResetToken:
    reset_token = PasswordResetToken(user_id=user_id, hashed_token=hashed_token, expires_at=expires_at)
    db.add(reset_token)
    db.commit()
    db.refresh(reset_token)
    return reset_token


def get_password_reset_token(db: Session, hashed_token: str) -> PasswordResetToken | None:
    return db.scalar(select(PasswordResetToken).where(PasswordResetToken.hashed_token == hashed_token))


def mark_password_reset_token_used(db: Session, reset_token: PasswordResetToken) -> PasswordResetToken:
    reset_token.used_at = datetime.now(timezone.utc)
    db.add(reset_token)
    db.commit()
    db.refresh(reset_token)
    return reset_token


def update_user_password(db: Session, user: User, password_hash: str) -> User:
    user.password_hash = password_hash
    user.updated_at = datetime.now(timezone.utc)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
