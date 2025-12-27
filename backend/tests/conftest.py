import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

from app.users.service import user_service
from app.users.schemas import UserCreate, UserUpdate, UserFilter
from app.users.models import User
from app.main import app
from app.database.core import get_db, Base
from app.auth.service import auth_service
from app.items.service import item_service
from app.items.schemas import ItemCreate
from app.items.models import Item


@pytest.fixture(name="db_session")
def db_session_fixture():
    engine = create_engine("sqlite:///./test.db")
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base.metadata.create_all(bind=engine)

    def override_get_db():
        try:
            db = TestingSessionLocal()
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    db = TestingSessionLocal()
    yield db
    Base.metadata.drop_all(bind=engine)
    db.close()


@pytest.fixture(name="client")
def client_fixture(db_session: Session):
    return TestClient(app)


@pytest.fixture(name="test_user")
def test_user_fixture(db_session: Session) -> User:
    user_in = UserCreate(
        username="testuser_items", email="testuser@items.com", password="password"
    )
    return user_service.create_user(db_session, user_in)


@pytest.fixture(name="client_auth")
def client_auth_fixture(client: TestClient, db_session: Session):
    user_in = UserCreate(
        username="testuser_auth", email="testauth@example.com", password="testpassword"
    )
    user = auth_service.create_user(db_session, user_in)

    response = client.post(
        "/auth/token",
        data={"username": user_in.username, "password": user_in.password},
    )
    response.raise_for_status()  # Raise an exception for bad status codes
    token = response.json()["access_token"]
    client.headers["Authorization"] = f"Bearer {token}"
    return client, user


@pytest.fixture(name="superuser_client_auth")
def superuser_client_auth_fixture(client: TestClient, db_session: Session):
    superuser_in = UserCreate(
        username="superuser_auth",
        email="superuser@example.com",
        password="superpassword",
        is_superuser=True,
    )
    superuser = auth_service.create_user(db_session, superuser_in)

    response = client.post(
        "/auth/token",
        data={"username": superuser_in.username, "password": superuser_in.password},
    )
    response.raise_for_status()  # Raise an exception for bad status codes
    token = response.json()["access_token"]
    client.headers["Authorization"] = f"Bearer {token}"
    return client, superuser


@pytest.fixture(name="test_item")
def test_item_fixture(db_session: Session, client_auth) -> Item:
    """Create a test item for router tests."""
    client, user = client_auth
    return item_service.create_item(
        db_session, item_in=ItemCreate(name="API Test Item"), owner_id=user.id
    )


def test_password_hashing():
    password = "testpassword"
    hashed_password = user_service.get_password_hash(password)
    assert hashed_password != password
    assert user_service.verify_password(password, hashed_password)
    assert not user_service.verify_password("wrongpassword", hashed_password)


def test_create_user(db_session: Session):
    user_in = UserCreate(
        username="newuser",
        email="newuser@example.com",
        password="newpassword",
    )
    user = user_service.create_user(db_session, user_in=user_in)
    assert user.username == "newuser"
    assert user.email == "newuser@example.com"
    assert user.id is not None


def test_get_user(db_session: Session):
    user_in = UserCreate(
        username="testgetuser", email="test@get.com", password="password"
    )
    user = user_service.create_user(db_session, user_in)

    get_user = user_service.get_user_by_id(db_session, user.id)
    assert get_user
    assert get_user.id == user.id
    assert get_user.username == user.username

    get_user_by_name = user_service.get_user_by_username(db_session, user.username)
    assert get_user_by_name
    assert get_user_by_name.id == user.id
    assert get_user_by_name.username == user.username


def test_list_users(db_session: Session):
    user_service.create_user(
        db_session,
        UserCreate(username="listuser1", email="list1@user.com", password="password"),
    )
    user_service.create_user(
        db_session,
        UserCreate(username="listuser2", email="list2@user.com", password="password"),
    )

    response = user_service.list_users(db_session)
    assert response.total >= 2

    user_filter = UserFilter(username="listuser1")
    response = user_service.list_users(db_session, filters=user_filter)
    assert response.total >= 1
    assert response.users[0].username == "listuser1"


def test_update_user(db_session: Session):
    user_in = UserCreate(
        username="updateuser", email="update@user.com", password="password"
    )
    user = user_service.create_user(db_session, user_in)
    user_in_update = UserUpdate(email="updated@example.com")
    updated_user = user_service.update_user(
        db_session, user=user, user_in=user_in_update
    )
    assert updated_user.email == "updated@example.com"


def test_delete_user(db_session: Session):
    user_in = UserCreate(
        username="deleteuser", email="delete@user.com", password="password"
    )
    user = user_service.create_user(db_session, user_in)
    user_id = user.id
    user_service.delete_user(db_session, user=user)
    deleted_user = user_service.get_user_by_id(db_session, user_id)
    assert deleted_user is None


# --- Router Tests ---


def test_create_user_api(
    client: TestClient, client_auth, superuser_client_auth, db_session: Session
):
    # Unauthenticated should fail with 401
    response = client.post(
        "/api/v1/users/",
        json={
            "username": "apiuser",
            "email": "api@user.com",
            "password": "longenoughpassword",
        },
    )
    assert response.status_code == 401

    # Non-superuser should fail
    client_auth_client, test_user = client_auth
    response = client_auth_client.post(
        "/api/v1/users/",
        json={
            "username": "apiuser2",
            "email": "api2@user.com",
            "password": "longenoughpassword",
        },
    )
    assert response.status_code == 403

    # Superuser should succeed
    superuser_client, superuser = superuser_client_auth
    response = superuser_client.post(
        "/api/v1/users/",
        json={
            "username": "apiuser3",
            "email": "api3@user.com",
            "password": "longenoughpassword",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["username"] == "apiuser3"


def test_list_users_api(client: TestClient, db_session: Session):
    user_service.create_user(
        db_session,
        UserCreate(
            username="listuser_api", email="list@api.com", password="longenoughpassword"
        ),
    )
    response = client.get("/api/v1/users/")
    assert response.status_code == 200


def test_get_user_by_username_api(client: TestClient, db_session: Session):
    user_in = UserCreate(
        username="getme", email="getme@example.com", password="password"
    )
    user = user_service.create_user(db_session, user_in)
    response = client.get(f"/api/v1/users/{user.username}")
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == user.username


def test_update_user_api(client_auth, superuser_client_auth, db_session: Session):
    client, test_user = client_auth
    # User updates self
    response = client.put(
        f"/api/v1/users/{test_user.username}", json={"email": "selfupdate@example.com"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "selfupdate@example.com"

    # Superuser updates other user
    superuser_client, superuser = superuser_client_auth
    response = superuser_client.put(
        f"/api/v1/users/{test_user.username}",
        json={"email": "superuserupdate@example.com"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "superuserupdate@example.com"


def test_delete_user_api(superuser_client_auth, db_session: Session):
    user_to_delete = user_service.create_user(
        db_session,
        UserCreate(
            username="deleteme_api",
            email="deleteme@api.com",
            password="longenoughpassword",
        ),
    )

    superuser_client, superuser = superuser_client_auth
    response = superuser_client.delete(f"/api/v1/users/{user_to_delete.username}")
    assert response.status_code == 204
