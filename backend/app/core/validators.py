import re
from typing import Annotated

from pydantic import AfterValidator, EmailStr


def normalize_full_name(value: str) -> str:
    full_name = value.strip()

    if len(full_name) < 2:
        raise ValueError('Full name must be at least 2 characters.')

    if not re.fullmatch(r"[A-Za-z][A-Za-z\s'-]*", full_name):
        raise ValueError("Full name may contain only letters, spaces, apostrophes, and hyphens.")

    return full_name


def normalize_email(value: str) -> str:
    return str(value).strip().lower()


def normalize_username(value: str) -> str:
    username = value.strip().lower()

    if len(username) < 3:
        raise ValueError('Username must be at least 3 characters.')

    if not re.fullmatch(r'[a-z0-9_.]{3,30}', username):
        raise ValueError('Username may contain only letters, numbers, underscore, and period.')

    return username


def normalize_nic_number(value: str) -> str:
    nic_number = value.strip().upper()

    if not re.fullmatch(r'(?:\d{9}[VX]|\d{12})', nic_number):
        raise ValueError('Enter a valid Sri Lankan NIC number.')

    return nic_number


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


def normalize_phone_number(value: str | None) -> str | None:
    if value is None:
        return None

    phone_number = value.strip()

    if not phone_number:
        return None

    normalized = phone_number.replace(' ', '').replace('-', '')

    if normalized.startswith('0'):
        normalized = f'+94{normalized[1:]}'
    elif normalized.startswith('94'):
        normalized = f'+{normalized}'

    if not re.fullmatch(r'\+?[0-9]{7,15}', normalized):
        raise ValueError('Enter a valid phone number.')

    return normalized


FullName = Annotated[str, AfterValidator(normalize_full_name)]
NormalizedEmail = Annotated[EmailStr, AfterValidator(normalize_email)]
Username = Annotated[str, AfterValidator(normalize_username)]
SriLankanNIC = Annotated[str, AfterValidator(normalize_nic_number)]
StrongPassword = Annotated[str, AfterValidator(validate_password_strength)]
PhoneNumber = Annotated[str | None, AfterValidator(normalize_phone_number)]
