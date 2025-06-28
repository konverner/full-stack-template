from pydantic import BaseModel, validator
from typing import Optional
import re
from app.auth.schemas import UserRead  # add this import

class ItemBase(BaseModel):
    name: str
    slug: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    website_url: Optional[str] = None

    @validator('slug')
    def validate_slug(cls, v):
        if v is not None:
            # Check if slug matches URL-friendly pattern
            if not re.match(r'^[a-z0-9]+(?:-[a-z0-9]+)*$', v):
                raise ValueError('Slug must contain only lowercase letters, numbers, and hyphens. Cannot start or end with hyphens.')
            # Check length
            if len(v) > 255:
                raise ValueError('Slug cannot exceed 255 characters')
            if len(v) < 1:
                raise ValueError('Slug cannot be empty')
        return v

class ItemCreate(ItemBase):
    pass

class ItemUpdate(ItemBase):
    name: Optional[str] = None

class ItemRead(ItemBase):
    id: int
    slug: str
    average_rating: Optional[float] = None
    owner: Optional[UserRead] = None  # add this field

    class Config:
        orm_mode = True

class ItemReadDetails(ItemRead):
    avaliable: Optional[bool] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

# --- Filtering and Sorting ---

class ItemFilter(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    owner_id: Optional[int] = None

class ItemSort(BaseModel):
    field: str
    direction: str  # 'asc' or 'desc'

    class Config:
        schema_extra = {
            "example": {
                "field": "name",
                "direction": "asc"
            }
        }

class ItemListResponse(BaseModel):
    items: list[ItemRead]
    total: int

    class Config:
        orm_mode = True
        schema_extra = {
            "example": {
                "items": [
                    {
                        "id": 1,
                        "name": "Example Item",
                        "description": "This is an example item.",
                        "image_url": "https://example.com/logo.png",
                        "website_url": "https://example.com",
                        "owner_id": 1
                    }
                ],
                "total": 1
            }
        }