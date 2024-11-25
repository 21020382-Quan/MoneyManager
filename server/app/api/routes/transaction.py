from fastapi import APIRouter
from api.deps import SessionDep
import api.applications.transaction.transaction_controller as TransactionController
from app.models.transactions import Transaction, TransactionIn, TransactionListOut, TransactionOut
from app.models.budgets import Budget

router = APIRouter()

@router.get('/get/{transaction_id}')
def get_transaction(session: SessionDep, user_id: int, transaction_id: int):
  return TransactionController.read_transaction(session, user_id, transaction_id)

@router.post('/')
def create_transaction(session: SessionDep, data: TransactionIn):
  return TransactionController.create_transaction(session, data)

@router.delete('/delete/{transaction_id}')
def delete_transaction(session: SessionDep, transaction_id: int):
  return TransactionController.delete_transaction(session, transaction_id)

@router.put('/put/{transaction_id}')
def update_transaction(session: SessionDep, transaction_id: int, transaction: Transaction):
  return TransactionController.update_transaction(session, transaction_id, transaction)

@router.get('/get_all_transactions/{user_id}')
def get_all_transactions(session: SessionDep, user_id: int) -> TransactionListOut: 
  return TransactionController.read_all_transactions(session, user_id)

@router.get('/get_all_transactions_by_budget/{budget_id}')
def get_all_transactions_by_budget(session: SessionDep, budget_id: int) -> TransactionListOut: 
  return TransactionController.read_all_transactions_by_budget(session, budget_id)