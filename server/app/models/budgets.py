from datetime import datetime

from sqlmodel import Field, Relationship, SQLModel

class BudgetBase(SQLModel):
    pass

# Database model, database table inferred from class name
class Budget(BudgetBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    icon: str
    name: str
    amount: int

    class Config:
        from_attributes = True
