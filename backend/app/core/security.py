from passlib.context import CryptContext
from passlib.exc import UnknownHashError

pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')


def hash_password(password: str) -> str:
    """Hash a plaintext password with bcrypt for safe database storage."""
    password_bytes = password.encode('utf-8')

    if len(password_bytes) > 72:
        raise ValueError('Password must not exceed 72 bytes for bcrypt hashing.')

    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plaintext password against a stored bcrypt hash."""
    password_bytes = plain_password.encode('utf-8')

    if len(password_bytes) > 72 or not hashed_password:
        return False

    try:
        return pwd_context.verify(plain_password, hashed_password)
    except (UnknownHashError, ValueError, TypeError):
        return False
