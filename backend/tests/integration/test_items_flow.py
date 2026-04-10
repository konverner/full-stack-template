from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.config import settings
from app.items.schemas import ItemCreate
from app.items.service import item_service
from app.users.models import User


def test_create_item(client: TestClient, user_token_headers: dict):
    """Test creating an item."""
    item_data = {"name": "Test Item", "description": "A test item description"}
    response = client.post(
        f"{settings.API_V1_STR}/items/", headers=user_token_headers, json=item_data
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == item_data["name"]
    assert data["description"] == item_data["description"]
    assert "id" in data
    assert "owner" in data


def test_list_items(client: TestClient, db_session: Session, test_user: User):
    """Test listing items."""
    # Create an item
    item_service.create_item(
        db_session, ItemCreate(name="List Item 1"), owner_id=test_user.id
    )
    item_service.create_item(
        db_session, ItemCreate(name="List Item 2"), owner_id=test_user.id
    )

    response = client.get(f"{settings.API_V1_STR}/items/")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 2
    assert len(data["items"]) >= 2


def test_get_item_by_id(
    client: TestClient, db_session: Session, test_user: User, user_token_headers: dict
):
    """Test getting an item by ID."""
    item = item_service.create_item(
        db_session, ItemCreate(name="Get Item"), owner_id=test_user.id
    )

    response = client.get(f"{settings.API_V1_STR}/items/{item.id}")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Get Item"
    assert data["id"] == item.id


def test_update_item(
    client: TestClient, db_session: Session, test_user: User, user_token_headers: dict
):
    """Test updating an item."""
    item = item_service.create_item(
        db_session, ItemCreate(name="Update Item"), owner_id=test_user.id
    )

    update_data = {"name": "Updated Item Name"}
    response = client.put(
        f"{settings.API_V1_STR}/items/{item.id}",
        headers=user_token_headers,
        json=update_data,
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Updated Item Name"


def test_delete_item(
    client: TestClient, db_session: Session, test_user: User, user_token_headers: dict
):
    """Test deleting an item."""
    item = item_service.create_item(
        db_session, ItemCreate(name="Delete Item"), owner_id=test_user.id
    )

    response = client.delete(
        f"{settings.API_V1_STR}/items/{item.id}", headers=user_token_headers
    )
    assert response.status_code == 204

    # Verify item is gone
    response = client.get(f"{settings.API_V1_STR}/items/{item.id}")
    assert response.status_code == 404


def test_update_item_not_owner(
    client: TestClient, db_session: Session, superuser: User, user_token_headers: dict
):
    """Test updating an item owned by someone else (should fail for regular user)."""
    # Item owned by superuser
    item = item_service.create_item(
        db_session, ItemCreate(name="Superuser Item"), owner_id=superuser.id
    )

    update_data = {"name": "Hacked Item Name"}
    response = client.put(
        f"{settings.API_V1_STR}/items/{item.id}",
        headers=user_token_headers,
        json=update_data,
    )
    assert response.status_code == 403
