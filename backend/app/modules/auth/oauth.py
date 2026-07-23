from dataclasses import dataclass
from urllib.parse import urlencode

from fastapi import HTTPException, status

from app.core.config import GoogleOAuthSettings, get_google_oauth_settings


GOOGLE_OAUTH_PROVIDER = 'google'


@dataclass(frozen=True)
class GoogleOAuthAuthorization:
    authorization_url: str
    provider: str = GOOGLE_OAUTH_PROVIDER


@dataclass(frozen=True)
class GoogleOAuthUserInfo:
    provider_user_id: str
    email: str
    email_verified: bool
    full_name: str | None = None
    avatar_url: str | None = None


def ensure_google_oauth_configured(settings: GoogleOAuthSettings | None = None) -> GoogleOAuthSettings:
    oauth_settings = settings or get_google_oauth_settings()

    if not oauth_settings.is_configured:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail='Google OAuth is not configured yet.',
        )

    return oauth_settings


def build_google_authorization_url(
    *,
    state: str,
    settings: GoogleOAuthSettings | None = None,
) -> GoogleOAuthAuthorization:
    oauth_settings = ensure_google_oauth_configured(settings)
    query = urlencode(
        {
            'client_id': oauth_settings.client_id,
            'redirect_uri': oauth_settings.redirect_uri,
            'response_type': 'code',
            'scope': ' '.join(oauth_settings.scope_list),
            'state': state,
            'access_type': 'offline',
            'prompt': 'consent',
        }
    )

    return GoogleOAuthAuthorization(
        authorization_url=f'{oauth_settings.authorize_url}?{query}',
    )


def exchange_google_code_for_user_info(*, code: str, state: str) -> GoogleOAuthUserInfo:
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail='Google OAuth callback handling is pending backend integration.',
    )
