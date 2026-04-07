from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session, selectinload

from ..database.core import get_db
from ..dependencies import get_current_active_user
from . import schemas as user_schemas
from .models import User
from .service import user_service

router = APIRouter()


@router.get("/", response_model=user_schemas.UserListResponse)
def list_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    username: str = Query(None),
    email: str = Query(None),
    is_active: bool = Query(None),
    created_at_from: datetime = Query(
        None, description="Filter users created on or after this datetime"
    ),
    created_at_to: datetime = Query(
        None, description="Filter users created on or before this datetime"
    ),
    sort_field: str = Query("id"),
    sort_direction: str = Query("asc"),
    db: Session = Depends(get_db),
):
    """
    List users with filtering, sorting, and pagination.
    """
    filters = user_schemas.UserFilter(
        username=username,
        email=email,
        is_active=is_active,
        created_at_from=created_at_from,
        created_at_to=created_at_to,
    )
    sort = user_schemas.UserSort(field=sort_field, direction=sort_direction)
    users = user_service.list_users(
        db=db,
        skip=skip,
        limit=limit,
        filters=filters,
        sort=sort,
        options=[selectinload(User.items)],
    )
    return users


@router.post(
    "/", response_model=user_schemas.UserRead, status_code=status.HTTP_201_CREATED
)
def create_user(
    user_in: user_schemas.UserCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """
    Create a new user.
    """
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions"
        )

    existing_user = user_service.get_user_by_username(db=db, username=user_in.username)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Username already exists"
        )

    user = user_service.create_user(db=db, user_in=user_in)
    return user


@router.get("/{username}", response_model=user_schemas.UserRead)
def get_user_by_username(username: str, db: Session = Depends(get_db)):
    """
    Get a specific user by username.
    """
    user = user_service.get_user_by_username(
        db=db, username=username, options=[selectinload(User.items)]
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    return user


@router.put("/{username}", response_model=user_schemas.UserRead)
def update_user_by_username(
    username: str,
    user_in: user_schemas.UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """
    Update a user by username.
    """
    user = user_service.get_user_by_username(db=db, username=username)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    # Users can update their own profile, superusers can update any profile
    if user.id != current_user.id and not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions"
        )

    # Check username uniqueness if being updated
    if user_in.username is not None and user_in.username != user.username:
        existing_user = user_service.get_user_by_username(db=db, username=user_in.username)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Username already exists"
            )

    updated_user = user_service.update_user(db=db, user=user, user_in=user_in)
    return updated_user


@router.delete("/{username}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user_by_username(
    username: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """
    Delete a user by username.
    """
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions"
        )

    user = user_service.get_user_by_username(db=db, username=username)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    # Prevent deletion of the current user
    if user.id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete your own account",
        )

    user_service.delete_user(db=db, user=user)
    return None
