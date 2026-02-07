"""
Pydantic schemas for authentication.
"""
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field, field_validator
from config import settings


class UserRegister(BaseModel):
    """Schema for user registration."""

    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=settings.MIN_PASSWORD_LENGTH)

    @field_validator('username')
    @classmethod
    def username_alphanumeric(cls, v):
        """Validate username contains only alphanumeric characters and underscores."""
        if not v.replace('_', '').isalnum():
            raise ValueError('Username must contain only alphanumeric characters and underscores')
        return v


class UserLogin(BaseModel):
    """Schema for user login."""

    username: str  # Can be email or username
    password: str


class Token(BaseModel):
    """Schema for token response."""

    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    """Schema for token payload data."""

    id_user: str


class UserResponse(BaseModel):
    """Schema for user information response."""

    id: str
    email: str
    username: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True
