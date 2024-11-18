from datetime import datetime

from sqlmodel import Field, Relationship, SQLModel

from app.models.users import User, UserOut
from app.models.budgets import Budget, BudgetOut

class TransactionBase(SQLModel):
    pass

class Transaction(TransactionBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    # user_id: int = Field(default=None, foreign_key="user.id")
    description: str 
    amount: int | None 
    date: datetime = Field(default=datetime.now())
    budget_id: int = Field(default=None, foreign_key="budget.id")
    # user: "User" = Relationship(back_populates="transactions")
    budget: "Budget" = Relationship(back_populates="transactions")

    class Config:
        from_attributes = True

class TransactionOut(TransactionBase): 
    id: int 
    description: str
    amount: int 
    budget: BudgetOut
    # user: UserOut

class TransactionIn(TransactionBase): 
    # user_id: int
    budget: str
    description: str
    amount: int

class TransactionListOut(SQLModel): 
    data: list[Transaction]
    count: int

