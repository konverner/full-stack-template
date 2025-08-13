from pydantic import BaseModel, Field
from datetime import datetime


class LoginRequest(BaseModel):
    username: str = Field(..., description="Username of the user trying to log in")
    password: str = Field(..., description="Password of the user trying to log in")


class TokenPayload(BaseModel):
    sub: int = Field(..., description="Subject identifier, typically the user ID")
    exp: datetime = Field(..., description="Expiration time of the token")


class Token(BaseModel):
    access_token: str = Field(..., description="JWT access token")
    refresh_token: str = Field(..., description="JWT refresh token")
    token_type: str = Field(
        "bearer", description="Type of the token, typically 'bearer'"
    )


class RefreshTokenRequest(BaseModel):
    refresh_token: str = Field(
        ..., description="Refresh token to obtain a new access token"
    )
