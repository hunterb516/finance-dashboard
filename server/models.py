import os
import enum
from datetime import datetime, date
from decimal import Decimal

from sqlalchemy import (
    create_engine, Column, Integer, String, Numeric, Date, Enum,
    ForeignKey, DateTime
)
from sqlalchemy.orm import declarative_base, relationship, sessionmaker

# --------------------------------------------------------------------
# DB engine / session
# --------------------------------------------------------------------
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://finuser:finpass@db:5432/finance")

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

Base = declarative_base()

# --------------------------------------------------------------------
# Models
# --------------------------------------------------------------------
class TxType(str, enum.Enum):
    INCOME = "INCOME"
    EXPENSE = "EXPENSE"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    transactions = relationship("Transaction", back_populates="user", cascade="all, delete-orphan")

class Transaction(Base):
    __tablename__ = "transactions"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    description = Column(String(255), nullable=False)
    amount = Column(Numeric(12, 2), nullable=False)
    type = Column(Enum(TxType), nullable=False)
    category = Column(String(100), nullable=True)
    date = Column(Date, nullable=False, default=date.today)

    user = relationship("User", back_populates="transactions")
