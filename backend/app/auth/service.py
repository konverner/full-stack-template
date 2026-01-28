from sqlalchemy.orm import Session
from sqlalchemy import select
from fastapi import HTTPException, status
from typing import Optional

from ..users.models import User
from . import security
from ..users import schemas as user_schemas


class AuthService:
    def get_user_by_email(self, db: Session, email: str) -> Optional[User]:
        result = db.execute(select(User).filter(User.email == email))
        return result.scalar_one_or_none()

    def get_user_by_username(self, db: Session, username: str) -> Optional[User]:
        result = db.execute(select(User).filter(User.username == username))
        return result.scalar_one_or_none()

    def get_user_by_id(self, db: Session, user_id: int) -> Optional[User]:
        result = db.execute(select(User).filter(User.id == user_id))
        return result.scalar_one_or_none()

    def username_exists(self, db: Session, username: str) -> bool:
        """Check if a username already exists in the database."""
        return self.get_user_by_username(db, username=username) is not None

    def create_user(self, db: Session, user_in: user_schemas.UserCreate) -> User:
        # Check if username already exists
        if self.username_exists(db, username=user_in.username):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Username '{user_in.username}' is already taken. Please choose a different username.",
            )

        # Check if email already exists (if provided)
        if user_in.email and self.get_user_by_email(db, email=user_in.email):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Email '{user_in.email}' is already registered. Please use a different email address.",
            )

        hashed_password = security.get_password_hash(user_in.password)
        db_user = User(
            username=user_in.username,
            email=user_in.email,
            avatar_url=user_in.avatar_url,
            password_hash=hashed_password,
            is_superuser=user_in.is_superuser,
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user

    def authenticate_user(
        self, db: Session, username: str, password: str
    ) -> Optional[User]:
        user = self.get_user_by_username(db, username=username)
        if not user or not security.verify_password(password, user.password_hash):
            return None
        return user

    def update_user_profile(
        self, db: Session, db_user: User, user_in: user_schemas.UserUpdate
    ) -> User:
        update_data = user_in.model_dump(exclude_unset=True)

        if "username" in update_data and update_data["username"] != db_user.username:
            existing_user = self.get_user_by_username(
                db, username=update_data["username"]
            )
            if existing_user and existing_user.id != db_user.id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Username already taken",
                )
            db_user.username = update_data["username"]

        if "avatar_url" in update_data:
            db_user.avatar_url = update_data["avatar_url"]

        db.commit()
        db.refresh(db_user)
        return db_user

    def update_user_password(
        self, db: Session, db_user: User, password_in: user_schemas.UserPasswordUpdate
    ) -> User:
        if not security.verify_password(
            password_in.current_password, db_user.password_hash
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Incorrect current password",
            )

        db_user.password_hash = security.get_password_hash(password_in.new_password)
        db.commit()
        return db_user


auth_service = AuthService()
