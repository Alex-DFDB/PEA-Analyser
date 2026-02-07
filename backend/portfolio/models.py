"""
Portfolio position models.
"""
from datetime import datetime
from decimal import Decimal
from peewee import (
    Model,
    AutoField,
    ForeignKeyField,
    CharField,
    DecimalField,
    DateTimeField,
)
from database import db
from auth.models import User


class Position(Model):
    """Portfolio position model."""

    id = AutoField(primary_key=True)
    user = ForeignKeyField(User, column_name='id_user', backref='positions', on_delete='CASCADE')
    ticker = CharField(max_length=20, index=True)
    name = CharField(max_length=255)
    quantity = DecimalField(max_digits=10, decimal_places=4)
    buy_price = DecimalField(max_digits=10, decimal_places=4)
    color = CharField(max_length=7, null=True)  # Hex color code
    created_at = DateTimeField(default=datetime.now)
    updated_at = DateTimeField(default=datetime.now)

    class Meta:
        database = db
        table_name = 'positions'
        indexes = (
            (('user', 'ticker'), True),  # Unique constraint: one position per ticker per user
        )

    def __repr__(self):
        return f"<Position {self.ticker} - {self.quantity} shares @ {self.buy_price}>"
