import base64
from fastapi import File, HTTPException, UploadFile
from models.budgets import Budget
from sqlmodel import Session, select
from core.config import settings

def read_budget(session: Session, budget_id: int) -> Budget:
  db_budget = session.get(Budget, budget_id)
  if not db_budget:
    raise HTTPException(status_code=404, detail="budget not found")
  return db_budget

def delete_budget(session: Session, budget_id: int):
  db_budget = session.delete(Budget, budget_id)
  if not db_budget:
    raise HTTPException(status_code=404, detail="budget not found")
  return db_budget

def update_budget(session: Session, budget_id: int, data: Budget) -> Budget:
  db_budget = session.get(Budget, budget_id)
  if not db_budget:
    raise HTTPException(status_code=404, detail="budget not found") 
  db_budget.sqlmodel_update(data.model_dump(exclude_unset=True))

  session.commit()
  session.refresh(db_budget)

  return db_budget

def create_budget(session: Session, data: Budget) -> Budget: 
  budget = session.exec(select(Budget).where(Budget.name == data.name)).first()
  budget = Budget(
    icon=data.icon, 
    name=data.name, 
    amount=data.amount,
  )
  session.add(budget)
  session.commit()
  session.refresh(budget)

  return budget