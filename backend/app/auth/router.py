from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlalchemy.orm import Session
from typing import Annotated

from ..database.core import get_db

from . import schemas
from .service import auth_service
from . import security
from ..dependencies import get_current_active_user
from .models import User
from .. import schemas as common_schemas

router = APIRouter()

@router.post("/register", response_model=schemas.UserRead, status_code=status.HTTP_201_CREATED)
async def register_user(
    user_in: schemas.UserCreate,
    db: Session = Depends(get_db)
):
    """
    Register a new user.
    """
    db_user = auth_service.create_user(db=db, user_in=user_in) # Removed await (already done in input)
    return db_user

@router.post("/token", response_model=schemas.Token)
async def login_for_access_token(
    db: Session = Depends(get_db),
    form_data: schemas.LoginRequest = Body(...) # Use Body for JSON payload
):
    """
    Authenticate user and return access and refresh tokens.
    """
    user = auth_service.authenticate_user( # Removed await (already done in input)
        db, email=form_data.email, password=form_data.password
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = security.create_access_token(subject=user.id)
    refresh_token = security.create_refresh_token(subject=user.id)

    return schemas.Token(access_token=access_token, refresh_token=refresh_token)

@router.post("/refresh", response_model=schemas.Token)
async def refresh_access_token(
    refresh_request: schemas.RefreshTokenRequest,
    db: Session = Depends(get_db)
):
    """
    Get a new access token using a refresh token.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate refresh token",
        headers={"WWW-Authenticate": "Bearer"},
    )
    payload = security.decode_token(refresh_request.refresh_token)
    if payload is None or payload.get("type") != "refresh":
        raise credentials_exception

    user_id_str = payload.get("sub")
    if user_id_str is None:
        raise credentials_exception
    try:
        user_id = int(user_id_str)
    except ValueError:
        raise credentials_exception

    user = auth_service.get_user_by_id(db=db, user_id=user_id) # Removed await (already done in input)
    if user is None:
        raise credentials_exception # User might have been deleted

    # Generate new tokens
    new_access_token = security.create_access_token(subject=user.id)
    # Optionally, generate a new refresh token as well for rotation
    new_refresh_token = security.create_refresh_token(subject=user.id)

    return schemas.Token(access_token=new_access_token, refresh_token=new_refresh_token)


# --- User Info Endpoints ---

CurrentUser = Annotated[User, Depends(get_current_active_user)]

@router.get("/me", response_model=schemas.UserRead)
async def read_users_me(current_user: CurrentUser):
    """
    Get current logged-in user's profile.
    """
    return current_user

@router.patch("/me", response_model=schemas.UserRead)
async def update_users_me(
    user_in: schemas.UserUpdate,
    current_user: CurrentUser,
    db: Session = Depends(get_db),
):
    """
    Update current logged-in user's profile (name, avatar).
    """
    updated_user = auth_service.update_user_profile(db=db, db_user=current_user, user_in=user_in) # Removed await (already done in input)
    return updated_user

# --- Password Endpoints ---
@router.put("/password", response_model=common_schemas.Message)
async def update_users_password(
    password_in: schemas.UserPasswordUpdate,
    current_user: CurrentUser,
    db: Session = Depends(get_db),
):
    """
    Update current logged-in user's password.
    """
    auth_service.update_user_password(db=db, db_user=current_user, password_in=password_in)
    return common_schemas.Message(message="Password updated successfully")
