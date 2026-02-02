"""
Pydantic schemas for portfolio positions.
"""
from datetime import datetime
from decimal import Decimal
from typing import Optional, List
from pydantic import BaseModel, Field


class PositionCreate(BaseModel):
    """Schema for creating a new position."""

    ticker: str = Field(..., max_length=20, description="Stock ticker symbol")
    name: str = Field(..., max_length=255, description="Company name")
    quantity: Decimal = Field(..., gt=0, description="Number of shares")
    buy_price: Decimal = Field(..., gt=0, description="Purchase price per share")
    color: Optional[str] = Field(None, max_length=7, pattern=r'^#[0-9A-Fa-f]{6}$', description="Hex color code")


class PositionUpdate(BaseModel):
    """Schema for updating an existing position."""

    name: Optional[str] = Field(None, max_length=255)
    quantity: Optional[Decimal] = Field(None, gt=0)
    buy_price: Optional[Decimal] = Field(None, gt=0)
    color: Optional[str] = Field(None, max_length=7, pattern=r'^#[0-9A-Fa-f]{6}$')


class PositionResponse(BaseModel):
    """Schema for position response."""

    id: int
    ticker: str
    name: str
    quantity: Decimal
    buy_price: Decimal
    color: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class PositionImport(BaseModel):
    """Schema for importing a position from JSON."""

    ticker: str
    name: Optional[str] = None
    quantity: Decimal
    buyPrice: Decimal  # Note: camelCase for frontend compatibility
    color: Optional[str] = None


class BulkImportRequest(BaseModel):
    """Schema for bulk import request."""

    positions: List[PositionImport]
