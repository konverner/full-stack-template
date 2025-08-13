from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, selectinload

from ..database.core import get_db
from . import schemas as item_schemas
from .service import item_service
from ..dependencies import get_current_active_user
from ..users.models import User
from .models import Item

router = APIRouter()


@router.get("/", response_model=item_schemas.ItemListResponse)
async def list_items(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    name: str = Query(None),
    description: str = Query(None),
    owner_id: int = Query(None),
    sort_field: str = Query("id"),
    sort_direction: str = Query("asc"),
    db: Session = Depends(get_db),
):
    """
    List items with filtering, sorting, and pagination.
    """
    filters = item_schemas.ItemFilter(
        name=name, description=description, owner_id=owner_id
    )
    sort = item_schemas.ItemSort(field=sort_field, direction=sort_direction)
    items = item_service.list_items(
        db=db,
        skip=skip,
        limit=limit,
        filters=filters,
        sort=sort,
        options=[selectinload(Item.owner)],
    )
    return items


@router.post(
    "/", response_model=item_schemas.ItemRead, status_code=status.HTTP_201_CREATED
)
async def create_item(
    item_in: item_schemas.ItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """
    Create a new item.
    """
    item = item_service.create_item(db=db, item_in=item_in, owner_id=current_user.id)
    db.refresh(item, attribute_names=["owner"])
    return item


@router.get("/{item_slug}", response_model=item_schemas.ItemRead)
async def get_item_by_slug(item_slug: str, db: Session = Depends(get_db)):
    """
    Get a specific item by its slug.
    """
    item = item_service.get_item_by_slug(
        db=db, item_slug=item_slug, options=[selectinload(Item.owner)]
    )
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Item not found"
        )
    return item


@router.put("/{item_slug}", response_model=item_schemas.ItemRead)
async def update_item_by_slug(
    item_slug: str,
    item_in: item_schemas.ItemUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """
    Update an item by slug.
    """
    item = item_service.get_item_by_slug(
        db=db, item_slug=item_slug, options=[selectinload(Item.owner)]
    )
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Item not found"
        )
    if item.owner_id != current_user.id and not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions"
        )
    updated_item = item_service.update_item(db=db, item=item, item_in=item_in)
    db.refresh(updated_item, attribute_names=["owner"])
    return updated_item


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """
    Delete an item.
    """
    item = item_service.get_item_by_id(
        db=db, item_id=item_id, options=[selectinload(Item.owner)]
    )
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Item not found"
        )
    if item.owner_id != current_user.id and not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions"
        )
    item_service.delete_item(db=db, item=item)
    return None
