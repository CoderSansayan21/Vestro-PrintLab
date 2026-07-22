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


@lru_cache
def get_settings() -> Settings:
    return Settings()


class DatabaseSettings(BaseSettings):
    model_config = SettingsConfigDict(env_file=ENV_FILE, env_file_encoding='utf-8', extra='ignore')

    database_url: str = Field(..., alias='DATABASE_URL')


@lru_cache
def get_database_settings() -> DatabaseSettings:
    return DatabaseSettings()
