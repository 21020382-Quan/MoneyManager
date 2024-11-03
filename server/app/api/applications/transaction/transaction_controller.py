import base64
from fastapi import File, HTTPException, UploadFile
from models.transactions import Transaction
from sqlmodel import Session, select
from core.config import settings
from app.models.users import User

def read_transaction(session: Session, transaction_id: int) -> Transaction:
  db_transaction = session.get(Transaction, transaction_id)
  if not db_transaction:
    raise HTTPException(status_code=404, detail="Transaction not found")
  return db_transaction

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
        user = data.user,
        budget_id=data.budget_id,
        description=data.description,
        amount=data.amount,
        date=data.date 
    )
  session.add(transaction)
  session.commit()
  session.refresh(transaction)

  return transaction