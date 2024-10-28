import base64
from fastapi import File, HTTPException, UploadFile
from app.models.users import User
from sqlmodel import Session, select
from core.config import settings

def read_user(session: Session, user_id: int) -> User:
  db_user = session.get(User, user_id)
  if not db_user:
    raise HTTPException(status_code=404, detail="user not found")
  return db_user

def delete_user(session: Session, user_id: int):
  db_user = session.get(User, user_id)
  if not db_user:
    raise HTTPException(status_code=404, detail="user not found")
  session.delete(db_user)
  session.commit()
  return 

def update_user(
    session: Session, user_id: int, data_in: User
) -> User:
    db_user = session.get(User, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    db_user.sqlmodel_update(data_in.model_dump(exclude_unset=True))

    session.commit()
    session.refresh(db_user)

    return db_user

def create_user(session: Session, data_in: User) -> User:
  user = session.exec(select(User).where(User.email == data_in.email)).first()
  if user:
    raise HTTPException(status_code=400, detail="User name already registered")

  if "@" not in data_in.email:
    raise HTTPException(status_code=400, detail="Invalid email address")

  user = session.exec(select(User).where(User.email == data_in.email)).first()
  if user:
    raise HTTPException(status_code=400, detail="Email address already registered")

  user = User(
    email=data_in.email,
  )
  session.add(user)
  session.commit()
  session.refresh(user)

  return user