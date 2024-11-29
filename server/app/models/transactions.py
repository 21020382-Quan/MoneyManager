from datetime import datetime

from sqlmodel import Field, Relationship, SQLModel

from app.models.budgets import BudgetOut

class TransactionBase(SQLModel):
    pass

class Transaction(TransactionBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    description: str 
    date: datetime = Field(default=datetime.now())
    amount: int | None 
    userId: int | None
    budgetId: int = Field(default=None, foreign_key="budget.id")
    budget: "Budget" = Relationship(back_populates="transactions")

    class Config:
        from_attributes = True

class TransactionOut(TransactionBase): 
    id: int 
    description: str
    amount: int 
    budgetName: str
    date: datetime

class TransactionIn(TransactionBase): 
    budget: str
    description: str
    amount: int

class TransactionListOut(SQLModel): 
    data: list[TransactionOut]
    count: int

