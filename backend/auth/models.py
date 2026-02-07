"""
User authentication models.
"""
from datetime import datetime
from peewee import (
    Model,
    CharField,
    BooleanField,
    DateTimeField,
)
from database import db


class User(Model):
    """User model for authentication."""

    id_user = CharField(primary_key=True, max_length=255)
    email = CharField(unique=True, max_length=255, index=True)
    username = CharField(unique=True, max_length=50, index=True)
    hashed_password = CharField(max_length=255)
    is_active = BooleanField(default=True)
    created_at = DateTimeField(default=datetime.now)
    updated_at = DateTimeField(default=datetime.now)

    class Meta:
        database = db
        table_name = 'users'

    def __repr__(self):
        return f"<User {self.username} ({self.email})>"
