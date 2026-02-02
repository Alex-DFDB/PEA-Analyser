"""
Database connection and initialization.
"""
from peewee import PostgresqlDatabase
from playhouse.db_url import connect
from config import settings


# Create database connection from URL
db = connect(settings.DATABASE_URL)


def init_database():
    """Initialize database connection and create tables."""
    from auth.models import User
    from portfolio.models import Position

    db.connect(reuse_if_open=True)
    db.create_tables([User, Position], safe=True)
    print("✓ Database tables created successfully")


def close_database():
    """Close database connection."""
    if not db.is_closed():
        db.close()
        print("✓ Database connection closed")
