"""
Pydantic schemas for market data.
"""
from typing import List
from pydantic import BaseModel


class TickerRequest(BaseModel):
    """Schema for ticker request."""

    tickers: List[str]
