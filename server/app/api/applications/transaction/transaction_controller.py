import base64
from collections import defaultdict
from datetime import datetime, timedelta
from fastapi import HTTPException, status
from app.models.transactions import Transaction, TransactionIn, TransactionListOut, TransactionOut
from sqlmodel import Session, select, func
from core.config import settings
from app.models.users import User
from app.models.budgets import Budget
import requests
from bs4 import BeautifulSoup

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
      "budget": db_budget.name,
    }

  return response_data

def read_all_transactions(session: Session, clerkId: str) -> TransactionListOut:
  count_statement = select(func.count(Transaction.id)).select_from(Transaction)
  count = session.exec(count_statement).one()

  user = session.exec(select(User).where(User.clerkUserId == clerkId)).first()
  db_transactions = session.exec(select(Transaction).where(Transaction.userId == user.id)).all()
  response_data = []
  for data in db_transactions:
    if data.budgetId: 
      db_budget = session.exec(
        select(Budget).where(
          Budget.id == data.budgetId
        )
      ).first()
      response_data.append(
        {
        **data.model_dump(),
        "budget": db_budget.name,
        }
      )
  return TransactionListOut(data=response_data, count=count)

def delete_transaction(session: Session, transaction_id: int):
  db_transaction = session.get(Transaction, transaction_id)
  budget = session.exec(select(Budget).where(Budget.id == db_transaction.budgetId)).first()
  budget.totalSpent -= db_transaction.amount
  if not db_transaction:
    raise HTTPException(status_code=404, detail="Transaction not found")
  session.delete(db_transaction)
  session.commit()
  return 

def update_transaction(session: Session, transaction_id: int, data: TransactionIn) -> Transaction:
  db_transaction = session.get(Transaction, transaction_id)
  amount = db_transaction.amount
  budget = session.exec(select(Budget).where(Budget.id == db_transaction.budgetId)).first()
  budget.totalSpent = budget.totalSpent + amount - db_transaction.amount
  if not db_transaction:
    raise HTTPException(status_code=404, detail="Transaction not found") 
  db_transaction.sqlmodel_update(data.model_dump(exclude_unset=True))

  session.commit()
  session.refresh(db_transaction)

  return db_transaction

def createTransaction(
    session: Session, data: TransactionIn
) -> Transaction:
    budget = session.exec(select(Budget).where(Budget.name == data.budget)).first()
    budget.totalSpent += data.amount
    if not budget:
        raise HTTPException(status_code=404, detail="Budget not found")

    transaction = Transaction(
        budget=budget,
        userId=budget.userId,
        description=data.description,
        amount=data.amount,
    )
    session.add(transaction)
    session.commit()
    session.refresh(transaction)

    return transaction

def readAllTransactionsByTime(session: Session, clerkId: str, time: int):
    user = session.exec(select(User).where(User.clerkUserId == clerkId)).first()
    
    if not user:
        return TransactionListOut(data=[], count=0)  

    now = datetime.now()
    start_time = now - timedelta(days=time)

    count_statement = select(func.count(Transaction.id)).where(Transaction.userId == user.id)
    count = session.exec(count_statement).one()

    if time == 0: 
       return readAllTransactionsByDay(session, clerkId)

    dbTransactions = session.exec(
        select(Transaction).where((Transaction.userId == user.id) & (Transaction.date >= start_time) & (Transaction.date <= now))
    ).all()

    grouped_transactions = defaultdict(list)
    for transaction in dbTransactions:
        transaction_date = transaction.date.date()
        grouped_transactions[transaction_date].append(transaction)

    response_data = []
    for transaction_date, daily_transactions in grouped_transactions.items():
        combined_transaction = {
            "date": transaction_date,
            "amount": sum(t.amount for t in daily_transactions), 
        }
        response_data.append(combined_transaction)

    return response_data

def readAllTransactionsByDay(session: Session, clerkId: str):
    user = session.exec(select(User).where(User.clerkUserId == clerkId)).first()
    transactions = session.exec(select(Transaction).where(Transaction.userId == user.id)).all()

    grouped_transactions = defaultdict(list)
    for transaction in transactions:
        transaction_date = transaction.date.date()
        grouped_transactions[transaction_date].append(transaction)

    response_data = []
    for transaction_date, daily_transactions in grouped_transactions.items():
        combined_transaction = {
            "date": transaction_date,
            "amount": sum(t.amount for t in daily_transactions), 
        }
        response_data.append(combined_transaction)

    return response_data

def scrape_evn_pricing():
    url = "https://www.evn.com.vn/c3/evn-va-khach-hang/Bieu-gia-ban-dien-9-76.aspx"
    try:
        # Gửi yêu cầu HTTP GET đến trang web
        response = requests.get(url)
        response.raise_for_status()  # Kiểm tra lỗi HTTP
        soup = BeautifulSoup(response.content, "html.parser")
        
        # Tìm nội dung của bảng giá
        tables = soup.find_all("table")  # Tìm tất cả bảng trên trang
        if not tables:
            return {"error": "Không tìm thấy bảng trên trang"}

        # Ví dụ: lấy dữ liệu từ bảng đầu tiên
        table = tables[0]
        rows = table.find_all("tr")  # Lấy tất cả các hàng trong bảng

        # Chuyển dữ liệu bảng thành danh sách
        data = []
        for row in rows:
            cells = row.find_all(["td", "th"])  # Lấy các ô dữ liệu
            data.append([cell.get_text(strip=True) for cell in cells])

        return {"url": url, "pricing_table": data}
    except requests.exceptions.RequestException as e:
        return {"error": str(e)}