from datetime import datetime, timedelta, timezone
from typing import Any

from jose import ExpiredSignatureError, JWTError, jwt

from app.core.config import get_settings
from app.core.exceptions import ExpiredTokenError, InvalidTokenError

REQUIRED_ACCESS_TOKEN_CLAIMS = ('sub', 'email', 'role', 'exp', 'iat')


def create_token_payload(user_id: int, email: str, role: str) -> dict[str, Any]:
    """Create the standard access-token payload for a user."""
    settings = get_settings()
    issued_at = datetime.now(timezone.utc)
    expires_at = issued_at + timedelta(minutes=settings.access_token_expire_minutes)

    return {
        'sub': str(user_id),
        'email': email,
        'role': role,
        'iat': issued_at,
        'exp': expires_at,
    }


def _validate_access_token_payload(payload: dict[str, Any]) -> None:
    if any(claim not in payload for claim in REQUIRED_ACCESS_TOKEN_CLAIMS):
        raise InvalidTokenError('Authentication token is missing required claims.')

    subject = payload.get('sub')
    email = payload.get('email')
    role = payload.get('role')

    if not isinstance(subject, str) or not subject.isdigit():
        raise InvalidTokenError('Authentication token contains an invalid subject.')

    if not isinstance(email, str) or not email:
        raise InvalidTokenError('Authentication token contains an invalid email.')

    if not isinstance(role, str) or not role:
        raise InvalidTokenError('Authentication token contains an invalid role.')


def create_access_token(user_id: int, email: str, role: str) -> str:
    """Create an encoded JWT access token for an authenticated user."""
    settings = get_settings()
    payload = create_token_payload(user_id=user_id, email=email, role=role)
    return jwt.encode(payload, settings.secret_key, algorithm=settings.algorithm)


def decode_access_token(token: str) -> dict[str, Any]:
    """Decode and validate a JWT access token."""
    settings = get_settings()

    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
    except ExpiredSignatureError as exc:
        raise ExpiredTokenError('Authentication token has expired.') from exc
    except JWTError as exc:
        raise InvalidTokenError('Invalid authentication token.') from exc

    _validate_access_token_payload(payload)

    return payload
