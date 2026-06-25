# ERPFlow — Mini ERP System

A full-stack Mini ERP System built with React + Vite (Frontend) and Node.js + Express + MongoDB (Backend).

---

## 🚀 Live URL

> _Coming soon after deployment_

---

## 📁 GitHub Repository

> _Add your GitHub link here_

---

## 🛠️ Tech Stack

### Frontend
- React 19 + Vite
- Tailwind CSS
- React Router DOM v6
- React Hook Form
- Axios
- Recharts (Dashboard Charts)
- Lucide React (Icons)
- Sonner (Toast Notifications)
- jsPDF + html2canvas (Invoice Generation)

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication (jsonwebtoken)
- bcryptjs (Password Hashing)
- dotenv, cors, nodemon

---

## ✅ Features / Modules

### 🔐 Authentication
- User Registration
- User Login with JWT Token
- Protected Routes (unauthorized users redirected to login)

### 📊 Dashboard
- Total Products, Customers, Suppliers
- Total Purchases, Sales, Revenue
- Monthly Sales & Revenue Chart (Recharts)
- Top Products Chart

### 📦 Product Management
- Add, Edit, Delete Products
- SKU, Category, Unit, Price, Cost, Stock tracking

### 👥 Customer Management
- Add, Edit, Delete Customers
- Name, Phone, Email, Company, Address

### 🚛 Supplier Management
- Add, Edit, Delete Suppliers
- Name, Phone, Email, Address

### 🛒 Purchase Management
- Record new purchases
- Auto stock update on purchase

### 💰 Sales Management
- Record new sales
- Auto stock deduction on sale
- Invoice generation (PDF download)

### 📈 Reports
- Product Report
- Customer Report
- Supplier Report
- Purchase Report
- Sales Report

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account

### 1. Clone the repository
```bash
git clone https://github.com/your-username/erpflow.git
```

### 2. Backend Setup
```bash
cd erpflow-server/backend
npm install
```

Create `.env` file:
```env
PORT=8000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/erpflow?appName=Cluster0
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

Run backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd erpflow/frontend
npm install
```

Create `.env` file:
```env
VITE_API_URL=http://localhost:8000
```

Run frontend:
```bash
npm run dev
```

---

## 📂 Project Structure

```
erpflow/
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # Auth context
│   │   ├── layouts/         # Dashboard layout
│   │   ├── pages/           # All pages
│   │   │   ├── suppliers/
│   │   │   ├── purchases/
│   │   │   └── sales/
│   │   ├── services/        # API service functions
│   │   └── utils/           # Axios instance
│   └── ...
│
└── erpflow-server/
    └── backend/
        ├── config/          # DB connection
        ├── controllers/     # Route handlers
        ├── middleware/      # Auth middleware
        ├── models/          # Mongoose models
        ├── routes/          # API routes
        └── server.js
```

---

## 🧠 Architecture

- **Frontend** communicates with Backend via REST API using Axios
- **JWT tokens** stored in localStorage for authentication
- **Protected Routes** implemented with React Router + AuthContext
- **Stock auto-update** on every purchase (increment) and sale (decrement)
- **Invoice PDF** generated client-side using jsPDF + html2canvas

---

## 🤖 AI Tools Used

- **Claude (Anthropic)** — Primary development assistant
- Used for: Code generation, debugging, routing fixes, architecture decisions

---

## ⏱️ Development Time

| Phase | Time |
|-------|------|
| Project Setup | ~1 hour |
| Backend API | ~3 hours |
| Frontend UI | ~4 hours |
| Bug Fixes & Testing | ~2 hours |
| **Total** | **~10 hours** |

---

## 💡 Prompting Workflow

1. Described the full project requirements to Claude
2. Generated backend structure (models, controllers, routes)
3. Generated frontend pages one by one
4. Used Claude to debug routing issues (404 errors)
5. Used Claude to fix data structure mismatches between frontend and backend
6. Iterated quickly using AI suggestions

---

## 🚧 Challenges & Solutions

| Challenge | Solution |
|-----------|----------|
| 404 errors on all pages | Fixed route paths — added `/dashboard/` prefix to all routes |
| Purchase/Sale not saving | Fixed data structure mismatch between frontend (items array) and backend (single product) |
| Token not being sent | Verified localStorage `user` key and axios interceptor |
| Wrong MongoDB database | Added `/erpflow` database name to MONGO_URI |
| Backend running from wrong folder | Moved to correct `/erpflow-server/backend` directory |

---

## 📧 Contact

**Md Azizul Islam**  
Full Stack Developer  
Email: _your email here_