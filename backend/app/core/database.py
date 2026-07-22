import logging

from sqlalchemy import create_engine, text
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from app.core.config import get_database_settings

logger = logging.getLogger(__name__)
settings = get_database_settings()

engine = create_engine(settings.database_url, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
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
    except Exception:
        logger.exception('Database connection test failed.')
        return False
