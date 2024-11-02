from datetime import datetime

from sqlmodel import Field, Relationship, SQLModel

class TransactionBase(SQLModel):
    pass

class Transaction(TransactionBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: int = Field(default=None, foreign_key="user.id")
    description: str 
    amount: int | None 
    date: datetime = Field(default=datetime.now())
    budget_id: int = Field(default=None, foreign_key="budget.id")
    user: "User" = Relationship(back_populates="transactions")
    budget: "Budget" = Relationship(back_populates="transaction")

    class Config:
        from_attributes = True
