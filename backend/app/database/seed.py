import logging
from app.database.core import get_db
from app.config import settings
from app.auth.service import AuthService
from app.users import schemas as users_schemas
from .core import init_db

# Import all models to ensure they are registered with Base.metadata
# and to avoid sqlalchemy.exc.InvalidRequestError when initializing mappers
from app.users.models import User
from app.items.models import Item

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def seed_db() -> None:
    logger.info("Initializing database...")
    init_db()
    
    logger.info("Seeding database...")
    db_gen = get_db()
    db = next(db_gen)
    try:
        auth_service = AuthService()
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
            logger.info(f"First superuser created: {settings.FIRST_SUPERUSER_USERNAME}")
        else:
            logger.info(f"Superuser {settings.FIRST_SUPERUSER_USERNAME} already exists.")
        
        # Seed Mock Data if enabled
        if settings.SEED_MOCK_DATA:
            logger.info("Seeding mock data...")
            # Add your mock data seeding logic here
            # Example:
            # if not db.execute(select(Item).filter(Item.name == "Mock Item")).first():
            #     db.add(Item(name="Mock Item", ...))
            #     db.commit()
            pass
        
    except Exception as e:
        logger.error(f"Error seeding database: {e}")
        raise
    finally:
        db_gen.close()

if __name__ == "__main__":
    seed_db()
