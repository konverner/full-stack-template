import logging

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from typing import Generator

from ..models import Base
from ..config import settings

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
