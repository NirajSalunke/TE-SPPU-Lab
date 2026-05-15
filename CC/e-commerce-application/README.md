# ShopHub — MERN E-Commerce Application

A full-stack, production-ready e-commerce application built with the MERN stack.

**Features:** Product catalog · Shopping cart · Checkout flow · Order history · Admin dashboard · JWT Auth

---

## 🗂️ Project Structure

```
e-commerce-application/
├── client/          # React + Vite + Tailwind CSS frontend
├── server/          # Node.js + Express + MongoDB backend
├── ecosystem.config.js  # PM2 config for EC2
├── nginx.conf           # Nginx config for EC2
└── README.md
```

---

## ⚡ Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- MongoDB Atlas account

### 1. Clone & Setup Environment

**Server:**
```bash
cd server
cp .env.template .env
# Edit .env with your MongoDB URI and JWT secret
npm install
```

**Client:**
```bash
cd client
cp .env.template .env
# .env already has VITE_API_BASE_URL=http://localhost:5000/api
npm install
```

### 2. Seed Database
```bash
cd server
npm run seed
```
This creates **20 products** and a default admin user:
- **Admin:** `admin@shop.com` / `admin123`

### 3. Run Development Servers

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
# Runs on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
# Runs on http://localhost:5173
```

---

## 🚀 AWS EC2 Deployment Guide

### EC2 Setup (Amazon Linux 2 / Ubuntu)

#### Step 1 — Launch EC2 Instance
- AMI: Amazon Linux 2023 or Ubuntu 22.04
- Instance type: `t2.micro` (free tier) or `t3.small`
- Security Group — open inbound ports:
  - **22** (SSH)
  - **80** (HTTP)
  - **443** (HTTPS — optional)
- Create or use an existing Key Pair

#### Step 2 — Connect to EC2
```bash
ssh -i your-key.pem ec2-user@YOUR_EC2_PUBLIC_IP
```

#### Step 3 — Install Node.js 18
```bash
# Amazon Linux 2023
sudo dnf install -y nodejs npm

# Ubuntu
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Verify: `node -v && npm -v`

#### Step 4 — Install Nginx
```bash
# Amazon Linux 2023
sudo dnf install -y nginx

# Ubuntu
sudo apt-get install -y nginx
```

#### Step 5 — Install PM2
```bash
sudo npm install -g pm2
```

#### Step 6 — Upload Project to EC2

**Option A — Git (recommended):**
```bash
cd /home/ec2-user
git clone https://github.com/YOUR_USERNAME/e-commerce-application.git
```

**Option B — SCP from local:**
```bash
scp -i your-key.pem -r ./e-commerce-application ec2-user@YOUR_EC2_IP:/home/ec2-user/
```

#### Step 7 — Setup Server Environment
```bash
cd /home/ec2-user/e-commerce-application/server
cp .env.template .env
nano .env
```

Fill in your `.env`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority
JWT_SECRET=use_a_long_random_secret_here_minimum_32_chars
JWT_EXPIRES_IN=7d
CLIENT_URL=http://YOUR_EC2_PUBLIC_IP
NODE_ENV=production
```

Install dependencies & seed:
```bash
npm install --production
npm run seed
```

#### Step 8 — Build React Frontend
```bash
cd /home/ec2-user/e-commerce-application/client
cp .env.template .env
```

Edit `client/.env`:
```env
VITE_API_BASE_URL=http://YOUR_EC2_PUBLIC_IP/api
```

Build:
```bash
npm install
npm run build
# Output: client/dist/
```

#### Step 9 — Configure Nginx
```bash
sudo cp /home/ec2-user/e-commerce-application/nginx.conf /etc/nginx/conf.d/shophub.conf

# Edit the file to replace YOUR_EC2_PUBLIC_IP_OR_DOMAIN
sudo nano /etc/nginx/conf.d/shophub.conf

# Test config
sudo nginx -t

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

#### Step 10 — Start Backend with PM2
```bash
cd /home/ec2-user/e-commerce-application
pm2 start ecosystem.config.js
pm2 save
pm2 startup   # Follow the printed command to enable auto-start
```

#### Step 11 — Verify Deployment
- Open `http://YOUR_EC2_PUBLIC_IP` in browser ✅
- API health check: `http://YOUR_EC2_PUBLIC_IP/api/health` ✅

---

## 🔄 Updating the App on EC2

```bash
# Pull latest code
cd /home/ec2-user/e-commerce-application
git pull

# Rebuild frontend
cd client
npm run build

# Restart backend
pm2 restart shophub-server

# Reload nginx (if config changed)
sudo systemctl reload nginx
```

---

## 🌐 API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | — | Register user |
| POST | `/api/auth/login` | — | Login |
| POST | `/api/auth/logout` | — | Logout |
| GET | `/api/auth/me` | ✅ | Get current user |
| GET | `/api/products` | — | List products (filter/search/sort) |
| GET | `/api/products/:id` | — | Product detail |
| POST | `/api/products` | Admin | Create product |
| PUT | `/api/products/:id` | Admin | Update product |
| DELETE | `/api/products/:id` | Admin | Delete product |
| GET | `/api/cart` | ✅ | Get cart |
| POST | `/api/cart/add` | ✅ | Add to cart |
| PUT | `/api/cart/update` | ✅ | Update quantity |
| DELETE | `/api/cart/remove/:productId` | ✅ | Remove item |
| DELETE | `/api/cart/clear` | ✅ | Clear cart |
| POST | `/api/orders` | ✅ | Place order |
| GET | `/api/orders/my-orders` | ✅ | My orders |
| GET | `/api/orders/:id` | ✅ | Order detail |
| GET | `/api/orders` | Admin | All orders |
| PUT | `/api/orders/:id/status` | Admin | Update status |

---

## 🔑 Default Credentials

After running `npm run seed`:

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@shop.com` | `admin123` |

---

## 🔧 Environment Variables

### Server (`server/.env`)
| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://...` |
| `JWT_SECRET` | JWT signing secret (min 32 chars) | `your_secret_key` |
| `JWT_EXPIRES_IN` | Token expiry | `7d` |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:5173` |
| `NODE_ENV` | Environment | `production` |

### Client (`client/.env`)
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:5000/api` |

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Zustand, React Router v6, Axios |
| Backend | Node.js, Express.js, Mongoose, JWT |
| Database | MongoDB Atlas |
| Deployment | AWS EC2, Nginx, PM2 |
