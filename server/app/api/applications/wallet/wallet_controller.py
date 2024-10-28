import base64
from fastapi import File, HTTPException, UploadFile
from app.models.wallets import Wallet
from sqlmodel import Session, select
from core.config import settings

def read_wallet(session: Session, wallet_id: int) -> Wallet:
  db_wallet = session.get(Wallet, wallet_id)
  if not db_wallet:
    raise HTTPException(status_code=404, detail="wallet not found")
  return db_wallet

def delete_wallet(session: Session, wallet_id: int):
  db_wallet = Session.exec(select(Wallet).where(Wallet.id == wallet_id)).first()
  if not db_wallet:
    raise HTTPException(status_code=404, detail="wallet not found")
  session.delete(db_wallet)
  session.commit()
  return 

def update_wallet(session: Session, wallet_id: int, data: Wallet) -> Wallet:
  db_wallet = session.get(Wallet, wallet_id)
  if not db_wallet:
    raise HTTPException(status_code=404, detail="wallet not found") 
  db_wallet.sqlmodel_update(data.model_dump(exclude_unset=True))

  session.commit()
  session.refresh(db_wallet)

  return db_wallet

def create_wallet(session: Session, data: Wallet) -> Wallet: 
  wallet = session.exec(select(Wallet).where(Wallet.name == data.name)).first()
  wallet = Wallet(
    name=data.name, 
    value=data.value,
    created_at=data.created_at,
  )
  session.add(wallet)
  session.commit()
  session.refresh(wallet)

  return wallet