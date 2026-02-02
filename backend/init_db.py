"""
Database initialization script.
Run this script to create all database tables.
"""
from database import init_database, close_database


if __name__ == "__main__":
    print("Initializing database...")
    try:
        init_database()
        print("Database initialization complete!")
    except Exception as e:
        print(f"Error initializing database: {e}")
        raise
    finally:
        close_database()
