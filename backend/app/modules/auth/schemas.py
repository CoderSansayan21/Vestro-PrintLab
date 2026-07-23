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
    full_name: str = Field(..., min_length=2, max_length=120)
    username: str = Field(..., min_length=3, max_length=30)
    email: str = Field(..., max_length=255)
    nic_number: str = Field(..., max_length=20)
    password: str = Field(..., min_length=8, max_length=72)
    role: str = Field(default='customer', max_length=20)

    @field_validator('full_name')
    @classmethod
    def validate_full_name(cls, value: str) -> str:
        full_name = value.strip()
        if len(full_name) < 2:
            raise ValueError('Full name must be at least 2 characters.')
        if not re.match(r"^[A-Za-z][A-Za-z\s'-]*$", full_name):
            raise ValueError("Full name may contain only letters, spaces, apostrophes, and hyphens.")
        return full_name

    @field_validator('username')
    @classmethod
    def validate_username(cls, value: str) -> str:
        username = value.strip().lower()
        if not re.match(r'^[a-z0-9_.]{3,30}$', username):
            raise ValueError('Username may contain only letters, numbers, underscore, and period.')
        return username

    @field_validator('email')
    @classmethod
    def validate_email(cls, value: str) -> str:
        email = value.strip().lower()
        if not email:
            raise ValueError('Email is required.')
        return normalize_email(email)

    @field_validator('nic_number')
    @classmethod
    def validate_nic_number(cls, value: str) -> str:
        nic_number = value.strip()
        if not re.match(r'^(?:\d{9}[vVxX]|\d{12})$', nic_number):
            raise ValueError('Enter a valid Sri Lankan NIC number.')
        return nic_number.upper()

    @field_validator('password')
    @classmethod
    def validate_password(cls, value: str) -> str:
        return validate_password_strength(value)

    @field_validator('role')
    @classmethod
    def validate_role(cls, value: str) -> str:
        role = value.strip().lower()
        if role not in {'customer', 'designer'}:
            raise ValueError('Role must be customer or designer.')
        return role


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

    id: int
    full_name: str
    username: str
    email: str
    nic_number: str
    role: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = 'bearer'
    user: AuthUserResponse


class UserResponse(AuthUserResponse):
    profile_completed: bool
    is_active: bool
    is_verified: bool
    created_at: datetime
    updated_at: datetime
