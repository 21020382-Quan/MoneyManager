from fastapi import APIRouter
from api.deps import SessionDep
import api.applications.budget.budget_controller as budgetController
from app.models.budgets import Budget
from app.models.budgets import BudgetIn

router = APIRouter()

@router.get('/{budget_id}')
def get_budget(session: SessionDep, budget_id: int):
  return budgetController.read_budget(session, budget_id)

@router.post('/')
def create_budget(session: SessionDep, budget: BudgetIn):
  return budgetController.create_budget(session, budget)

@router.delete('/{budget_id}')
def delete_budget(session: SessionDep, budget_id: int):
  return budgetController.delete_budget(session, budget_id)

@router.put('/{budget_id}')
def update_budget(session: SessionDep, budget_id: int, budget: BudgetIn):
  return budgetController.update_budget(session, budget_id, budget)