from fastapi import APIRouter
from api.deps import SessionDep
import api.applications.user.user_controller as UserController
from models.users import User

router = APIRouter()

@router.get('/{user_id}')
def get_user(session: SessionDep, user_id: int):
  return UserController.read_user(session, user_id)

@router.post('/')
def create_user(session: SessionDep, user: User):
  return UserController.create_user(session, user)

@router.delete('/{user_id}')
def delete_user(session: SessionDep, user_id: int):
  return UserController.delete_user(session, user_id)

@router.put('/{user_id}')
def update_user(session: SessionDep, user_id: int, user: User):
  return UserController.update_user(session, user_id, user)