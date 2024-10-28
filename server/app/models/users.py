from datetime import datetime

from sqlmodel import Field, Relationship, SQLModel

class UserBase(SQLModel):
    pass

# Database model, database table inferred from class name
class User(UserBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    email: str

    class Config:
        from_attributes = True
