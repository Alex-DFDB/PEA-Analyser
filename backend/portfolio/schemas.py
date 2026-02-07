"""
Pydantic schemas for portfolio positions.
"""
from datetime import datetime
from decimal import Decimal
from typing import Optional, List
from pydantic import BaseModel, Field, field_serializer


class PositionCreate(BaseModel):
    """Schema for creating a new position."""

    ticker: str = Field(..., max_length=20, description="Stock ticker symbol")
    quantity: Decimal = Field(..., gt=0, description="Number of shares")
    buy_price: Decimal = Field(..., gt=0, description="Purchase price per share", validation_alias="buyPrice")
    color: Optional[str] = Field(None, max_length=7, pattern=r'^#[0-9A-Fa-f]{6}$', description="Hex color code")

    class Config:
        populate_by_name = True


class PositionUpdate(BaseModel):
    """Schema for updating an existing position."""

    quantity: Optional[Decimal] = Field(None, gt=0)
    buy_price: Optional[Decimal] = Field(None, gt=0, validation_alias="buyPrice")
    color: Optional[str] = Field(None, max_length=7, pattern=r'^#[0-9A-Fa-f]{6}$')

    class Config:
        populate_by_name = True


class PositionResponse(BaseModel):
    """Schema for position response."""

    id: int
    ticker: str
    quantity: Decimal = Field(serialization_alias="quantity")
    buy_price: Decimal = Field(serialization_alias="buyPrice")
    color: Optional[str]
    created_at: datetime = Field(serialization_alias="createdAt")
    updated_at: datetime = Field(serialization_alias="updatedAt")

    class Config:
        from_attributes = True
        populate_by_name = True

    @field_serializer('quantity', 'buy_price')
    def serialize_decimal(self, value: Decimal) -> float:
        """Convert Decimal to float for JSON serialization."""
        return float(value)


class PositionImport(BaseModel):
    """Schema for importing a position from JSON."""

    ticker: str
    quantity: Decimal
    buyPrice: Decimal  # Note: camelCase for frontend compatibility
    color: Optional[str] = None


class BulkImportRequest(BaseModel):
    """Schema for bulk import request."""

    positions: List[PositionImport]
