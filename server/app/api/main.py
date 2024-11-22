from fastapi import APIRouter

from api.routes import budget, transaction, user

api_router = APIRouter()

api_router.include_router(budget.router, prefix="/budget", tags=["budget"])
api_router.include_router(transaction.router, prefix="/transaction", tags=["transaction"])
api_router.include_router(user.router, prefix="/user", tags=["user"])
