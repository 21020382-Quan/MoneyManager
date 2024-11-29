from datetime import datetime

from sqlmodel import Field, Relationship, SQLModel


class BudgetBase(SQLModel):
    pass

class Budget(BudgetBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    icon: str
    name: str
    amount: int
    totalSpent: int = Field(default=0, nullable=True)
    transactions: list["Transaction"] = Relationship(
        back_populates="budget", sa_relationship_kwargs={"cascade": "all, delete"}
    )
    userId: int = Field(default=None, foreign_key="user.id")
    user: "User" = Relationship(back_populates="budgets")

    class Config:
        from_attributes = True

class BudgetOut(BudgetBase):
    id: int
    icon: str
    name: str
    amount: int
    totalSpent: int

class BudgetIn(BudgetBase):
    icon: str
    name: str
    amount: int

class BudgetListOut(SQLModel): 
    data: list[Budget]
    count: int