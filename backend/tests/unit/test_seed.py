from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.auth.service import AuthService
from app.database.seed import (
    MOCK_ITEM_COUNT,
    MOCK_USER_COUNT,
    seed_mock_data,
)
from app.items.models import Item
from app.users.models import User


def test_seed_mock_data_creates_expected_counts(db_session: Session):
    created_users, created_items = seed_mock_data(db_session, AuthService())

    user_count = db_session.execute(
        select(func.count()).select_from(User).where(User.is_superuser.is_(False))
    ).scalar_one()
    item_count = db_session.execute(select(func.count()).select_from(Item)).scalar_one()

    assert created_users == MOCK_USER_COUNT
    assert created_items == MOCK_ITEM_COUNT
    assert user_count == MOCK_USER_COUNT
    assert item_count == MOCK_ITEM_COUNT


def test_seed_mock_data_is_idempotent(db_session: Session):
    seed_mock_data(db_session, AuthService())
    created_users, created_items = seed_mock_data(db_session, AuthService())

    user_count = db_session.execute(
        select(func.count()).select_from(User).where(User.is_superuser.is_(False))
    ).scalar_one()
    item_count = db_session.execute(select(func.count()).select_from(Item)).scalar_one()

    assert created_users == 0
    assert created_items == 0
    assert user_count == MOCK_USER_COUNT
    assert item_count == MOCK_ITEM_COUNT
