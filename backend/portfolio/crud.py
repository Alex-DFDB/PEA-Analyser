"""
CRUD operations for portfolio positions.
"""
from datetime import datetime
from typing import List, Optional
from decimal import Decimal
from peewee import DoesNotExist
from portfolio.models import Position
from auth.models import User


def get_user_positions(id_user: str) -> List[Position]:
    """
    Get all positions for a specific user.

    Args:
        id_user: User ID

    Returns:
        List of positions
    """
    return list(Position.select().where(Position.user == id_user).order_by(Position.ticker))


def get_position(position_id: int, id_user: str) -> Optional[Position]:
    """
    Get a specific position by ID for a user.

    Args:
        position_id: Position ID
        id_user: User ID

    Returns:
        Position object or None if not found
    """
    try:
        return Position.get((Position.id == position_id) & (Position.user == id_user))
    except DoesNotExist:
        return None


def create_position(
    id_user: str,
    ticker: str,
    name: str,
    quantity: Decimal,
    buy_price: Decimal,
    color: Optional[str] = None
) -> Position:
    """
    Create a new position for a user.

    Args:
        id_user: User ID
        ticker: Stock ticker
        name: Company name
        quantity: Number of shares
        buy_price: Purchase price
        color: Hex color code (optional)

    Returns:
        Created position

    Raises:
        IntegrityError: If position with same ticker already exists for user
    """
    position = Position.create(
        user=id_user,
        ticker=ticker.upper(),
        name=name,
        quantity=quantity,
        buy_price=buy_price,
        color=color,
        created_at=datetime.now(),
        updated_at=datetime.now()
    )
    return position


def update_position(
    position_id: int,
    id_user: str,
    name: Optional[str] = None,
    quantity: Optional[Decimal] = None,
    buy_price: Optional[Decimal] = None,
    color: Optional[str] = None
) -> Optional[Position]:
    """
    Update an existing position.

    Args:
        position_id: Position ID
        id_user: User ID
        name: New company name (optional)
        quantity: New quantity (optional)
        buy_price: New buy price (optional)
        color: New color (optional)

    Returns:
        Updated position or None if not found
    """
    position = get_position(position_id, id_user)
    if not position:
        return None

    # Update fields
    if name is not None:
        position.name = name
    if quantity is not None:
        position.quantity = quantity
    if buy_price is not None:
        position.buy_price = buy_price
    if color is not None:
        position.color = color

    position.updated_at = datetime.now()
    position.save()

    return position


def delete_position(position_id: int, id_user: str) -> bool:
    """
    Delete a position.

    Args:
        position_id: Position ID
        id_user: User ID

    Returns:
        True if deleted, False if not found
    """
    position = get_position(position_id, id_user)
    if not position:
        return False

    position.delete_instance()
    return True


def upsert_position(
    id_user: str,
    ticker: str,
    name: str,
    quantity: Decimal,
    buy_price: Decimal,
    color: Optional[str] = None
) -> Position:
    """
    Create or update a position (used for bulk import).

    Args:
        id_user: User ID
        ticker: Stock ticker
        name: Company name
        quantity: Number of shares
        buy_price: Purchase price
        color: Hex color code (optional)

    Returns:
        Created or updated position
    """
    try:
        # Try to find existing position
        position = Position.get((Position.user == id_user) & (Position.ticker == ticker.upper()))

        # Update existing position
        position.name = name
        position.quantity = quantity
        position.buy_price = buy_price
        if color:
            position.color = color
        position.updated_at = datetime.now()
        position.save()

        return position
    except DoesNotExist:
        # Create new position
        return create_position(id_user, ticker, name, quantity, buy_price, color)
