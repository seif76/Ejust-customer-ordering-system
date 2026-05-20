# E‑JUST Store – Internal Staff Supplies Ordering System

A full‑stack web application for **Egypt‑Japan University of Science and Technology (E‑JUST)**.
Staff members (teaching assistants, lab engineers, faculty) can browse and request supplies from the
central campus store, while administrators manage inventory, approve orders, and monitor usage.

---

## 🎯 Project Context

This is an **internal supplies portal** – not a public e‑commerce site.
A TA needing lab consumables or an engineer requiring office equipment logs in, selects the items,
and submits a request. The admin verifies stock, confirms or rejects the order, and maintains the
product catalogue.

---

## 👥 User Roles

| Role         | Actor Type | Description |
|--------------|------------|-------------|
| **Staff**    | Primary    | Authenticated university employee who browses products, adds items to a cart, and places supply requests. |
| **Admin**    | Primary    | Authenticated manager who maintains the product catalogue (CRUD, images), views all orders, and updates their status. |
| System Timer | Offstage   | Automatically cancels supply requests that remain "pending" for 30 minutes to free up stock. |
| Cloudinary   | Supporting | Stores product images uploaded by the admin. |

---

## ⚙️ Tech Stack

| Layer       | Technology |
|-------------|------------|
| **Frontend** | Next.js (App Router), Tailwind CSS, Axios, Lucide Icons |
| **Backend**  | FastAPI (Python 3), SQLAlchemy (async), MySQL, JWT (python‑jose), bcrypt |
| **Image Storage** | Cloudinary (signed, server‑side signature) |
| **Testing**  | pytest (unit & integration), Playwright (E2E, Page Object Model) |

---

## 📦 Features

### 👤 Staff (Internal User)

- Register and login with JWT (token stored in localStorage, auto‑redirect on expiry)
- Browse products with search and category filters
- Product detail page (image, stock, price)
- Cart management (local state, persisted in localStorage)
- Place a **supply request** (order) – stock decrements automatically
- View own request history and real‑time status

### 🔧 Admin

- Separate admin authentication
- Dashboard: total requests, total spent, top requested products
- Product management: add, edit, delete products, upload images via Cloudinary
- Category management
- View all staff requests, filter by status
- Change request status: **confirm** (approved), **cancel** (denied), **reopen** (back to pending)
- Protected routes – any admin URL redirects to login if no token

---

## 🗂️ Project Structure
customer-ordering-system/
├── backend/ # FastAPI application
│ ├── app/
│ │ ├── main.py
│ │ ├── auth/
│ │ ├── dependencies/
│ │ ├── models/ # Admin, User, Product, Order, OrderItem, Category
│ │ ├── routes/ # auth, admin_auth, products, orders, categories, cloudinary
│ │ ├── schemas/
│ │ ├── core/ # startup, config
│ │ └── db/ # database.py (engine, SessionLocal, Base, get_db)
│ ├── tests/ # pytest suite (unit + integration)
│ │ ├── conftest.py
│ │ ├── unit/
│ │ └── integration/
│ └── requirements.txt
├── frontend/ # Next.js application
│ ├── app/
│ │ ├── (auth)/ # login, signup
│ │ ├── (staff)/ # protected staff pages (sidebar, products, cart, orders)
│ │ ├── admin/ # admin login & protected admin pages
│ │ └── layout.jsx # root layout (CartProvider, Cloudinary script)
│ ├── components/ # AdminNav, UserNav, ProtectedRoute
│ ├── context/ # CartContext.js
│ ├── hooks/ # useCloudinaryUpload.js
│ ├── lib/ # axios.js, adminAxios.js, auth.js, adminAuth.js
│ ├── tests/ # Playwright E2E
│ │ ├── pages/ # Page Object Model classes
│ │ └── e2e/ # test specs
│ └── playwright.config.js
├── .gitignore
├── README.md
└── PROJECT_MANAGEMENT.md # Detailed sprint plan & assignments



---

## 🔐 Authentication & Authorization

- Two separate tables: `users` (staff) and `admins`.
- Staff login → JWT with role `user`; Admin login → JWT with admin context.
- Frontend stores JWT in `localStorage` and attaches it to every request via Axios interceptors.
- Expired tokens redirect to login automatically.
- Admin routes double‑check role on the backend using dependency `get_current_admin`.
- Cloudinary uploads are **signed** using a server‑generated signature, preventing abuse.

---

## 🚀 Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- MySQL server (or use SQLite for development)
- Cloudinary account (free tier)

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/Scripts/activate   # or venv/bin/activate on Mac/Linux
pip install -r requirements.txt
# Configure your .env file (see .env.example)
uvicorn app.main:app --reload