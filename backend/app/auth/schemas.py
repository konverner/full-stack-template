from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=50, description="Unique username, 3-50 characters")
    email: Optional[EmailStr] = Field(None, description="User's email address (optional)")
    avatar_url: Optional[str] = Field(None, description="URL to the user's avatar image")


class UserCreate(UserBase):
    password: str = Field(..., min_length=8, description="Password for the user account, at least 8 characters")


class UserRead(UserBase):
    id: int = Field(..., description="Unique identifier for the user")
    is_superuser: bool = Field(..., description="Indicates if the user has superuser privileges")
    email_verified_at: Optional[datetime] = Field(None, description="Timestamp when the user's email was verified")
    created_at: datetime = Field(..., description="Timestamp when the user account was created")

    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    username: Optional[str] = Field(None, min_length=3, max_length=50, description="New username for the user, 3-50 characters")
    avatar_url: Optional[str] = Field(None, description="New URL to the user's avatar image")


class UserPasswordUpdate(BaseModel):
    current_password: str = Field(..., description="Current password of the user")
    new_password: str = Field(..., min_length=8, description="New password for the user account, at least 8 characters")


class LoginRequest(BaseModel):
    username: str = Field(..., description="Username of the user trying to log in")
    password: str = Field(..., description="Password of the user trying to log in")


class TokenPayload(BaseModel):
    sub: int = Field(..., description="Subject identifier, typically the user ID")
    exp: datetime = Field(..., description="Expiration time of the token")


class Token(BaseModel):
    access_token: str = Field(..., description="JWT access token")
    refresh_token: str = Field(..., description="JWT refresh token")
    token_type: str = Field("bearer", description="Type of the token, typically 'bearer'")


class RefreshTokenRequest(BaseModel):
    refresh_token: str = Field(..., description="Refresh token to obtain a new access token")