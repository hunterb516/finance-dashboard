from datetime import date
from decimal import Decimal
from sqlalchemy.orm import Session

from models import Base, engine, SessionLocal, User, Transaction, TxType
from auth import hash_password

# Ensure tables exist
Base.metadata.create_all(bind=engine)

def run():
    db: Session = SessionLocal()

    demo_email = "demo@user.com"
    user = db.query(User).filter_by(email=demo_email).first()
    if not user:
        user = User(
            email=demo_email,
            password_hash=hash_password("password123"),
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        rows = [
            Transaction(user_id=user.id, date=date(2025, 9, 1), amount=Decimal("2500"), type=TxType.INCOME,  category="Salary", note="paycheck"),
            Transaction(user_id=user.id, date=date(2025, 9, 2), amount=Decimal("120.45"), type=TxType.EXPENSE, category="Groceries"),
            Transaction(user_id=user.id, date=date(2025, 9, 5), amount=Decimal("60.00"), type=TxType.EXPENSE, category="Gas"),
            Transaction(user_id=user.id, date=date(2025, 9, 10), amount=Decimal("900"), type=TxType.EXPENSE, category="Rent"),
            Transaction(user_id=user.id, date=date(2025, 9, 15), amount=Decimal("2500"), type=TxType.INCOME, category="Salary"),
            Transaction(user_id=user.id, date=date(2025, 9, 18), amount=Decimal("45.12"), type=TxType.EXPENSE, category="Dining"),
        ]
        db.add_all(rows)
        db.commit()

    db.close()

if __name__ == "__main__":
    run()
