import logging
from typing import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from ..config import settings
from ..models import Base

logger = logging.getLogger(__name__)

# Use settings to build the database URL
DATABASE_URL = str(settings.SQLALCHEMY_DATABASE_URI)

# Create sync engine instance
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=5,
    pool_timeout=15,
    pool_recycle=1800,
    pool_use_lifo=True,
    echo=False,
    connect_args={
        "connect_timeout": 5,
        "options": "-c statement_timeout=30000 -c idle_in_transaction_session_timeout=30000",
    },
)
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


# Drop all tables
def drop_db() -> None:
    try:
        Base.metadata.drop_all(bind=engine)
    except Exception as e:
        logger.info(f"Error dropping database: {e}")
        raise
    finally:
        engine.dispose()
