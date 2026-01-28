from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.items.service import item_service
from app.items.schemas import ItemCreate, ItemUpdate, ItemFilter
from app.users.models import User
from app.items.models import Item


def test_create_item(db_session: Session, test_user: User):
    item_in = ItemCreate(name="Test Item", description="A test item")
    item = item_service.create_item(db_session, item_in=item_in, owner_id=test_user.id)
    assert item.name == "Test Item"
    assert item.slug == "test-item"
    assert item.owner_id == test_user.id


def test_get_item(db_session: Session, test_user: User):
    item_in = ItemCreate(name="Another Item")
    item = item_service.create_item(db_session, item_in=item_in, owner_id=test_user.id)

    got_item_by_id = item_service.get_item_by_id(db_session, item.id)
    assert got_item_by_id
    assert got_item_by_id.id == item.id

    got_item_by_slug = item_service.get_item_by_slug(db_session, item.slug)
    assert got_item_by_slug
    assert got_item_by_slug.slug == item.slug


def test_list_items(db_session: Session, test_user: User):
    item_service.create_item(
        db_session, item_in=ItemCreate(name="Item 1"), owner_id=test_user.id
    )
    item_service.create_item(
        db_session, item_in=ItemCreate(name="Item 2"), owner_id=test_user.id
    )

    response = item_service.list_items(db_session)
    assert response.total >= 2

    item_filter = ItemFilter(name="Item 1")
    response = item_service.list_items(db_session, filters=item_filter)
    assert response.total >= 1
    assert response.items[0].name == "Item 1"


def test_update_item(db_session: Session, test_user: User):
    item = item_service.create_item(
        db_session, item_in=ItemCreate(name="Original Name"), owner_id=test_user.id
    )
    item_in = ItemUpdate(name="Updated Name")
    updated_item = item_service.update_item(db_session, item=item, item_in=item_in)
    assert updated_item.name == "Updated Name"
    assert updated_item.slug == "updated-name"


def test_delete_item(db_session: Session, test_user: User):
    item = item_service.create_item(
        db_session, item_in=ItemCreate(name="To Be Deleted"), owner_id=test_user.id
    )
    item_id = item.id
    item_service.delete_item(db_session, item=item)
    deleted_item = item_service.get_item_by_id(db_session, item_id)
    assert deleted_item is None


def test_slug_uniqueness(db_session: Session, test_user: User):
    item1 = item_service.create_item(
        db_session, item_in=ItemCreate(name="Same Name"), owner_id=test_user.id
    )
    item2 = item_service.create_item(
        db_session, item_in=ItemCreate(name="Same Name"), owner_id=test_user.id
    )
    assert item1.slug == "same-name"
    assert item2.slug == "same-name-1"


# --- Router Tests ---


def test_create_item_api(client_auth):
    client, _ = client_auth
    response = client.post("/api/v1/items/", json={"name": "My API Item"})
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "My API Item"
    assert "owner" in data


def test_list_items_api(client: TestClient, test_item: Item):
    response = client.get("/api/v1/items/")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 1


def test_get_item_by_slug_api(client: TestClient, test_item: Item):
    response = client.get(f"/api/v1/items/{test_item.slug}")
    assert response.status_code == 200
    data = response.json()
    assert data["slug"] == test_item.slug


def test_update_item_api(client_auth, db_session: Session, test_item: Item):
    client, user = client_auth
    # Ensure the user from client_auth is the owner of the item
    # If not, create a new item owned by this user for the test
    if test_item.owner_id != user.id:
        test_item = item_service.create_item(
            db_session, ItemCreate(name="Updated Item by Auth User"), owner_id=user.id
        )

    response = client.put(
        f"/api/v1/items/{test_item.slug}", json={"name": "Updated via API"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Updated via API"


def test_delete_item_api(client_auth, db_session: Session, test_item: Item):
    client, user = client_auth
    # Ensure the user from client_auth is the owner of the item
    # If not, create a new item owned by this user for the test
    if test_item.owner_id != user.id:
        test_item = item_service.create_item(
            db_session, ItemCreate(name="Deleted Item by Auth User"), owner_id=user.id
        )

    response = client.delete(f"/api/v1/items/{test_item.id}")
    assert response.status_code == 204
