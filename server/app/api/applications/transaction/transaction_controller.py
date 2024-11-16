import base64
from fastapi import HTTPException, status
from app.models.transactions import Transaction, TransactionIn, TransactionListOut, TransactionOut
from sqlmodel import Session, select, func
from core.config import settings
from app.models.users import User
from app.models.budgets import Budget

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

def read_all_transactions(session: Session) -> TransactionListOut:
  count_statement = select(func.count(Transaction.id)).select_from(Transaction)
  count = session.exec(count_statement).one()

  db_transactions = session.exec(select(Transaction)).all()
  response_data = []
  tr_list_id = [transaction.id for transaction in db_transactions if transaction.id]
  db_list_transactions = session.exec(
      select(Transaction).where(Transaction.id.in_(tr_list_id))
  ).all()

  list_transactions_map = {
      transaction.id: transaction for transaction in db_list_transactions
  }

  for transaction in db_transactions:
      if transaction.id:
          response_data.append(
              {
                  **transaction.model_dump(),
                  "transaction": list_transactions_map[transaction.id].model_dump(),
              }
          )
          print(response_data)
      else:
          response_data.append(transaction.model_dump())
  return TransactionListOut(data=response_data, count=count)

def delete_transaction(session: Session, transaction_id: int):
  db_transaction = session.get(Transaction, transaction_id)
  if not db_transaction:
    raise HTTPException(status_code=404, detail="Transaction not found")
  session.delete(db_transaction)
  session.commit()
  return 

def update_transaction(session: Session, transaction_id: int, data: TransactionIn) -> Transaction:
  db_transaction = session.get(Transaction, transaction_id)
  if not db_transaction:
    raise HTTPException(status_code=404, detail="Transaction not found") 
  db_transaction.sqlmodel_update(data.model_dump(exclude_unset=True))

  session.commit()
  session.refresh(db_transaction)

  return db_transaction

def create_transaction(session: Session, data: TransactionIn) -> Transaction: 
  user = session.exec(select(User).where(User.id == data.user_id)).first()
  transaction = Transaction(
      user_id=user.id,
      budget_id=data.budget_id,
      description=data.description,
      amount=data.amount,
    )
  session.add(transaction)
  session.commit()
  session.refresh(transaction)

  return transaction