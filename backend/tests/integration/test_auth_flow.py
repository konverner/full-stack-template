from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.config import settings


def test_register_user(client: TestClient):
    """Test user registration."""
    user_data = {
        "username": "newuser",
        "email": "newuser@example.com",
        "password": "newpassword123",
    }
    response = client.post(f"{settings.AUTH_STR}/register", json=user_data)
    assert response.status_code == 201
    data = response.json()
    assert data["username"] == user_data["username"]
    assert data["email"] == user_data["email"]
    assert "id" in data


def test_login_for_access_token(client: TestClient, db_session: Session):
    """Test login and token generation."""
    # First, register a user
    user_data = {
        "username": "logintest",
        "email": "logintest@example.com",
        "password": "loginpassword123",
    }
    client.post(f"{settings.AUTH_STR}/register", json=user_data)

    # Then, login
    login_data = {
        "username": user_data["username"],
        "password": user_data["password"],
    }
    response = client.post(f"{settings.AUTH_STR}/token", data=login_data)
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["token_type"] == "bearer"


def test_refresh_token(client: TestClient, db_session: Session):
    """Test refreshing the access token."""
    # First, register and login
    user_data = {
        "username": "refreshtest",
        "email": "refreshtest@example.com",
        "password": "refreshpassword123",
    }
    client.post(f"{settings.AUTH_STR}/register", json=user_data)

    login_data = {
        "username": user_data["username"],
        "password": user_data["password"],
    }
    login_response = client.post(f"{settings.AUTH_STR}/token", data=login_data)
    refresh_token = login_response.json()["refresh_token"]

    # Now, refresh the token
    refresh_data = {"refresh_token": refresh_token}
    response = client.post(f"{settings.AUTH_STR}/refresh", json=refresh_data)
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data


def test_read_users_me(client: TestClient, user_token_headers: dict):
    """Test getting the current user's profile."""
    response = client.get(f"{settings.AUTH_STR}/me", headers=user_token_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "testuser"
    assert data["email"] == "testuser@example.com"


def test_update_users_me(client: TestClient, user_token_headers: dict):
    """Test updating the current user's profile."""
    update_data = {"email": "newemail@example.com"}
    response = client.patch(
        f"{settings.AUTH_STR}/me", headers=user_token_headers, json=update_data
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == update_data["email"]


def test_update_users_password(client: TestClient, user_token_headers: dict):
    """Test updating the current user's password."""
    password_data = {
        "current_password": "testpassword123",
        "new_password": "newpassword456",
    }
    response = client.put(
        f"{settings.AUTH_STR}/password", headers=user_token_headers, json=password_data
    )
    assert response.status_code == 200
    assert response.json()["message"] == "Password updated successfully"

    # Verify we can login with the new password
    login_data = {
        "username": "testuser",
        "password": "newpassword456",
    }
    login_response = client.post(f"{settings.AUTH_STR}/token", data=login_data)
    assert login_response.status_code == 200
