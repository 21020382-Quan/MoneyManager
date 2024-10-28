from fastapi import APIRouter
from api.deps import SessionDep
import api.applications.wallet.wallet_controller as WalletController
from app.models.wallets import Wallet

router = APIRouter()

@router.get('/{wallet_id}')
def get_wallet(session: SessionDep, wallet_id: int):
  return WalletController.read_wallet(session, wallet_id)

@router.post('/')
def create_wallet(session: SessionDep, wallet: Wallet):
  return WalletController.create_wallet(session, wallet)

@router.delete('/{wallet_id}')
def delete_wallet(session: SessionDep, wallet_id: int):
  return WalletController.delete_wallet(session, wallet_id)

@router.put('/{wallet_id}')
def update_wallet(session: SessionDep, wallet_id: int, wallet: Wallet):
  return WalletController.update_wallet(session, wallet_id, wallet)