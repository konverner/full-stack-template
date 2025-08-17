from sqlalchemy import Boolean, Column, Integer, Float, String, Text, ForeignKey
from sqlalchemy.orm import relationship

from ..models import Base, TimeStampMixin


class Item(Base, TimeStampMixin):
    """
    Generic base model for rankable items (Exchanges, Books, etc.).
    Uses joined table inheritance.
    """

    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(255), nullable=False, index=True)
    slug = Column(String(255), nullable=False, unique=True, index=True)
    description = Column(Text, nullable=True)
    rating = Column(Float, nullable=True, default=0)
    image_url = Column(String(512), nullable=True)
    website_url = Column(String(512), nullable=True)
    available = Column(Boolean, nullable=False, default=0)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    # relationship fields
    owner = relationship("User", back_populates="items", foreign_keys=[owner_id])
