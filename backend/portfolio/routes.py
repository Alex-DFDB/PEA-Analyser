"""
Portfolio API routes.
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from peewee import IntegrityError
from auth.models import User
from auth.dependencies import get_current_user
from portfolio.schemas import (
    PositionCreate,
    PositionUpdate,
    PositionResponse,
    BulkImportRequest,
    PositionImport
)
from portfolio import crud


router = APIRouter(prefix="/portfolio", tags=["Portfolio"])


@router.get("/positions", response_model=List[PositionResponse])
async def list_positions(current_user: User = Depends(get_current_user)):
    """
    Get all positions for the current user.

    Args:
        current_user: Current authenticated user

    Returns:
        List of positions
    """
    positions = crud.get_user_positions(current_user.id_user)
    return [PositionResponse.model_validate(p) for p in positions]


@router.post("/positions", response_model=PositionResponse, status_code=status.HTTP_201_CREATED)
async def create_position(
    position_data: PositionCreate,
    current_user: User = Depends(get_current_user)
):
    """
    Create a new position.

    Args:
        position_data: Position data
        current_user: Current authenticated user

    Returns:
        Created position

    Raises:
        HTTPException: If position with same ticker already exists
    """
    try:
        position = crud.create_position(
            id_user=current_user.id_user,
            ticker=position_data.ticker,
            quantity=position_data.quantity,
            buy_price=position_data.buy_price,
            color=position_data.color
        )
        return PositionResponse.model_validate(position)
    except IntegrityError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Position with ticker {position_data.ticker} already exists"
        )


@router.get("/positions/{position_id}", response_model=PositionResponse)
async def get_position(
    position_id: int,
    current_user: User = Depends(get_current_user)
):
    """
    Get a specific position.

    Args:
        position_id: Position ID
        current_user: Current authenticated user

    Returns:
        Position details

    Raises:
        HTTPException: If position not found
    """
    position = crud.get_position(position_id, current_user.id_user)
    if not position:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Position not found"
        )
    return PositionResponse.model_validate(position)


@router.put("/positions/{position_id}", response_model=PositionResponse)
async def update_position(
    position_id: int,
    position_data: PositionUpdate,
    current_user: User = Depends(get_current_user)
):
    """
    Update a position.

    Args:
        position_id: Position ID
        position_data: Updated position data
        current_user: Current authenticated user

    Returns:
        Updated position

    Raises:
        HTTPException: If position not found
    """
    position = crud.update_position(
        position_id=position_id,
        id_user=current_user.id_user,
        quantity=position_data.quantity,
        buy_price=position_data.buy_price,
        color=position_data.color
    )
    if not position:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Position not found"
        )
    return PositionResponse.model_validate(position)


@router.delete("/positions/{position_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_position(
    position_id: int,
    current_user: User = Depends(get_current_user)
):
    """
    Delete a position.

    Args:
        position_id: Position ID
        current_user: Current authenticated user

    Raises:
        HTTPException: If position not found
    """
    success = crud.delete_position(position_id, current_user.id_user)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Position not found"
        )


@router.post("/import", response_model=List[PositionResponse])
async def bulk_import_positions(
    import_data: BulkImportRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Bulk import positions from JSON file.
    Creates new positions or updates existing ones based on ticker.

    Args:
        import_data: Bulk import data with list of positions
        current_user: Current authenticated user

    Returns:
        List of created/updated positions
    """
    imported_positions = []

    for pos_data in import_data.positions:
        position = crud.upsert_position(
            id_user=current_user.id_user,
            ticker=pos_data.ticker,
            quantity=pos_data.quantity,
            buy_price=pos_data.buyPrice,
            color=pos_data.color
        )
        imported_positions.append(position)

    return [PositionResponse.model_validate(p) for p in imported_positions]


@router.get("/export")
async def export_positions(current_user: User = Depends(get_current_user)):
    """
    Export all positions as JSON.

    Args:
        current_user: Current authenticated user

    Returns:
        List of positions in JSON-compatible format
    """
    positions = crud.get_user_positions(current_user.id_user)

    return [
        {
            "ticker": p.ticker,
            "quantity": float(p.quantity),
            "buyPrice": float(p.buy_price),
            "color": p.color
        }
        for p in positions
    ]
