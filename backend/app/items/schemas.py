from pydantic import BaseModel, field_validator, ConfigDict
from typing import Optional
import re
from datetime import datetime
from ..users.schemas import UserRead


class ItemBase(BaseModel):
    name: str
    slug: Optional[str] = None
    description: Optional[str] = None
    rating: Optional[float] = None
    available: Optional[bool] = True
    image_url: Optional[str] = None
    website_url: Optional[str] = None

    @field_validator("slug")
    def validate_slug(cls, v):
        if v is not None:
            # Check if slug matches URL-friendly pattern
            if not re.match(r"^[a-z0-9]+(?:-[a-z0-9]+)*$", v):
                raise ValueError(
                    "Slug must contain only lowercase letters, numbers, and hyphens. Cannot start or end with hyphens."
                )
            # Check length
            if len(v) > 255:
                raise ValueError("Slug cannot exceed 255 characters")
            if len(v) < 1:
                raise ValueError("Slug cannot be empty")
        return v

    model_config = ConfigDict(extra="ignore")


class ItemCreate(ItemBase):
    model_config = ConfigDict(extra="ignore")


class ItemUpdate(ItemBase):
    name: Optional[str] = None
    available: Optional[bool] = None  # Make this explicitly optional for updates

    model_config = ConfigDict(extra="ignore")


class ItemRead(ItemBase):
    id: int
    slug: str
    available: bool = True  # Remove Optional since this should always have a value
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    owner: Optional[UserRead] = None

    model_config = ConfigDict(from_attributes=True)


class ItemReadDetails(ItemRead):
    available: bool = True  # Remove Optional since this should always have a value
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


# --- Filtering and Sorting ---


class ItemFilter(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    owner_id: Optional[int] = None


class ItemSort(BaseModel):
    field: str
    direction: str  # 'asc' or 'desc'

    model_config = ConfigDict(
        json_schema_extra={"example": {"field": "name", "direction": "asc"}}
    )


class ItemListResponse(BaseModel):
    items: list[ItemRead]
    total: int

    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "items": [
                    {
                        "id": 1,
                        "name": "Example Item",
                        "slug": "example-item",
                        "description": "This is an example item.",
                        "rating": 5,
                        "image_url": "https://example.com/logo.png",
                        "website_url": "https://example.com",
                        "owner_id": 1,
                    }
                ],
                "total": 1,
            }
        },
    )
