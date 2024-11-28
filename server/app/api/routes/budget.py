from fastapi import APIRouter
from api.deps import SessionDep
import api.applications.budget.budget_controller as budgetController
from app.models.budgets import Budget, BudgetListOut
from app.models.budgets import BudgetIn
from core.config import settings

router = APIRouter()

@router.get('/get/{budget_id}')
def get_budget(session: SessionDep, budget_id: int, clerk_id: str):
  return budgetController.read_budget(session, budget_id, clerk_id)

@router.post('')
def create_budget(session: SessionDep, budget: BudgetIn):
  return budgetController.create_budget(session, budget)

@router.get('/get_all_budgets/{clerk_id}')
def get_all_budgets(session: SessionDep, clerk_id: str) -> BudgetListOut: 
  return budgetController.read_all_budgets(session, clerk_id)

@router.delete('/delete/{budget_id}')
def delete_budget(session: SessionDep, budget_id: int):
  return budgetController.delete_budget(session, budget_id)

@router.put('/put/{budget_id}')
def update_budget(session: SessionDep, budget_id: int, budget: BudgetIn):
  return budgetController.update_budget(session, budget_id, budget)