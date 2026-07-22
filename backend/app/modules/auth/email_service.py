from dataclasses import dataclass


@dataclass(frozen=True)
class PasswordResetEmail:
    recipient: str
    reset_token: str


class EmailService:
    def send_password_reset_email(self, *, recipient: str, reset_token: str) -> None:
        raise NotImplementedError


class DevelopmentEmailService(EmailService):
    def __init__(self) -> None:
        self.outbox: list[PasswordResetEmail] = []

    def send_password_reset_email(self, *, recipient: str, reset_token: str) -> None:
        self.outbox.append(PasswordResetEmail(recipient=recipient, reset_token=reset_token))

    def clear(self) -> None:
        self.outbox.clear()


development_email_service = DevelopmentEmailService()


def get_email_service() -> EmailService:
    return development_email_service