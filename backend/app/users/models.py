from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship

from ..models import Base, TimeStampMixin


class User(Base, TimeStampMixin):
    """SQLAlchemy model for users."""

    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(String(100), nullable=False, unique=True, index=True)
    email = Column(String(255), nullable=True, unique=True, index=True)
    password_hash = Column(String(255), nullable=False)
    avatar_url = Column(String(512), nullable=True)
    is_superuser = Column(Boolean, nullable=False, default=False)
    is_active = Column(Boolean, nullable=False, default=True)

    items = relationship("Item", back_populates="owner")

    def __repr__(self):
        return f"<User(id={self.id}, username='{self.username}', email='{self.email}')>"
