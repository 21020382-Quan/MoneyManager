import base64
from fastapi import HTTPException, status
from models.transactions import Transaction, TransactionOut
from sqlmodel import Session, select
from core.config import settings
from models.users import User
from models.budgets import Budget

def read_transaction(session: Session, transaction_id: int) -> TransactionOut:
  db_transaction = session.exec(select(Transaction).where(Transaction.id == transaction_id)).first()
  if db_transaction is None:
    raise HTTPException(
      status_code=status.HTTP_404_NOT_FOUND,
      detail="Transaction not found",
    )
  
  response_data = {**db_transaction.model_dump()}
  if db_transaction.user_id:
    db_user = session.exec(
      select(User).where(
        User.id == db_transaction.user_id
      )
    ).first()
    response_data = {
      **response_data,
      "user": db_user.model_dump(),
    }

  if db_transaction.budget_id: 
    db_budget = session.exec(
      select(Budget).where(
        Budget.id == db_transaction.budget_id
      )
    ).first()
    response_data = {
      **response_data,
      "budget": db_budget.model_dump(),
    }

  return response_data

def delete_transaction(session: Session, transaction_id: int):
  db_transaction = session.get(Transaction, transaction_id)
  if not db_transaction:
    raise HTTPException(status_code=404, detail="Transaction not found")
  session.delete(db_transaction)
  session.commit()
  return 

def update_transaction(session: Session, transaction_id: int, data: Transaction) -> Transaction:
  db_transaction = session.get(Transaction, transaction_id)
  if not db_transaction:
    raise HTTPException(status_code=404, detail="Transaction not found") 
  db_transaction.sqlmodel_update(data.model_dump(exclude_unset=True))

  session.commit()
  session.refresh(db_transaction)

  return db_transaction

def create_transaction(session: Session, data: Transaction) -> Transaction: 
  user = session.exec(select(User).where(User.id == data.user_id)).first()
  transaction = Transaction(
        user_id=data.user_id,
        budget_id=data.budget_id,
        description=data.description,
        amount=data.amount,
        date=data.date 
    )
  session.add(transaction)
  session.commit()
  session.refresh(transaction)

  return transaction