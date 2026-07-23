from datetime import datetime
from enum import Enum

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator

from app.core.validators import FullName, NormalizedEmail, PhoneNumber, SriLankanNIC, StrongPassword, Username


class UserRole(str, Enum):
    CUSTOMER = 'customer'
    DESIGNER = 'designer'
    ADMIN = 'admin'


class UserBase(BaseModel):
    full_name: FullName = Field(..., min_length=2, max_length=120)
    username: Username = Field(..., min_length=3, max_length=30)
    email: NormalizedEmail
    nic_number: SriLankanNIC = Field(..., max_length=20)
    phone_number: PhoneNumber = Field(default=None, max_length=30)


class UserCreate(UserBase):
    password: StrongPassword = Field(..., min_length=8, max_length=72)
    confirm_password: str = Field(..., min_length=8, max_length=72)
    role: UserRole = UserRole.CUSTOMER

    @model_validator(mode='after')
    def validate_password_confirmation(self) -> 'UserCreate':
        if self.password != self.confirm_password:
            raise ValueError('Password and confirm password must match.')

        return self


class UserUpdate(BaseModel):
    full_name: FullName | None = Field(default=None, min_length=2, max_length=120)
    phone_number: PhoneNumber = Field(default=None, max_length=30)
    avatar_url: str | None = Field(default=None, max_length=500)

    @field_validator('avatar_url')
    @classmethod
    def normalize_avatar_url(cls, value: str | None) -> str | None:
        if value is None:
            return None

        avatar_url = value.strip()
        return avatar_url or None


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    full_name: str
    username: str
    email: NormalizedEmail
    nic_number: str
    role: UserRole
    avatar_url: str | None = None
    phone_number: str | None = None
    profile_completed: bool
    is_active: bool
    is_verified: bool
    created_at: datetime
    updated_at: datetime


class UserPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    full_name: str
    username: str
    avatar_url: str | None = None


class UserMeResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    username: str
    email: NormalizedEmail
    role: UserRole
    avatar: str | None = None
    created_at: datetime
