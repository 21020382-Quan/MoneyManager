from fastapi import APIRouter

from api.routes import budget, transaction, wallet, user

api_router = APIRouter()

api_router.include_router(budget.router, prefix="/budget", tags=["budget"])
api_router.include_router(transaction.router, prefix="/transaction", tags=["transaction"])
api_router.include_router(wallet.router, prefix="/wallet", tags=["wallet"])
api_router.include_router(user.router, prefix="/user", tags=["user"])
