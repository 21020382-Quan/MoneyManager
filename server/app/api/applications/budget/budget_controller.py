import base64
from fastapi import File, HTTPException, UploadFile
from app.models.budgets import Budget, BudgetIn, BudgetListOut
from sqlmodel import Session, select, func
from core.config import settings
from app.models.users import User

def read_budget(session: Session, budget_id: int, user_id: int) -> Budget:
  db_budget = session.exec(select(Budget).where((Budget.userId == user_id) & (Budget.id == budget_id))).first()
  if not db_budget:
    raise HTTPException(status_code=404, detail="budget not found")
  return db_budget

def read_all_budgets(session: Session, user_id: int) -> BudgetListOut:
  count_statement = select(func.count(Budget.id)).select_from(Budget)
  count = session.exec(count_statement).one()

  db_budgets = session.exec(select(Budget).where(Budget.userId == user_id)).all()
  response_data = []
  bg_list_id = [factor.id for factor in db_budgets if factor.id]
  db_list_budgets = session.exec(
      select(Budget).where(Budget.id.in_(bg_list_id))
  ).all()

  list_budgets_map = {
      budget.id: budget for budget in db_list_budgets
  }

  for budget in db_budgets:
      if budget.id:
          response_data.append(
              {
                  **budget.model_dump(),
                  "budget": list_budgets_map[budget.id].model_dump(),
              }
          )
          print(response_data)
      else:
          response_data.append(budget.model_dump())
  print(response_data)
  return BudgetListOut(data=response_data, count=count)

def delete_budget(session: Session, budget_id: int):
  db_budget = session.get(Budget, budget_id)
  if not db_budget:
    raise HTTPException(status_code=404, detail="budget not found")
  session.delete(db_budget)
  session.commit()
  return f"Budget was deleted"

def update_budget(session: Session, budget_id: int, data: BudgetIn) -> Budget:
  db_budget = session.get(Budget, budget_id)
  if not db_budget:
    raise HTTPException(status_code=404, detail="budget not found") 
  db_budget.sqlmodel_update(data.model_dump(exclude_unset=True))

  session.commit()
  session.refresh(db_budget)

  return db_budget

def create_budget(session: Session, data: BudgetIn) -> Budget: 
  existing_budget = session.exec(select(Budget).where(Budget.name == data.name)).first()
  if existing_budget:
    raise HTTPException(status_code=400, detail="Budget with this name already exists")

  budget = Budget(
    icon=data.icon, 
    name=data.name, 
    amount=data.amount,
    userId= data.userId
  )
  session.add(budget)
  session.commit()
  session.refresh(budget)

  return budget