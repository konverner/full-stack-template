import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

from app.config import settings
from app.database.core import get_db
from app.main import app
from app.models import Base
from app.users.models import User
from app.users.schemas import UserCreate
from app.users.service import user_service

# Use the database URI from settings
# For integration tests, we assume the DB is already up (e.g., via docker-compose)
DATABASE_URL = str(settings.SQLALCHEMY_DATABASE_URI)

engine = create_engine(
    DATABASE_URL,
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    # Ensure a clean state by dropping everything first
    Base.metadata.drop_all(bind=engine)
    # Create tables
    Base.metadata.create_all(bind=engine)
    yield
    # Drop tables after all tests
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def db_session():
    """Provides a transactional database session for a test."""
    connection = engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)

    # Override the get_db dependency to use this session
    def override_get_db():
        try:
            yield session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db

    yield session

    session.close()
    transaction.rollback()
    connection.close()
    app.dependency_overrides.clear()


@pytest.fixture
def client(db_session: Session):
    """Provides a TestClient for the FastAPI app."""
    return TestClient(app)


@pytest.fixture
def test_user(db_session: Session) -> User:
    """Creates a regular test user."""
    user_in = UserCreate(
        username="testuser",
        email="testuser@example.com",
        password="testpassword123",
    )
    return user_service.create_user(db_session, user_in=user_in)


@pytest.fixture
def superuser(db_session: Session) -> User:
    """Creates a superuser for testing."""
    user_in = UserCreate(
        username="testadmin",
        email="admin@example.com",
        password="adminpassword123",
        is_superuser=True,
    )
    return user_service.create_user(db_session, user_in=user_in)


@pytest.fixture
def user_token_headers(client: TestClient, test_user: User):
    """Provides authentication headers for a regular user."""
    login_data = {
        "username": test_user.username,
        "password": "testpassword123",
    }
    r = client.post(f"{settings.AUTH_STR}/token", data=login_data)
    tokens = r.json()
    a_token = tokens["access_token"]
    headers = {"Authorization": f"Bearer {a_token}"}
    return headers


@pytest.fixture
def superuser_token_headers(client: TestClient, superuser: User):
    """Provides authentication headers for a superuser."""
    login_data = {
        "username": superuser.username,
        "password": "adminpassword123",
    }
    r = client.post(f"{settings.AUTH_STR}/token", data=login_data)
    tokens = r.json()
    a_token = tokens["access_token"]
    headers = {"Authorization": f"Bearer {a_token}"}
    return headers
