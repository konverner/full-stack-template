from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.config import settings
from app.users.models import User
from app.users.schemas import UserCreate
from app.users.service import user_service


def test_list_users(
    client: TestClient, superuser_token_headers: dict, db_session: Session
):
    """Test listing users."""
    # Create some users
    user_service.create_user(
        db_session,
        UserCreate(username="user1", email="user1@example.com", password="password123"),
    )
    user_service.create_user(
        db_session,
        UserCreate(username="user2", email="user2@example.com", password="password123"),
    )

    response = client.get(
        f"{settings.API_V1_STR}/users/", headers=superuser_token_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 3  # superuser + user1 + user2
    assert len(data["users"]) >= 3


def test_create_user_admin(client: TestClient, superuser_token_headers: dict):
    """Test creating a user as admin."""
    user_data = {
        "username": "admincreated",
        "email": "admincreated@example.com",
        "password": "password123",
    }
    response = client.post(
        f"{settings.API_V1_STR}/users/", headers=superuser_token_headers, json=user_data
    )
    assert response.status_code == 201
    data = response.json()
    assert data["username"] == user_data["username"]


def test_create_user_non_admin(client: TestClient, user_token_headers: dict):
    """Test creating a user as non-admin (should fail)."""
    user_data = {
        "username": "failuser",
        "email": "fail@example.com",
        "password": "password123",
    }
    response = client.post(
        f"{settings.API_V1_STR}/users/", headers=user_token_headers, json=user_data
    )
    assert response.status_code == 403


def test_get_user_by_username(client: TestClient, user_token_headers: dict):
    """Test getting a user by username."""
    response = client.get(
        f"{settings.API_V1_STR}/users/testuser", headers=user_token_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "testuser"


def test_update_own_username(client: TestClient, user_token_headers: dict):
    """Test updating own username."""
    update_data = {"username": "newusername"}
    response = client.put(
        f"{settings.API_V1_STR}/users/testuser",
        headers=user_token_headers,
        json=update_data,
    )
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "newusername"

    # Verify old username no longer resolves
    response = client.get(
        f"{settings.API_V1_STR}/users/testuser", headers=user_token_headers
    )
    assert response.status_code == 404

    # Verify new username resolves
    response = client.get(
        f"{settings.API_V1_STR}/users/newusername", headers=user_token_headers
    )
    assert response.status_code == 200
    assert response.json()["username"] == "newusername"


def test_update_username_as_admin(
    client: TestClient, superuser_token_headers: dict, test_user: User
):
    """Test admin updating another user's username."""
    update_data = {"username": "adminrenamed"}
    response = client.put(
        f"{settings.API_V1_STR}/users/{test_user.username}",
        headers=superuser_token_headers,
        json=update_data,
    )
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "adminrenamed"


def test_update_username_duplicate(
    client: TestClient, user_token_headers: dict, superuser: User
):
    """Test updating username to one that already exists (should fail)."""
    update_data = {"username": superuser.username}
    response = client.put(
        f"{settings.API_V1_STR}/users/testuser",
        headers=user_token_headers,
        json=update_data,
    )
    assert response.status_code == 400
    assert "already exists" in response.json()["detail"].lower()


def test_update_username_invalid(client: TestClient, user_token_headers: dict):
    """Test updating username with invalid characters (should fail)."""
    update_data = {"username": "invalid user!"}
    response = client.put(
        f"{settings.API_V1_STR}/users/testuser",
        headers=user_token_headers,
        json=update_data,
    )
    assert response.status_code == 422


def test_update_username_to_same(client: TestClient, user_token_headers: dict):
    """Test updating username to the same value (should succeed)."""
    update_data = {"username": "testuser"}
    response = client.put(
        f"{settings.API_V1_STR}/users/testuser",
        headers=user_token_headers,
        json=update_data,
    )
    assert response.status_code == 200
    assert response.json()["username"] == "testuser"


def test_update_other_user_non_admin(
    client: TestClient, user_token_headers: dict, superuser: User
):
    """Test updating another user as non-admin (should fail)."""
    update_data = {"email": "hacker@example.com"}
    response = client.put(
        f"{settings.API_V1_STR}/users/{superuser.username}",
        headers=user_token_headers,
        json=update_data,
    )
    assert response.status_code == 403


def test_delete_user_admin(
    client: TestClient, superuser_token_headers: dict, test_user: User
):
    """Test deleting a user as admin."""
    response = client.delete(
        f"{settings.API_V1_STR}/users/{test_user.username}",
        headers=superuser_token_headers,
    )
    assert response.status_code == 204

    # Verify user is gone
    response = client.get(
        f"{settings.API_V1_STR}/users/{test_user.username}",
        headers=superuser_token_headers,
    )
    assert response.status_code == 404
