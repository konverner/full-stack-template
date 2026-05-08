from datetime import datetime, timezone
from typing import Annotated, Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from pydantic import BaseModel
from sqlalchemy.orm import Session

from .auth.security import decode_token
from .auth.service import auth_service
from .config import settings
from .database.core import get_db
from .users.models import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.AUTH_STR}/token")
oauth2_scheme_optional = OAuth2PasswordBearer(
    tokenUrl=f"{settings.AUTH_STR}/token", auto_error=False
)

DbSession = Annotated[Session, Depends(get_db)]
TokenDep = Annotated[str, Depends(oauth2_scheme)]


class TokenPayload(BaseModel):
    sub: str
    exp: datetime
    type: str


def get_current_user(token: TokenDep, db: DbSession) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = decode_token(token)
        if payload is None:
            raise credentials_exception

        if payload.get("type") != "access":
            raise credentials_exception

        user_id_str: str = payload.get("sub")
        if user_id_str is None:
            raise credentials_exception

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


def get_current_active_user(
    current_user: Annotated[User, Depends(get_current_user)],
) -> User:
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user",
        )
    return current_user


def get_optional_current_user(
    token: Annotated[Optional[str], Depends(oauth2_scheme_optional)],
    db: DbSession,
) -> Optional[User]:
    if not token:
        return None

    try:
        payload = decode_token(token)
        if payload is None:
            return None

        if payload.get("type") != "access":
            return None

        user_id_str: Optional[str] = payload.get("sub")
        if user_id_str is None:
            return None

        token_exp: Optional[int] = payload.get("exp")
        if token_exp is None or datetime.fromtimestamp(
            token_exp, tz=timezone.utc
        ) < datetime.now(timezone.utc):
            return None

        user_id = int(user_id_str)
    except (JWTError, ValueError):
        return None

    user = auth_service.get_user_by_id(db=db, user_id=user_id)
    if user is None or not user.is_active:
        return None

    return user


CurrentUser = Annotated[User, Depends(get_current_active_user)]
OptionalUser = Annotated[Optional[User], Depends(get_optional_current_user)]


def get_current_admin_user(current_user: CurrentUser) -> User:
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user doesn't have enough privileges",
        )
    return current_user


AdminUser = Annotated[User, Depends(get_current_admin_user)]

