# EventHub — Event Registration System

> CC Assignment 15 — Full-Stack MERN Application

A clean, modern Event Registration System that lets admins create and manage events, and users browse and register for them. Built with MongoDB Atlas, Express, React, and Node.js.

---

## 🗂️ Project Structure

```
Event-Registration-application/
├── client/        # React frontend (Vite + Tailwind CSS)
├── server/        # Node.js + Express backend
├── requirements.md
└── README.md
```

---

## ⚡ Quick Start (Local Development)

### Prerequisites
- Node.js v18+
- A MongoDB Atlas account (free M0 cluster)

---

### 1. Clone & Setup

```bash
git clone <your-repo-url>
cd Event-Registration-application
```

---

### 2. Backend Setup

```bash
cd server

# Copy env template and fill in your values
cp .env.template .env
```

Edit `server/.env`:
```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/event-registration?retryWrites=true&w=majority
PORT=5000
```

```bash
npm install
npm start
```

The API will be running at `http://localhost:5000`

#### Seed sample data (optional but recommended):
```bash
npm run seed
```
This seeds 5 sample events into your MongoDB Atlas database.

---

### 3. Frontend Setup

```bash
cd ../client

# Copy env template and fill in your values
cp .env.template .env
```

Edit `client/.env`:
```env
VITE_API_URL=http://localhost:5000
```

```bash
npm install
npm run dev
```

The app will be running at `http://localhost:5173`

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/events` | Get all events |
| GET | `/api/events/:id` | Get single event |
| POST | `/api/events` | Create event (admin) |
| PUT | `/api/events/:id` | Update event (admin) |
| DELETE | `/api/events/:id` | Delete event + registrations |
| GET | `/api/events/:id/registrations` | List registrations for event |
| POST | `/api/events/:id/register` | Register for event |
| DELETE | `/api/registrations/:regId` | Remove a registration (admin) |

---

## 🔑 Environment Variables

### `server/.env`

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/event-registration` |
| `PORT` | Port for the Express server | `5000` |

### `client/.env`

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000` (local) or your EC2 URL for production |

---

## ☁️ AWS Deployment Guide

### Backend — AWS EC2 (Ubuntu)

1. **Launch** an EC2 instance (Ubuntu 22.04, t2.micro free tier)
2. **Install Node.js**:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```
3. **Install PM2**:
   ```bash
   sudo npm install -g pm2
   ```
4. **Upload server code** via SCP or Git clone
5. **Set environment variables**:
   ```bash
   cp .env.template .env
   nano .env  # fill in MONGODB_URI and PORT
   ```
6. **Start the server**:
   ```bash
   npm install
   pm2 start index.js --name event-api
   pm2 startup  # enable auto-start on reboot
   ```
7. **Open port 5000** in EC2 Security Group (inbound rule: TCP 5000)

### Frontend — AWS Amplify (Easiest)

1. Push the `client/` folder to a GitHub repository
2. Go to **AWS Amplify Console** → New App → Host Web App
3. Connect your GitHub repo, select the `client/` folder as the root
4. **Set environment variable** in Amplify: `VITE_API_URL = http://<your-ec2-public-ip>:5000`
5. Deploy — Amplify handles the build (`npm run build`) and CDN distribution

### Alternative: Frontend on S3 + CloudFront

```bash
cd client
# Set the production API URL
echo "VITE_API_URL=http://<your-ec2-ip>:5000" > .env

npm run build
# Upload dist/ to your S3 bucket
aws s3 sync dist/ s3://your-bucket-name --delete
```

### MongoDB — Atlas (Free M0)

1. Create account at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create a free M0 cluster
3. Add your EC2 IP to the IP Allowlist (or allow all: `0.0.0.0/0`)
4. Create a database user and copy the connection string into `MONGODB_URI`

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS v4, React Router v6 |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Mongoose ODM) |
| HTTP Client | Axios |
| Icons | Lucide React |

---

## 🧪 Features

- ✅ Browse all upcoming events with search/filter
- ✅ View full event details with live seat availability
- ✅ Register for events (name, email, phone)
- ✅ Confirmation page with unique `REG-YYYY-XXXXX` ID
- ✅ Duplicate email prevention (409 conflict)
- ✅ Capacity enforcement ("Seats Full" badge)
- ✅ Admin: Create, Edit, Delete events
- ✅ Admin: View all registrations per event
- ✅ Admin: Remove individual registrations
- ✅ Loading spinners, error handling, toast notifications
- ✅ Confirm modal before destructive actions
- ✅ Fully responsive design (mobile + desktop)
