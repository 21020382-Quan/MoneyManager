import json
from sqlalchemy import func
from sqlmodel import Session, create_engine, select

from core.config import settings

engine = create_engine(str(settings.SQLALCHEMY_DATABASE_URI))


def init_db(session: Session) -> None:
    print("")

