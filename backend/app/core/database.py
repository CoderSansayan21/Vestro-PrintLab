import logging
from collections.abc import Generator

from sqlalchemy import Engine, create_engine, text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.core.config import get_database_settings

logger = logging.getLogger(__name__)
settings = get_database_settings()

engine: Engine = create_engine(
    settings.database_url,
    pool_pre_ping=True,
)
SessionLocal = sessionmaker(
    bind=engine,
    class_=Session,
    autoflush=False,
    expire_on_commit=False,
)


class Base(DeclarativeBase):
    pass


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def test_database_connection() -> bool:
    try:
        with engine.connect() as connection:
            connection.execute(text('SELECT 1'))

        logger.info('Database connection test succeeded.')
        return True
    except SQLAlchemyError as exc:
        logger.error('Database connection test failed: %s', exc)
        return False
    except Exception as exc:
        logger.error('Unexpected database connection test error: %s', exc)
        return False
