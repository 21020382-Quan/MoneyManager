from datetime import datetime

from sqlmodel import Field, Relationship, SQLModel

from app.models.users import UserOut

class WalletBase(SQLModel):
    pass

# Database model, database table inferred from class name
class Wallet(WalletBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: int = Field(default=None, foreign_key="user.id")
    name: str 
    value: int 
    created_at: datetime
    user: "User" = Relationship(back_populates="wallet")

    class Config:
        from_attributes = True

class WalletOut(WalletBase): 
    id: int
    name: str 
    value: int 
    created_at: datetime
    user: UserOut