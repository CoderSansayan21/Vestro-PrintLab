import logging
import smtplib
from dataclasses import dataclass
from email.message import EmailMessage
from urllib.parse import parse_qs, urlparse

from app.core.config import Settings, get_settings

logger = logging.getLogger(__name__)


class EmailDeliveryError(RuntimeError):
    """Raised when an email adapter cannot deliver a message."""


@dataclass(frozen=True)
class PasswordResetEmail:
    """Development outbox record for password reset emails."""

    recipient: str
    reset_url: str

    @property
    def reset_token(self) -> str | None:
        """Return the reset token from the development URL for local testing only."""
        parsed_url = urlparse(self.reset_url)
        query_token = parse_qs(parsed_url.query).get('token')
        if query_token:
            return query_token[0]

        path_token = parsed_url.path.rstrip('/').split('/')[-1]
        return path_token or None


class EmailService:
    """Base email service contract."""

    def send_password_reset_email(self, *, recipient: str, reset_url: str) -> None:
        """Send a password reset link to the recipient."""
        raise NotImplementedError


class DevelopmentEmailService(EmailService):
    """Development email adapter that stores and logs reset links locally."""

    def __init__(self, *, log_reset_url: bool = True) -> None:
        self.log_reset_url = log_reset_url
        self.outbox: list[PasswordResetEmail] = []

    def send_password_reset_email(self, *, recipient: str, reset_url: str) -> None:
        """Store the password reset link in memory and log a safe development event."""
        self.outbox.append(PasswordResetEmail(recipient=recipient, reset_url=reset_url))

        if self.log_reset_url:
            logger.info('Development password reset link prepared for %s.', recipient)

    def clear(self) -> None:
        """Clear the development outbox."""
        self.outbox.clear()


class SMTPEmailService(EmailService):
    """SMTP-backed email adapter configured through environment variables."""

    def __init__(self, settings: Settings) -> None:
        self.settings = settings

    def send_password_reset_email(self, *, recipient: str, reset_url: str) -> None:
        """Send a password reset link through SMTP."""
        if not self.settings.smtp_host or not self.settings.email_from:
            raise EmailDeliveryError('SMTP email service is not configured.')

        message = EmailMessage()
        message['From'] = self.settings.email_from
        message['To'] = recipient
        message['Subject'] = 'Reset your VESTRO PRINTLAB password'
        message.set_content(
            'Use the link below to reset your VESTRO PRINTLAB password.\n\n'
            f'{reset_url}\n\n'
            'If you did not request this, you can ignore this email.'
        )

        try:
            with smtplib.SMTP(self.settings.smtp_host, self.settings.smtp_port, timeout=10) as smtp:
                smtp.starttls()
                if self.settings.smtp_username and self.settings.smtp_password:
                    smtp.login(self.settings.smtp_username, self.settings.smtp_password)
                smtp.send_message(message)
        except OSError as exc:
            raise EmailDeliveryError('Unable to send password reset email.') from exc


development_email_service = DevelopmentEmailService()


def get_email_service(settings: Settings | None = None) -> EmailService:
    """Return the configured email service or a development adapter."""
    resolved_settings = settings or get_settings()

    if resolved_settings.smtp_host and resolved_settings.email_from:
        return SMTPEmailService(resolved_settings)

    development_email_service.log_reset_url = resolved_settings.app_env.lower() in {'development', 'dev', 'local'}
    return development_email_service
