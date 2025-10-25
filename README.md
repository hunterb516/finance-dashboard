# Personal Finance Dashboard

A **full-stack personal finance dashboard** built as a **functional prototype** to track income, expenses, and savings goals — with live analytics and visualizations.

This project demonstrates my ability to design and integrate a complete system including:
- Frontend (React + Vite)
- Backend API (Flask / Python)
- PostgreSQL database
- Authentication (JWT)
- Dockerized development environment

---

## 🚀 Overview

The **Personal Finance Dashboard** lets users:
- Log in securely using JWT-based authentication
- Add, edit, and delete transactions
- Automatically categorize income and expenses
- Visualize financial insights through dynamic charts
- View monthly income vs. expenses and year-to-date savings

It was built as a **functional prototype** running locally through Docker.  
All key features are implemented and demonstrated below.

---

## 🧠 Tech Stack

**Frontend:** React, Axios, Chart.js, Vite  
**Backend:** Flask (Python), SQLAlchemy, JWT Auth  
**Database:** PostgreSQL  
**DevOps:** Docker, Docker Compose  
**Auth:** Secure JWT-based sessions stored in LocalStorage

---

## 🖥️ Screenshots

### Login Page
![Login Page](https://github.com/hunterb516/finance-dashboard/docs/login.png)

### Transactions Page
![Transactions](https://github.com/hunterb516/finance-dashboard/docs/transactions.png)

### Dashboard Analytics
![Dashboard](https://github.com/hunterb516/finance-dashboard/docs/dashboard.png)

> *Note:* The above images show the fully working prototype locally.  
> The app was developed in a containerized environment and integrates all core backend features.

---

## Features

- **JWT Authentication:** Secure login flow with token storage and refresh
- **Transaction Management:** CRUD operations for income & expenses
- **Data Visualization:** Charts for spending breakdown, income trends, and savings goals
- **RESTful API:** Built using Flask with SQLAlchemy ORM
- **Persistent Data:** PostgreSQL database with seed data
- **Dockerized Setup:** One command spin-up for local dev

---

## Architecture
frontend/ → React + Vite client (served at http://localhost:5173)
backend/ → Flask API with routes for auth, transactions, and analytics
database/ → PostgreSQL container (data persisted via volume)

---

## 🐳 Running Locally (Optional Demo Setup)

Note: This project was developed as a functional prototype.
The following setup instructions are included for completeness, but the live environment may require minor configuration updates before running locally.

# 1. Clone the repository
git clone https://github.com/hunterb516/finance-dashboard.git
cd finance-dashboard

# 2. Build and start the containers
docker compose up --build

# 3. Access the app
Frontend: http://localhost:5173  
Backend API: http://localhost:5000

Login credentials (from the seeded database):
Email: demo@user.com  
Password: password123

---

## 🧠 Lessons Learned

- Implementing JWT authentication with Axios interceptors
- Handling CORS and environment variables between frontend and backend
- Structuring Docker containers for full-stack development
- Using Chart.js for dynamic financial data visualization
- Managing database migrations and seed scripts in Flask

---

## About the Project

This was developed as part of a college software engineering project, showcasing:
- Full-stack integration
- Database and API design
- Data visualization and state management
- Real-world deployment patterns via Docker Compose

Type: Functional Prototype
Built by: Hunter Braddy
Year: 2025

---

## 📄 License

This project is open-source under the MIT License.
See the [LICENSE](./LICENSE) file for more information.
