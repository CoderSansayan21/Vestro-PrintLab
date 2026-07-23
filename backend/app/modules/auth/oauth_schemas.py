from pydantic import BaseModel, Field


class GoogleOAuthStartResponse(BaseModel):
    provider: str = 'google'
    authorization_url: str


class GoogleOAuthCallbackRequest(BaseModel):
    code: str = Field(..., min_length=1)
    state: str = Field(..., min_length=1)
