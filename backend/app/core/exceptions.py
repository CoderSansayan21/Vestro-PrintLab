class DomainError(Exception):
    """Base class for framework-independent domain errors."""


class UserError(DomainError):
    """Base class for user-related domain errors."""


class UserAlreadyExistsError(UserError):
    """Raised when a user cannot be created because a unique identity already exists."""

    def __init__(self, field: str, message: str) -> None:
        self.field = field
        super().__init__(message)


class EmailAlreadyExistsError(UserAlreadyExistsError):
    """Raised when a user email address is already registered."""

    def __init__(self, message: str = 'An account with this email already exists.') -> None:
        super().__init__('email', message)


class UsernameAlreadyExistsError(UserAlreadyExistsError):
    """Raised when a username is already registered."""

    def __init__(self, message: str = 'An account with this username already exists.') -> None:
        super().__init__('username', message)


class NICAlreadyExistsError(UserAlreadyExistsError):
    """Raised when a NIC number is already registered."""

    def __init__(self, message: str = 'An account with this NIC number already exists.') -> None:
        super().__init__('nic_number', message)


class UserNotFoundError(UserError):
    """Raised when a requested user does not exist."""


class AuthenticationError(DomainError):
    """Base class for authentication-related domain errors."""


class InvalidCredentialsError(AuthenticationError):
    """Raised when supplied login credentials are invalid."""


class InactiveUserError(AuthenticationError):
    """Raised when an inactive user attempts an operation requiring an active account."""


class UnverifiedUserError(AuthenticationError):
    """Raised when a user must verify their account before continuing."""


class AccessDeniedError(AuthenticationError):
    """Raised when an authenticated user does not have permission for an operation."""


class InvalidResetTokenError(AuthenticationError):
    """Raised when a password reset token is missing, invalid, expired, or already used."""


class TokenError(AuthenticationError):
    """Base class for access-token domain errors."""


class ExpiredTokenError(TokenError):
    """Raised when an access token has expired."""


class InvalidTokenError(TokenError):
    """Raised when an access token is malformed, unverifiable, or missing required claims."""
