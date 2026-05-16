"""Culinary Compass — Database Setup"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from app.config import settings


# Determine if SQLite or MySQL
is_sqlite = settings.DATABASE_URL.startswith("sqlite")

if is_sqlite:
    engine = create_engine(
        settings.DATABASE_URL,
        connect_args={"check_same_thread": False},
        echo=False,
    )
else:
    engine = create_engine(
        settings.DATABASE_URL,
        pool_pre_ping=True,
        pool_recycle=300,
        echo=False,
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    """Dependency that provides a database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Create all tables."""
    from app.models import user, profile, food, restaurant, hotel, tourist_place  # noqa
    from app.models import review, itinerary, favorite, hidden_gem  # noqa
    from app.models import notification, report, admin_log, category, region  # noqa
    from app.models import uploaded_image  # noqa
    Base.metadata.create_all(bind=engine)
