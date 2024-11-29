import base64
from datetime import datetime, timedelta
from fastapi import HTTPException, status
from app.models.transactions import Transaction, TransactionIn, TransactionListOut, TransactionOut
from sqlmodel import Session, select, func
from core.config import settings
from app.models.users import User
from app.models.budgets import Budget

def read_transaction(session: Session, transaction_id: int, clerk_id: str) -> TransactionOut:
  user = session.exec(select(User.id).where(User.clerkUserId == clerk_id)).first()
  db_transaction = session.exec(select(Transaction).where((Transaction.id == transaction_id) & (Transaction.userId == user))).first() 
  if db_transaction is None:
    raise HTTPException(
      status_code=status.HTTP_404_NOT_FOUND,
      detail="Transaction not found",
    )
  
  response_data = {**db_transaction.model_dump()}

  if db_transaction.budgetId: 
    db_budget = session.exec(
      select(Budget).where(
        Budget.id == db_transaction.budgetId
      )
    ).first()
    response_data = {
      **response_data,
      "budgetName": db_budget.name,
    }

  return response_data

def read_all_transactions(session: Session, clerk_id: str) -> TransactionListOut:
  count_statement = select(func.count(Transaction.id)).select_from(Transaction)
  count = session.exec(count_statement).one()

  user = session.exec(select(User).where(User.clerkUserId == clerk_id)).first()
  db_transactions = session.exec(select(Transaction).where(Transaction.userId == user.id)).all()
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

def read_all_transactions_by_budget(session: Session, budget_id: int) -> TransactionListOut: 
  count_statement = select(func.count(Transaction.id)).select_from(Transaction)
  count = session.exec(count_statement).one()
  
  db_transactions = session.exec(select(Transaction).where(Transaction.budgetId == budget_id)).all()
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

def create_transaction(
    session: Session, data: TransactionIn
) -> Transaction:
    budget = session.exec(select(Budget).where(Budget.name == data.budget)).first()
    if not budget:
        raise HTTPException(status_code=404, detail="Budget not found")

    transaction = Transaction(
        budget=budget,
        userId=budget.userId,
        budgetName=budget.name, 
        description=data.description,
        amount=data.amount,
    )
    session.add(transaction)
    session.commit()
    session.refresh(transaction)

    return transaction

def readAllTransactionsByTime(session: Session, clerkId: str, time: int) -> TransactionListOut:
    user = session.exec(select(User).where(User.clerkUserId == clerkId)).first()
    
    if not user:
        return TransactionListOut(data=[], count=0)  

    now = datetime.now()
    start_time = now - timedelta(days=time)

    count_statement = select(func.count(Transaction.id)).where(Transaction.userId == user.id)
    count = session.exec(count_statement).one()

    dbTransactions = session.exec(
        select(Transaction).where((Transaction.userId == user.id) & (Transaction.date >= start_time) & (Transaction.date <= now))
    ).all()

    response_data = []
    for transaction in dbTransactions:
        db_budget = session.exec(
            select(Budget).where(Budget.id == transaction.budgetId)
        ).first()

        response_data.append({
            **transaction.model_dump(),
            "budgetName": db_budget.name if db_budget else None,
        })

    return TransactionListOut(data=response_data, count=count)