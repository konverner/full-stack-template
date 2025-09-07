from datetime import datetime, timezone
from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from sqlalchemy.orm import Session
from jose import JWTError

from .users.models import User
from .config import settings
from .database.core import get_db
from .auth.security import decode_token
from .auth.service import auth_service

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.AUTH_STR}/token")
oauth2_scheme_optional = OAuth2PasswordBearer(
    tokenUrl=f"{settings.AUTH_STR}/token", auto_error=False
)


# Add the missing type field to the TokenPayload model
class TokenPayload(BaseModel):
    sub: str
    exp: datetime
    type: str


async def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = decode_token(token)
        if payload is None:
            raise credentials_exception

        # Validate that this is an access token
        if payload.get("type") != "access":
            raise credentials_exception

        user_id_str: str = payload.get("sub")
        if user_id_str is None:
            raise credentials_exception

        # Validate token hasn't expired
        token_exp = payload.get("exp")
        if token_exp is None or datetime.fromtimestamp(
            token_exp, tz=timezone.utc
        ) < datetime.now(timezone.utc):
            raise credentials_exception

        user_id = int(user_id_str)
    except (JWTError, ValueError):
        raise credentials_exception

    user = auth_service.get_user_by_id(db=db, user_id=user_id)
    if user is None:
        raise credentials_exception
    return user


async def get_optional_current_active_user(
    token: Optional[str] = Depends(oauth2_scheme_optional),  # Use the optional scheme
    db: Session = Depends(get_db),
) -> Optional[User]:
    if not token:
        return None  # No token provided

    try:
        payload = decode_token(token)
        if payload is None:
            return None  # Invalid token structure

        # Validate that this is an access token
        if payload.get("type") != "access":
            return None  # Not an access token

        user_id_str: Optional[str] = payload.get("sub")
        if user_id_str is None:
            return None  # No user ID in token

        # Validate token hasn't expired
        token_exp: Optional[int] = payload.get("exp")
        if token_exp is None or datetime.fromtimestamp(
            token_exp, tz=timezone.utc
        ) < datetime.now(timezone.utc):
            return None  # Token expired

        user_id = int(user_id_str)
    except (JWTError, ValueError):
        return None  # Token decoding or parsing error

    user = auth_service.get_user_by_id(db=db, user_id=user_id)
    if user is None:
        return None

    # Optional: Check if user is active, similar to get_current_active_user
    if not user.is_active:
        return None

    return user


async def get_current_active_user(
    current_user=Depends(get_current_user),
):
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user


async def get_current_admin_user(
    current_user: User = Depends(get_current_active_user),
) -> User:
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user doesn't have enough privileges",
        )
    return current_user
