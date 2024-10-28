from datetime import datetime

from sqlmodel import Field, Relationship, SQLModel

class TransactionBase(SQLModel):
    pass

class Transaction(TransactionBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    description: str
    date: datetime
    value: int
    category_id: int
    is_notified: bool
    user_id: int
    wallet_id: int
    name: str
    image: str

    class Config:
        from_attributes = True
