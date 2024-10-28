import base64
from fastapi import File, HTTPException, UploadFile
from models.transactions import Transaction
from sqlmodel import Session, select
from core.config import settings

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
  transaction = session.exec(select(Transaction).where(Transaction.name == data.name)).first()
  transaction = Transaction(
    description=data.description,
    date=data.date, 
    value=data.value,
    category_id=data.category_id,
    is_notified=data.is_notified,
    user_id=data.user_id, 
    wallet_id=data.wallet_id, 
    name=data.name, 
    image=data.image,
  )
  session.add(transaction)
  session.commit()
  session.refresh(transaction)

  return transaction