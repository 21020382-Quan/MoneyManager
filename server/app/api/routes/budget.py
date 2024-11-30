from fastapi import APIRouter
from api.deps import SessionDep
import api.applications.budget.budget_controller as budgetController
from app.models.budgets import Budget, BudgetListOut
from app.models.budgets import BudgetIn
from core.config import settings

router = APIRouter()

@router.get('/get/{budgetId}')
def get_budget(session: SessionDep, budgetId: int, clerkId: str):
  return budgetController.readBudget(session, budgetId, clerkId)

@router.post('')
def createBudget(session: SessionDep, budget: BudgetIn, clerkId: str):
  return budgetController.createBudget(session, budget, clerkId)

@router.get('/get_all_budgets/{clerkId}')
def get_all_budgets(session: SessionDep, clerkId: str) -> BudgetListOut: 
  return budgetController.readAllBudgets(session, clerkId)

@router.delete('/delete/{budgetId}')
def deleteBudget(session: SessionDep, budgetId: int, clerkId: str):
  return budgetController.deleteBudget(session, budgetId, clerkId)

@router.put('/put/{budgetId}')
def updateBudget(session: SessionDep, budgetId: int, budget: BudgetIn, clerkId: str):
  return budgetController.updateBudget(session, budgetId, budget, clerkId)