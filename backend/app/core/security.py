from datetime import datetime, timedelta, timezone

import bcrypt
from fastapi import HTTPException, status
from jose import ExpiredSignatureError, JWTError, jwt

from app.core.config import get_settings


def hash_password(password: str) -> str:
    password_bytes = password.encode('utf-8')

    if len(password_bytes) > 72:
        raise ValueError('Password must not exceed 72 bytes for bcrypt hashing.')

    return bcrypt.hashpw(password_bytes, bcrypt.gensalt()).decode('utf-8')


def verify_password(plain_password: str, hashed_password: str) -> bool:
    password_bytes = plain_password.encode('utf-8')

    if len(password_bytes) > 72:
        return False

    return bcrypt.checkpw(password_bytes, hashed_password.encode('utf-8'))


def create_access_token(user_id: int, role: str) -> str:
    settings = get_settings()
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=settings.access_token_expire_minutes)
    payload = {
        'sub': str(user_id),
        'user_id': user_id,
        'role': role,
        'exp': expires_at,
    }

    return jwt.encode(payload, settings.secret_key, algorithm=settings.algorithm)


def decode_access_token(token: str) -> dict:
    settings = get_settings()

    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
    except ExpiredSignatureError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Authentication token has expired.',
            headers={'WWW-Authenticate': 'Bearer'},
        ) from exc
    except JWTError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Invalid authentication token.',
            headers={'WWW-Authenticate': 'Bearer'},
        ) from exc

    if not payload.get('user_id') or not payload.get('role'):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Invalid authentication token.',
            headers={'WWW-Authenticate': 'Bearer'},
        )

    return payload