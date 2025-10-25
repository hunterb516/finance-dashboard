import os
from decimal import Decimal
from datetime import timedelta

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager, create_access_token, create_refresh_token,
    jwt_required, get_jwt_identity
)

from sqlalchemy import select, func, case, text
from models import Base, engine, get_db, Transaction, TxType, User
from auth import verify_password  # must return True/False for plain pw vs stored hash


# ----------------- App & Config -----------------
app = Flask(__name__)
Base.metadata.create_all(bind=engine)
# Secret from env (fallback for local dev)
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "dev-only-secret")
# Optional: tweak lifetimes (short access, longer refresh)
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=15)
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=7)

# CORS – allow Authorization, Cache-Control, and credentials
CORS(
    app,
    resources={r"/api/*": {"origins": ["http://localhost:5173"]}},
    supports_credentials=True,
    allow_headers=["Content-Type", "Authorization", "Cache-Control"],
    expose_headers=["Content-Type", "Authorization"],
)

jwt = JWTManager(app)

# Create tables if missing (dev convenience)
Base.metadata.create_all(bind=engine)


# ----------------- Health -----------------
@app.get("/api/health")
def health():
    return jsonify({"status": "ok"})


# ----------------- Auth -----------------
@app.post("/api/auth/login")
def login():
    data = request.get_json() or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    with next(get_db()) as db:
        user = db.query(User).filter(User.email == email).first()
        if not user or not verify_password(password, user.password_hash):
            return jsonify({"msg": "Bad credentials"}), 401

        identity = str(user.id)  # keep identity as string for JWT
        access_token = create_access_token(identity=identity)
        refresh_token = create_refresh_token(identity=identity)

        return jsonify({
            "access_token": access_token,
            "refresh_token": refresh_token,
            "user": {"id": user.id, "email": user.email}
        })


@app.post("/api/auth/refresh")
@jwt_required(refresh=True)
def refresh():
    uid = get_jwt_identity()  # string
    new_access = create_access_token(identity=uid)
    return jsonify({"access_token": new_access})


# ----------------- Analytics -----------------
@app.get("/api/analytics/monthly")
@jwt_required()
def monthly_spending():
    uid = int(get_jwt_identity())

    month_label = func.to_char(Transaction.date, text("'YYYY-MM'")).label("month")

    with next(get_db()) as db:
        res = db.execute(
            select(
                month_label,
                func.sum(
                    case(
                        (Transaction.type == TxType.EXPENSE, Transaction.amount),
                        else_=Decimal("0")
                    )
                ).label("expenses"),
                func.sum(
                    case(
                        (Transaction.type == TxType.INCOME, Transaction.amount),
                        else_=Decimal("0")
                    )
                ).label("income"),
            )
            .where(Transaction.user_id == uid)
            .group_by(month_label)
            .order_by(month_label)
        ).all()

    items = [
        {"month": r.month, "expenses": float(r.expenses or 0), "income": float(r.income or 0)}
        for r in res
    ]
    return jsonify({"items": items})


@app.get("/api/analytics/categories")
@jwt_required()
def category_distribution():
    uid = int(get_jwt_identity())

    with next(get_db()) as db:
        res = db.execute(
            select(
                Transaction.category,
                func.sum(
                    case(
                        (Transaction.type == TxType.EXPENSE, Transaction.amount),
                        else_=Decimal("0")
                    )
                ).label("total")
            )
            .where(Transaction.user_id == uid)
            .group_by(Transaction.category)
            .order_by(Transaction.category)
        ).all()

    items = [{"category": r.category, "total": float(r.total or 0)} for r in res]
    return jsonify({"items": items})


@app.get("/api/analytics/savings")
@jwt_required()
def ytd_savings():
    uid = int(get_jwt_identity())

    # Build the SELECT first
    savings_expr = (
        func.sum(case((Transaction.type == TxType.INCOME,  Transaction.amount), else_=Decimal("0")))
        - func.sum(case((Transaction.type == TxType.EXPENSE, Transaction.amount), else_=Decimal("0")))
    ).label("savings")

    query = (
        select(savings_expr)
        .where(Transaction.user_id == uid)
        .where(func.date_part("year", Transaction.date) == func.date_part("year", func.now()))
    )

    with next(get_db()) as db:
        result = db.execute(query).one_or_none()

    savings = float(result[0]) if result and result[0] is not None else 0.0
    goal = 5000.0
    return jsonify({"ytd": savings, "goal": goal})


# ----------------- Transactions -----------------------

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
