import logging

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from typing import Generator

from ..models import Base
from ..config import settings
from ..auth.service import AuthService
from ..auth import schemas

logger = logging.getLogger(__name__)

# Use settings to build the database URL
DATABASE_URL = str(settings.SQLALCHEMY_DATABASE_URI)

# Create sync engine instance
engine = create_engine(DATABASE_URL, pool_pre_ping=True, echo=False)

# Create sessionmaker
SessionFactory = sessionmaker(
    bind=engine, autocommit=False, autoflush=False, class_=Session
)


# Dependency to get DB session
def get_db() -> Generator[Session, None, None]:
    session = SessionFactory()
    try:
        yield session
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


# Init database schema via Base.metadata.create_all
def init_db() -> None:
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database initialized successfully.")

        # Create the first superuser if it doesn't exist
        db_gen = get_db()
        db = next(db_gen)
        try:
            auth_service = AuthService()
            if not auth_service.get_user_by_username(
                db, settings.FIRST_SUPERUSER_USERNAME
            ):
                auth_service.create_user(
                    db=db,
                    user_in=schemas.UserCreate(
                        username=settings.FIRST_SUPERUSER_USERNAME,
                        password=settings.FIRST_SUPERUSER_PASSWORD,
                        is_superuser=True,
                        avatar_url=None,
                    ),
                )
                logger.info(
                    f"First superuser created with username: {settings.FIRST_SUPERUSER_USERNAME}"
                )
            else:
                logger.info(
                    f"Superuser with username {settings.FIRST_SUPERUSER_USERNAME} already exists."
                )
        except Exception as user_creation_error:
            logger.error(f"Error creating superuser: {user_creation_error}")
        finally:
            try:
                db_gen.close()
            except Exception as e:
                logger.error(f"Error closing database session: {e}")
    except Exception as e:
        logger.error(f"Error initializing database: {e}")
        raise
    finally:
        engine.dispose()


# Drop all tables
def drop_db() -> None:
    try:
        Base.metadata.drop_all(bind=engine)
    except Exception as e:
        logger.info(f"Error dropping database: {e}")
        raise
    finally:
        engine.dispose()
