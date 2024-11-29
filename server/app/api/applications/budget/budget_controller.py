import base64
from fastapi import File, HTTPException, UploadFile
from app.models.transactions import Transaction
from app.models.budgets import Budget, BudgetIn, BudgetListOut, BudgetOut
from sqlmodel import Session, select, func
from core.config import settings
from app.models.users import User

def readBudget(session: Session, budgetId: int, clerkId: str) -> Budget:
    user = session.exec(select(User).where(User.clerkUserId == clerkId)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    dbBudget = session.exec(select(Budget).where((Budget.userId == user.id) & (Budget.id == budgetId))).first()
    if not dbBudget:
        raise HTTPException(status_code=404, detail="Budget not found")

    response_data = {**dbBudget.model_dump()}

    transactions = session.exec(select(Transaction).where(Transaction.budgetId == dbBudget.id)).all()
    response_data["transactions"] = [transaction.model_dump() for transaction in transactions]
     
    return response_data

def readAllBudgets(session: Session, clerkId: str) -> BudgetListOut:
    count_statement = select(func.count(Budget.id)).select_from(Budget)
    count = session.exec(count_statement).one()

    user = session.exec(select(User).where(User.clerkUserId == clerkId)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    dbBudgets = session.exec(select(Budget).where(Budget.userId == user.id)).all()

    response_data = []
    for budget in dbBudgets:
        budget_data = readBudget(session, budget.id, clerkId)
        response_data.append(budget_data)

    print(response_data)

    return BudgetListOut(data=response_data, count=count)



def deleteBudget(session: Session, budgetId: int, clerkId: str) -> str:
    user = session.exec(select(User).where(User.clerkUserId == clerkId)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    dbBudget = session.exec(
        select(Budget).where((Budget.id == budgetId) & (Budget.userId == user.id))
    ).first()
    if not dbBudget:
        raise HTTPException(status_code=404, detail="Budget not found")

    session.delete(dbBudget)
    session.commit()

    return f"Budget with ID {budgetId} was successfully deleted"

def updateBudget(session: Session, budgetId: int, data: BudgetIn, clerkId: str) -> Budget:
    user = session.exec(select(User).where(User.clerkUserId == clerkId)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    dbBudget = session.exec(
        select(Budget).where((Budget.id == budgetId) & (Budget.userId == user.id))
    ).first()
    if not dbBudget:
        raise HTTPException(status_code=404, detail="Budget not found")

    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(dbBudget, key, value)

    session.add(dbBudget)
    session.commit()
    session.refresh(dbBudget)

    return dbBudget


def createBudget(session: Session, data: BudgetIn, clerkId: str) -> Budget: 
  userId = session.exec(select(User.id).where(User.clerkUserId == clerkId)).first()
  existing_budget = session.exec(select(Budget).where(Budget.name == data.name)).first()
  if existing_budget:
    raise HTTPException(status_code=400, detail="Budget with this name already exists")

  budget = Budget(
    icon=data.icon, 
    name=data.name, 
    amount=data.amount,
    userId=userId,
  )
  session.add(budget)
  session.commit()
  session.refresh(budget)

  return budget