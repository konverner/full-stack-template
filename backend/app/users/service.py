from typing import Optional, List, Any
from sqlalchemy.orm import Session
from sqlalchemy import asc, desc
from passlib.context import CryptContext

from .models import User
from . import schemas as user_schemas
from .schemas import validate_username

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class UserService:
    def get_password_hash(self, password: str) -> str:
        return pwd_context.hash(password)

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        return pwd_context.verify(plain_password, hashed_password)

    def list_users(
        self,
        db: Session,
        skip: int = 0,
        limit: int = 100,
        filters: Optional[user_schemas.UserFilter] = None,
        sort: Optional[user_schemas.UserSort] = None,
        options: Optional[List[Any]] = None,
    ) -> user_schemas.UserListResponse:
        query = db.query(User)

        # Apply filters
        if filters:
            if filters.username:
                query = query.filter(User.username.ilike(f"%{filters.username}%"))
            if filters.email:
                query = query.filter(User.email.ilike(f"%{filters.email}%"))
            if filters.is_active is not None:
                query = query.filter(User.is_active == filters.is_active)

        # Apply sorting
        if sort:
            sort_column = getattr(User, sort.field, User.id)
            if sort.direction == "desc":
                query = query.order_by(desc(sort_column))
            else:
                query = query.order_by(asc(sort_column))

        # Apply options (like selectinload)
        if options:
            for option in options:
                query = query.options(option)

        total = query.count()
        users = query.offset(skip).limit(limit).all()

        return user_schemas.UserListResponse(
            users=users, total=total, skip=skip, limit=limit
        )

    def create_user(self, db: Session, user_in: user_schemas.UserCreate) -> User:
        # Additional validation at service layer
        validated_username = validate_username(user_in.username)

        hashed_password = self.get_password_hash(user_in.password)
        user = User(
            username=validated_username,
            email=user_in.email,
            password_hash=hashed_password,
            avatar_url=user_in.avatar_url,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    def get_user_by_id(
        self, db: Session, user_id: int, options: Optional[List[Any]] = None
    ) -> Optional[User]:
        query = db.query(User)
        if options:
            for option in options:
                query = query.options(option)
        return query.filter(User.id == user_id).first()

    def get_user_by_username(
        self, db: Session, username: str, options: Optional[List[Any]] = None
    ) -> Optional[User]:
        query = db.query(User)
        if options:
            for option in options:
                query = query.options(option)
        return query.filter(User.username == username).first()

    def update_user(
        self, db: Session, user: User, user_in: user_schemas.UserUpdate
    ) -> User:
        update_data = user_in.model_dump(exclude_unset=True)

        # Additional validation for username if it's being updated
        if "username" in update_data and update_data["username"] is not None:
            update_data["username"] = validate_username(update_data["username"])

        for field, value in update_data.items():
            setattr(user, field, value)
        db.commit()
        db.refresh(user)
        return user

    def update_user_password(
        self, db: Session, user: User, password_update: user_schemas.UserPasswordUpdate
    ) -> User:
        if not self.verify_password(
            password_update.current_password, user.password_hash
        ):
            return None
        user.password_hash = self.get_password_hash(password_update.new_password)
        db.commit()
        db.refresh(user)
        return user

    def delete_user(self, db: Session, user: User) -> None:
        db.delete(user)
        db.commit()


user_service = UserService()
