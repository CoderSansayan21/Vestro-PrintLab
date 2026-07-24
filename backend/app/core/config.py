from functools import lru_cache
from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

ENV_FILE = Path(__file__).resolve().parents[2] / '.env'


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=ENV_FILE, env_file_encoding='utf-8', extra='ignore')

    database_url: str = Field(..., alias='DATABASE_URL')
    secret_key: str = Field(..., alias='SECRET_KEY')
    algorithm: str = Field('HS256', alias='ALGORITHM')
    access_token_expire_minutes: int = Field(30, alias='ACCESS_TOKEN_EXPIRE_MINUTES')
    app_env: str = Field('development', alias='APP_ENV')
    frontend_reset_password_url: str = Field(
        'http://localhost:5173/reset-password/{token}',
        alias='FRONTEND_RESET_PASSWORD_URL',
    )
    password_reset_token_expire_minutes: int = Field(15, alias='PASSWORD_RESET_TOKEN_EXPIRE_MINUTES')
    email_from: str | None = Field(default=None, alias='EMAIL_FROM')
    smtp_host: str | None = Field(default=None, alias='SMTP_HOST')
    smtp_port: int = Field(587, alias='SMTP_PORT')
    smtp_username: str | None = Field(default=None, alias='SMTP_USERNAME')
    smtp_password: str | None = Field(default=None, alias='SMTP_PASSWORD')
    google_oauth_client_id: str | None = Field(default=None, alias='GOOGLE_OAUTH_CLIENT_ID')
    google_oauth_client_secret: str | None = Field(default=None, alias='GOOGLE_OAUTH_CLIENT_SECRET')
    google_oauth_redirect_uri: str | None = Field(default=None, alias='GOOGLE_OAUTH_REDIRECT_URI')
    google_oauth_authorize_url: str = Field(
        'https://accounts.google.com/o/oauth2/v2/auth',
        alias='GOOGLE_OAUTH_AUTHORIZE_URL',
    )
    google_oauth_token_url: str = Field(
        'https://oauth2.googleapis.com/token',
        alias='GOOGLE_OAUTH_TOKEN_URL',
    )
    google_oauth_userinfo_url: str = Field(
        'https://openidconnect.googleapis.com/v1/userinfo',
        alias='GOOGLE_OAUTH_USERINFO_URL',
    )
    google_oauth_scopes: str = Field('openid email profile', alias='GOOGLE_OAUTH_SCOPES')


@lru_cache
def get_settings() -> Settings:
    return Settings()


class DatabaseSettings(BaseSettings):
    model_config = SettingsConfigDict(env_file=ENV_FILE, env_file_encoding='utf-8', extra='ignore')

    database_url: str = Field(..., alias='DATABASE_URL')


@lru_cache
def get_database_settings() -> DatabaseSettings:
    return DatabaseSettings()


class GoogleOAuthSettings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=ENV_FILE,
        env_file_encoding='utf-8',
        extra='ignore',
        populate_by_name=True,
    )

    client_id: str | None = Field(default=None, alias='GOOGLE_OAUTH_CLIENT_ID')
    client_secret: str | None = Field(default=None, alias='GOOGLE_OAUTH_CLIENT_SECRET')
    redirect_uri: str | None = Field(default=None, alias='GOOGLE_OAUTH_REDIRECT_URI')
    authorize_url: str = Field(
        'https://accounts.google.com/o/oauth2/v2/auth',
        alias='GOOGLE_OAUTH_AUTHORIZE_URL',
    )
    token_url: str = Field('https://oauth2.googleapis.com/token', alias='GOOGLE_OAUTH_TOKEN_URL')
    userinfo_url: str = Field(
        'https://openidconnect.googleapis.com/v1/userinfo',
        alias='GOOGLE_OAUTH_USERINFO_URL',
    )
    scopes: str = Field('openid email profile', alias='GOOGLE_OAUTH_SCOPES')

    @property
    def is_configured(self) -> bool:
        return bool(self.client_id and self.client_secret and self.redirect_uri)

    @property
    def scope_list(self) -> list[str]:
        return [scope for scope in self.scopes.split() if scope]


@lru_cache
def get_google_oauth_settings() -> GoogleOAuthSettings:
    return GoogleOAuthSettings()
