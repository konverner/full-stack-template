import logging
import random

from faker import Faker
from slugify import slugify
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.auth.service import AuthService
from app.config import settings
from app.database.core import get_db
from app.items import schemas as item_schemas

# Import all models to ensure they are registered with Base.metadata
# and to avoid sqlalchemy.exc.InvalidRequestError when initializing mappers
from app.items.models import Item
from app.items.service import item_service
from app.users import schemas as users_schemas
from app.users.models import User

logger = logging.getLogger(__name__)

MOCK_USER_COUNT = 10
MOCK_ITEM_COUNT = 100
MOCK_PASSWORD = "mock-data-password"
MOCK_DATA_SEED = 42

ITEM_NAME_SUFFIXES = [
    "Platform",
    "Suite",
    "Hub",
    "Studio",
    "Cloud",
    "Works",
    "Labs",
    "Flow",
    "Sync",
    "Pulse",
]


def _build_faker(seed: int) -> Faker:
    fake = Faker()
    fake.seed_instance(seed)
    return fake


def _build_mock_users(count: int) -> list[users_schemas.UserCreate]:
    fake = _build_faker(MOCK_DATA_SEED)

    users: list[users_schemas.UserCreate] = []
    for _ in range(count):
        first = fake.unique.first_name()
        last = fake.unique.last_name()
        username = f"{first}.{last}".lower()
        users.append(
            users_schemas.UserCreate(
                username=username,
                email=f"{username}@example.com",
                password=MOCK_PASSWORD,
                avatar_url=f"https://api.dicebear.com/9.x/initials/svg?seed={username}",
            )
        )
    return users


def _build_mock_items(
    count: int, owners: list[User]
) -> list[tuple[item_schemas.ItemCreate, int | None]]:
    fake = _build_faker(MOCK_DATA_SEED + 1)
    rng = random.Random(MOCK_DATA_SEED + 1)

    items: list[tuple[item_schemas.ItemCreate, int | None]] = []
    for index in range(count):
        company = fake.unique.company()
        suffix = ITEM_NAME_SUFFIXES[index % len(ITEM_NAME_SUFFIXES)]
        name = f"{company} {suffix}"
        slug = slugify(name)
        category = fake.bs().split()[0].capitalize()
        item_in = item_schemas.ItemCreate(
            name=name,
            description=(
                f"{name} is a {category.lower()} product for {fake.catch_phrase().lower()} "
                f"{fake.sentence(nb_words=10).rstrip('.').lower()}."
            ),
            rating=round(rng.uniform(3.6, 5.0), 1),
            available=rng.choice([True, True, True, False]),
            image_url=f"https://picsum.photos/seed/{slug}/640/480",
            website_url=f"https://{slug}.example.com",
        )
        owner = rng.choice(owners) if owners else None
        items.append((item_in, owner.id if owner else None))

    return items


def seed_mock_data(
    db: Session,
    auth_service: AuthService,
    user_count: int = MOCK_USER_COUNT,
    item_count: int = MOCK_ITEM_COUNT,
) -> tuple[int, int]:
    created_users = 0
    created_items = 0

    mock_users: list[User] = []
    for user_in in _build_mock_users(user_count):
        existing_user = auth_service.get_user_by_username(db, user_in.username)
        if existing_user:
            mock_users.append(existing_user)
            continue

        mock_users.append(auth_service.create_user(db=db, user_in=user_in))
        created_users += 1

    for item_in, owner_id in _build_mock_items(item_count, mock_users):
        existing_item = db.execute(
            select(Item).where(Item.slug == slugify(item_in.name))
        ).scalar_one_or_none()
        if existing_item:
            continue

        item_service.create_item(db=db, item_in=item_in, owner_id=owner_id)
        created_items += 1
    return created_users, created_items


def seed_db() -> None:
    logger.info("Seeding database...")
    db_gen = get_db()
    db = next(db_gen)
    try:
        auth_service = AuthService()
        superuser_created = 0
        created_users = 0
        created_items = 0

        # Seed First Superuser
        if not auth_service.get_user_by_username(db, settings.FIRST_SUPERUSER_USERNAME):
            auth_service.create_user(
                db=db,
                user_in=users_schemas.UserCreate(
                    username=settings.FIRST_SUPERUSER_USERNAME,
                    password=settings.FIRST_SUPERUSER_PASSWORD,
                    is_superuser=True,
                    avatar_url=None,
                ),
            )
            superuser_created = 1
            logger.info(f"First superuser created: {settings.FIRST_SUPERUSER_USERNAME}")
        else:
            logger.info(
                f"Superuser {settings.FIRST_SUPERUSER_USERNAME} already exists."
            )

        # Seed Mock Data if enabled
        if settings.SEED_MOCK_DATA:
            logger.info("Seeding mock data...")
            created_users, created_items = seed_mock_data(
                db=db,
                auth_service=auth_service,
            )

        logger.info(
            "Seed summary: superusers=%s users=%s items=%s",
            superuser_created,
            created_users,
            created_items,
        )

    except Exception as e:
        logger.error(f"Error seeding database: {e}")
        raise
    finally:
        db_gen.close()


if __name__ == "__main__":
    seed_db()
