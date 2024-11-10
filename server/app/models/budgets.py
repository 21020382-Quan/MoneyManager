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
    total_spent: int
    transactions: list["Transaction"] = Relationship(
        back_populates="budget", sa_relationship_kwargs={"cascade": "all, delete"}
    )
    transaction: int = Field(default=0)

    def update_transaction_count(self):
        self.transaction = len(self.transactions)

    class Config:
        from_attributes = True

class BudgetOut(BudgetBase):
    id: int
    icon: str
    name: str
    amount: int
    total_spent: int

class BudgetIn(BudgetBase):
    icon: str
    name: str
    amount: int
    total_spent: int

class BudgetListOut(SQLModel): 
    data: list[Budget]
    count: int