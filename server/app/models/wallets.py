from datetime import datetime

from sqlmodel import Field, Relationship, SQLModel

class WalletBase(SQLModel):
    pass

# Database model, database table inferred from class name
class Wallet(WalletBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str 
    value: int 
    created_at: datetime

    class Config:
        from_attributes = True
