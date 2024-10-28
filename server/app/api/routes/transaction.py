from fastapi import APIRouter
from api.deps import SessionDep
import api.applications.transaction.transaction_controller as TransactionController
from models.transactions import Transaction

router = APIRouter()

@router.get('/{transaction_id}')
def get_transaction(session: SessionDep, transaction_id: int):
  return TransactionController.read_transaction(session, transaction_id)

@router.post('/')
def create_transaction(session: SessionDep, transaction: Transaction):
  return TransactionController.create_transaction(session, transaction)

@router.delete('/{transaction_id}')
def delete_transaction(session: SessionDep, transaction_id: int):
  return TransactionController.delete_transaction(session, transaction_id)

@router.put('/{transaction_id}')
def update_transaction(session: SessionDep, transaction_id: int, transaction: Transaction):
  return TransactionController.update_transaction(session, transaction_id, transaction)