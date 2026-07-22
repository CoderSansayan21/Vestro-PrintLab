import re
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator


def normalize_sri_lankan_phone(value: str) -> str:
    phone = value.replace(' ', '').replace('-', '')

    if phone.startswith('0'):
        return f'+94{phone[1:]}'

    if phone.startswith('94'):
        return f'+{phone}'

    return phone


def validate_password_strength(value: str) -> str:
    if len(value) < 8:
        raise ValueError('Password must be at least 8 characters.')
    if not re.search(r'[A-Z]', value):
        raise ValueError('Password must include at least one uppercase letter.')
    if not re.search(r'[a-z]', value):
        raise ValueError('Password must include at least one lowercase letter.')
    if not re.search(r'[0-9]', value):
        raise ValueError('Password must include at least one number.')
    if not re.search(r'[^A-Za-z0-9]', value):
        raise ValueError('Password must include at least one special character.')
    return value


def normalize_email(value: str) -> str:
    email = value.strip().lower()
    if not re.match(r'^[^\s@]+@[^\s@]+\.[^\s@]+$', email):
        raise ValueError('Enter a valid email address.')
    return email


class UserRegisterRequest(BaseModel):
    full_name: str = Field(..., min_length=3, max_length=120)
    email: str = Field(..., max_length=255)
    phone: str | None = Field(default=None, max_length=20)
    password: str = Field(..., min_length=8, max_length=72)

    @field_validator('full_name')
    @classmethod
    def validate_full_name(cls, value: str) -> str:
        full_name = value.strip()
        if len(full_name) < 3:
            raise ValueError('Full name must be at least 3 characters.')
        return full_name

    @field_validator('email')
    @classmethod
    def validate_email(cls, value: str) -> str:
        email = value.strip().lower()
        if not email:
            raise ValueError('Email is required.')
        return normalize_email(email)

    @field_validator('phone')
    @classmethod
    def validate_phone(cls, value: str | None) -> str | None:
        if value is None:
            return None

        phone = normalize_sri_lankan_phone(value)
        if not phone:
            return None
        if not re.match(r'^\+947[0-9]{8}$', phone):
            raise ValueError('Enter a valid Sri Lankan mobile number.')
        return phone

    @field_validator('password')
    @classmethod
    def validate_password(cls, value: str) -> str:
        return validate_password_strength(value)


class LoginRequest(BaseModel):
    email: str = Field(..., max_length=255)
    password: str = Field(..., min_length=1, max_length=72)

    @field_validator('email')
    @classmethod
    def validate_email(cls, value: str) -> str:
        return normalize_email(value)


class ForgotPasswordRequest(BaseModel):
    email: str = Field(..., max_length=255)

    @field_validator('email')
    @classmethod
    def validate_email(cls, value: str) -> str:
        return normalize_email(value)


class ForgotPasswordResponse(BaseModel):
    message: str


class ResetPasswordRequest(BaseModel):
    token: str = Field(..., min_length=20, max_length=255)
    new_password: str = Field(..., min_length=8, max_length=72)

    @field_validator('token')
    @classmethod
    def validate_token(cls, value: str) -> str:
        token = value.strip()
        if not token:
            raise ValueError('Reset token is required.')
        return token

    @field_validator('new_password')
    @classmethod
    def validate_new_password(cls, value: str) -> str:
        return validate_password_strength(value)


class ResetPasswordResponse(BaseModel):
    message: str


class AuthUserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    user_id: int
    full_name: str
    email: str
    phone: str | None
    role: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = 'bearer'
    user: AuthUserResponse


class UserResponse(AuthUserResponse):
    is_active: bool
    is_verified: bool
    created_at: datetime
    updated_at: datetime