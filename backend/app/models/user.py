from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship
from ..models import Base, TimeStampMixin

class User(Base, TimeStampMixin):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    name = Column(String(255), unique=True, index=True, nullable=False)
    avatar_url = Column(String(512), nullable=True)
    password_hash = Column(String(255), nullable=False)
    is_superuser = Column(Boolean, default=False)
    # ...other fields...

    items = relationship("Item", back_populates="owner")
