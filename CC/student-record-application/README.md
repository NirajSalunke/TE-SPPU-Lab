# 🎓 SRMS — Student Record Management System

A full-stack MERN application for managing student academic records — departments, courses, enrolments, grades, and attendance.

**Stack:** React 18 + Vite + Tailwind CSS · Express 4 · MongoDB Atlas · JWT Auth

---

## 📁 Project Structure

```
student-record-application/
├── client/          # React frontend (Vite + Tailwind)
└── server/          # Express backend API
```

---

## ⚡ Local Development

### 1. Clone & configure

```bash
# Backend
cd server
cp .env.example .env
# Fill in MONGO_URI (Atlas connection string) and JWT_SECRET
```

```bash
# Frontend
cd client
cp .env.example .env
# VITE_API_BASE_URL defaults to /api (Vite proxies to localhost:5000)
```

### 2. Install dependencies

```bash
cd server && npm install
cd ../client && npm install
```

### 3. Seed the database

```bash
cd server
npm run seed           # Seeds with demo data
# Or for a fresh start:
npm run seed:fresh     # Drops all collections, then re-seeds
```

**Default Admin Login:**
```
Email:    admin@srms.edu
Password: Admin@1234
```

### 4. Run locally (2 terminals)

```bash
# Terminal 1 — Backend (port 5000)
cd server && npm run dev

# Terminal 2 — Frontend (port 5173 with HMR)
cd client && npm run dev
```

Open: **http://localhost:5173**

---

## ☁️ AWS EC2 Deployment (using `screen`)

> **Architecture:** Express serves the built React app as static files.  
> One process, one port, one `screen` session — no Nginx, no PM2 needed.

### Step 1 — Launch EC2 & install Node 24

```bash
# On EC2 (Ubuntu 22.04 recommended)
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt-get install -y nodejs git

# Verify
node -v   # should show v24.x.x
npm -v
```

### Step 2 — Clone the repository

```bash
git clone <your-repo-url> srms
cd srms
```

### Step 3 — Configure environment variables

```bash
# Backend
cd server
cp .env.example .env
nano .env
```

Edit `.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/srms?retryWrites=true&w=majority
JWT_SECRET=your_super_long_random_secret_here_change_this
JWT_EXPIRES_IN=7d
NODE_ENV=production
```

```bash
# Frontend — set the backend URL to your EC2 public IP
cd ../client
cp .env.example .env
nano .env
```

Edit `.env`:
```env
VITE_API_BASE_URL=http://<EC2-PUBLIC-IP>:5000/api
```

### Step 4 — Install dependencies

```bash
cd ~/srms/server && npm install --omit=dev
cd ~/srms/client && npm install
```

### Step 5 — Build the frontend

```bash
cd ~/srms/client
npm run build
# Outputs to client/dist/ — Express will serve this in production
```

### Step 6 — Seed the database

```bash
cd ~/srms/server
npm run seed
```

### Step 7 — Start with `screen`

```bash
# Create a named screen session
screen -S srms

# Inside the screen session, start the server
cd ~/srms/server
node server.js

# Detach from screen: press Ctrl+A, then D
# The server keeps running in background
```

**Access the app:** `http://<EC2-PUBLIC-IP>:5000`

> ⚠️ Make sure EC2 Security Group allows inbound TCP on port **5000** from `0.0.0.0/0`

---

## 🖥️ Useful `screen` Commands

| Command | What it does |
|---|---|
| `screen -S srms` | Create a new screen named "srms" |
| `Ctrl+A, D` | Detach from screen (app keeps running) |
| `screen -r srms` | Re-attach to screen |
| `screen -ls` | List all screens |
| `screen -X -S srms quit` | Kill the screen session |

---

## 🔄 Updating the Application on EC2

```bash
# 1. Pull latest code
cd ~/srms
git pull

# 2. Rebuild frontend
cd client && npm install && npm run build

# 3. Restart server
screen -r srms
# Ctrl+C to stop
node ~/srms/server/server.js
# Ctrl+A, D to detach
```

---

## 🔐 Default Credentials (after seeding)

| Role | Email | Password |
|---|---|---|
| Admin | admin@srms.edu | Admin@1234 |
| Faculty | arjun.mehta@srms.edu | Faculty@1234 |
| Faculty | kavitha.rao@srms.edu | Faculty@1234 |

---

## 🌱 Seed Data Summary

| Entity | Count |
|---|---|
| Departments | 5 (CS, IT, ECE, ME, CE) |
| Users | 1 Admin + 4 Faculty |
| Courses | 15 across departments |
| Students | 40 with realistic data |
| Enrolments | ~120+ with mixed grades |
| Attendance | 30 days of records |

---

## 🛠️ npm Scripts

### Server (`/server`)
```bash
npm run dev          # Start with nodemon (hot-reload)
npm run start        # Start production server
npm run seed         # Seed database with demo data
npm run seed:fresh   # Drop all + re-seed
```

### Client (`/client`)
```bash
npm run dev          # Vite dev server (port 5173)
npm run build        # Build for production → dist/
npm run preview      # Preview production build locally
```

---

## 🔌 API Base URL Configuration

- **Local dev:** Vite proxies `/api` → `http://localhost:5000` automatically (no `.env` change needed)
- **Production (EC2):** Set `VITE_API_BASE_URL=http://<EC2-IP>:5000/api` in `client/.env` before running `npm run build`
- Only the `.env` file needs to change — zero code changes needed between environments

---

*Built with ❤️ — MERN Stack · MongoDB Atlas · AWS EC2 · `screen`*
