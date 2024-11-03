from datetime import datetime

from sqlmodel import Field, Relationship, SQLModel

class UserBase(SQLModel):
    pass

# Database model, database table inferred from class name
class User(UserBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    clerkUserId: str  
    email: str
    name: str
    imageUrl: str
    createdAt: datetime
    updatedAt: datetime

    transactions: list["Transaction"] = Relationship(
        back_populates="user", sa_relationship_kwargs={"cascade": "all, delete"}
    )

    class Config:
        from_attributes = True
