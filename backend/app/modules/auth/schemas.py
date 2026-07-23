from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator

from app.core.validators import FullName, NormalizedEmail, SriLankanNIC, StrongPassword, Username


class UserRegisterRequest(BaseModel):
    full_name: FullName = Field(..., min_length=2, max_length=120)
    username: Username = Field(..., min_length=3, max_length=30)
    email: NormalizedEmail = Field(..., max_length=255)
    nic_number: SriLankanNIC = Field(..., max_length=20)
    password: StrongPassword = Field(..., min_length=8, max_length=72)
    confirm_password: str = Field(..., min_length=8, max_length=72)
    role: str = Field(default='customer', max_length=20)

    @model_validator(mode='after')
    def validate_password_confirmation(self) -> 'UserRegisterRequest':
        if self.password != self.confirm_password:
            raise ValueError('Password and confirm password must match.')

        return self

    @field_validator('role')
    @classmethod
    def validate_role(cls, value: str) -> str:
        role = value.strip().lower()
        if role not in {'customer', 'designer'}:
            raise ValueError('Role must be customer or designer.')
        return role


class LoginRequest(BaseModel):
    email: NormalizedEmail = Field(..., max_length=255)
    password: str = Field(..., min_length=1, max_length=72)


class ForgotPasswordRequest(BaseModel):
    email: NormalizedEmail = Field(..., max_length=255)


class ForgotPasswordResponse(BaseModel):
    message: str


class ResetPasswordRequest(BaseModel):
    token: str = Field(..., min_length=20, max_length=255)
    new_password: StrongPassword = Field(..., min_length=8, max_length=72)

    @field_validator('token')
    @classmethod
    def validate_token(cls, value: str) -> str:
        token = value.strip()
        if not token:
            raise ValueError('Reset token is required.')
        return token

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
    token_type: str = 'Bearer'
    user: AuthUserResponse


class UserResponse(AuthUserResponse):
    profile_completed: bool
    is_active: bool
    is_verified: bool
    created_at: datetime
    updated_at: datetime


class RegisterResponse(BaseModel):
    message: str
    user: UserResponse
