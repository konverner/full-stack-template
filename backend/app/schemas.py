from pydantic import BaseModel, Field
from typing import List, TypeVar, Generic

T = TypeVar("T")


class Message(BaseModel):
    message: str


class PaginationParams(BaseModel):
    skip: int = Field(0, ge=0, description="Number of items to skip")
    limit: int = Field(10, ge=1, le=100, description="Number of items per page")


class PaginatedResponse(BaseModel, Generic[T]):
    total: int = Field(..., description="Total number of items")
    items: List[T] = Field(..., description="List of items on the current page")
    skip: int
    limit: int
