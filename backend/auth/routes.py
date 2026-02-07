"""
Authentication API routes.
"""
import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from fastapi.security import OAuth2PasswordRequestForm
from peewee import IntegrityError
from auth.models import User
from auth.schemas import UserRegister, Token, UserResponse
from auth.security import hash_password, verify_password, create_access_token, create_refresh_token, decode_token
from auth.dependencies import get_current_user


router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserRegister, response: Response):
    """
    Register a new user account.

    Args:
        user_data: User registration data
        response: FastAPI response object (for setting cookies)

    Returns:
        Access token

    Raises:
        HTTPException: If email or username already exists
    """
    # Check if user already exists
    try:
        # Hash password
        hashed_password = hash_password(user_data.password)

        # Create user
        user = User.create(
            id_user=str(uuid.uuid4()),
            email=user_data.email,
            username=user_data.username,
            hashed_password=hashed_password,
            is_active=True,
            created_at=datetime.now(),
            updated_at=datetime.now()
        )

        # Generate tokens
        access_token = create_access_token(data={"sub": user.id_user})
        refresh_token = create_refresh_token(data={"sub": user.id_user})

        # Set refresh token as HTTPOnly cookie
        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
            secure=False,  # Set to True in production with HTTPS
            samesite="lax",
            max_age=7 * 24 * 60 * 60  # 7 days
        )

        return Token(access_token=access_token)

    except IntegrityError as e:
        error_message = str(e)
        if "email" in error_message:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        elif "username" in error_message:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken"
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Registration failed"
            )


@router.post("/login", response_model=Token)
async def login(
    response: Response,
    form_data: OAuth2PasswordRequestForm = Depends()
):
    """
    Login with username/email and password.

    Args:
        response: FastAPI response object (for setting cookies)
        form_data: OAuth2 password form (username can be email or username)

    Returns:
        Access token

    Raises:
        HTTPException: If credentials are invalid
    """
    # Try to find user by username or email
    user = None
    try:
        user = User.get(User.username == form_data.username)
    except User.DoesNotExist:
        try:
            user = User.get(User.email == form_data.username)
        except User.DoesNotExist:
            pass

    # Verify user exists and password is correct
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username/email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Check if user is active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive"
        )

    # Generate tokens
    access_token = create_access_token(data={"sub": user.id_user})
    refresh_token = create_refresh_token(data={"sub": user.id_user})

    # Set refresh token as HTTPOnly cookie
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=False,  # Set to True in production with HTTPS
        samesite="lax",
        max_age=7 * 24 * 60 * 60  # 7 days
    )

    # Update last login timestamp
    user.updated_at = datetime.now()
    user.save()

    return Token(access_token=access_token)


@router.post("/logout")
async def logout(response: Response):
    """
    Logout user by clearing refresh token cookie.

    Args:
        response: FastAPI response object

    Returns:
        Success message
    """
    # Clear refresh token cookie
    response.delete_cookie(key="refresh_token")

    return {"message": "Successfully logged out"}


@router.post("/refresh", response_model=Token)
async def refresh_access_token(request: Request, response: Response):
    """
    Refresh access token using the refresh token from HTTPOnly cookie.

    Args:
        request: FastAPI request object (to read cookies)
        response: FastAPI response object (to set new cookies)

    Returns:
        New access token

    Raises:
        HTTPException: If refresh token is invalid or expired
    """
    # Get refresh token from cookie
    refresh_token = request.cookies.get("refresh_token")

    if not refresh_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token not found",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Decode and verify refresh token
    payload = decode_token(refresh_token)

    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Extract id_user from token
    id_user: str = payload.get("sub")
    if id_user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Get user from database
    try:
        user = User.get_by_id(id_user)
    except User.DoesNotExist:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Check if user is active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive"
        )

    # Generate new tokens
    new_access_token = create_access_token(data={"sub": user.id_user})
    new_refresh_token = create_refresh_token(data={"sub": user.id_user})

    # Set new refresh token as HTTPOnly cookie
    response.set_cookie(
        key="refresh_token",
        value=new_refresh_token,
        httponly=True,
        secure=False,  # Set to True in production with HTTPS
        samesite="lax",
        max_age=7 * 24 * 60 * 60  # 7 days
    )

    return Token(access_token=new_access_token)


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """
    Get current authenticated user information.

    Args:
        current_user: Current user from dependency

    Returns:
        User information
    """
    return UserResponse(
        id=current_user.id_user,
        email=current_user.email,
        username=current_user.username,
        is_active=current_user.is_active,
        created_at=current_user.created_at
    )
