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
    transaction: list["Transaction"] = Relationship(
        back_populates="budget", sa_relationship_kwargs={"cascade": "all, delete"}
    )

    class Config:
        from_attributes = True

class BudgetOut(BudgetBase):
    id: int
    icon: str
    name: str
    amount: int

class BudgetIn(BudgetBase):
    icon: str
    name: str
    amount: int