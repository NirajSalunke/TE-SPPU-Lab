# Inkwell — MERN Blog Application

A modern, full-stack blog platform built with the MERN stack (MongoDB, Express, React, Node.js).

---

## Project Structure

```
blog-application/
├── client/          ← Vite + React frontend
├── server/          ← Node.js + Express backend
└── README.md
```

---

## Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS, Zustand   |
| Backend    | Node.js, Express.js                     |
| Database   | MongoDB + Mongoose                      |
| Auth       | JWT (admin login)                       |
| Icons      | Lucide React                            |

---

## Local Development Setup

### Prerequisites
- Node.js 18+
- MongoDB running locally or MongoDB Atlas URI

### 1. Clone / navigate to the project
```bash
cd blog-application
```

### 2. Set up the backend
```bash
cd server
cp .env.template .env
# Edit .env — set your MONGO_URI and change JWT_SECRET
npm install
```

### 3. Set up the frontend
```bash
cd ../client
cp .env.template .env
# VITE_API_BASE_URL=http://localhost:5000/api  (already set for local dev)
npm install
```

### 4. Seed the database (optional — for demo data)
```bash
cd server
npm run seed
# To reset and re-seed:
npm run seed:reset
```

### 5. Run in development

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
```

Open: http://localhost:5173

---

## Admin Access

| Field    | Value             |
|----------|-------------------|
| Email    | admin@blog.com    |
| Password | Admin@123         |
| URL      | /login            |

Change these in `server/.env` before deploying.

---

## Deploying to AWS EC2 (Simple — no Nginx, no PM2)

### Overview
The Express server serves both the **API** and the **built React frontend**.  
You only need ONE process running: `node server.js`  
Access is via `http://<EC2-IP>:5000`

---

### Step 1 — Launch EC2 Instance
1. Go to AWS Console → EC2 → Launch Instance
2. Choose **Ubuntu 22.04 LTS** (free tier eligible)
3. Instance type: **t2.micro** (free tier)
4. Key pair: Create or use existing `.pem` key
5. **Security Group** — Add these inbound rules:

| Type  | Protocol | Port | Source    |
|-------|----------|------|-----------|
| SSH   | TCP      | 22   | Your IP   |
| Custom TCP | TCP | 5000 | 0.0.0.0/0 |

6. Launch the instance

---

### Step 2 — SSH into EC2
```bash
chmod 400 your-key.pem
ssh -i your-key.pem ubuntu@<EC2-PUBLIC-IP>
```

---

### Step 3 — Install Node.js & Git
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git
node -v   # should show v20.x
```

---

### Step 4 — Upload your project

**Option A — Git (recommended)**
```bash
git clone https://github.com/YOUR_USERNAME/blog-application.git
cd blog-application
```

**Option B — SCP from your machine**
```bash
# Run this from your local machine:
scp -i your-key.pem -r blog-application ubuntu@<EC2-IP>:~/
```

---

### Step 5 — Install dependencies
```bash
cd ~/blog-application/server
npm install

cd ~/blog-application/client
npm install
```

---

### Step 6 — Create environment files

**Server .env:**
```bash
cd ~/blog-application/server
cp .env.template .env
nano .env
```
Set these values:
```env
PORT=5000
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/mern_blog
JWT_SECRET=change_this_to_a_long_random_string_in_production
CLIENT_URL=http://<EC2-PUBLIC-IP>:5000
NODE_ENV=production
ADMIN_EMAIL=admin@blog.com
ADMIN_PASSWORD=YourSecurePassword
ADMIN_NAME=Admin
```

**Client .env:**
```bash
cd ~/blog-application/client
cp .env.template .env
nano .env
```
Set:
```env
VITE_API_BASE_URL=http://<EC2-PUBLIC-IP>:5000/api
```

---

### Step 7 — Build the React frontend
```bash
cd ~/blog-application/client
npm run build
```
This creates `client/dist/` which Express will serve in production.

---

### Step 8 — Seed the database (optional)
```bash
cd ~/blog-application/server
npm run seed
```

---

### Step 9 — Start the server with Screen

```bash
# Install screen if not present
sudo apt install -y screen

# Start a named screen session
screen -S blog

# Inside the screen session:
cd ~/blog-application/server
NODE_ENV=production node server.js

# Detach from screen (keeps server running):
# Press Ctrl + A, then D
```

Your blog is now live at: **http://\<EC2-PUBLIC-IP\>:5000**

---

### Managing the Server

```bash
# List running screen sessions
screen -ls

# Re-attach to the blog session
screen -r blog

# Stop the server (from inside screen)
Ctrl + C

# Restart the server
NODE_ENV=production node server.js
```

---

### MongoDB Options

**Option A — MongoDB Atlas (recommended for EC2)**
1. Create free cluster at https://cloud.mongodb.com
2. Create a database user
3. Add EC2's public IP to the IP whitelist (or allow 0.0.0.0/0 for testing)
4. Copy the connection string to `MONGO_URI` in server `.env`

**Option B — Local MongoDB on EC2**
```bash
sudo apt install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
# Use: MONGO_URI=mongodb://127.0.0.1:27017/mern_blog
```

---

### Updating the App

```bash
# Pull latest changes (if using Git)
cd ~/blog-application
git pull

# Rebuild frontend
cd client && npm run build

# Restart server
screen -r blog
# Ctrl+C to stop, then:
NODE_ENV=production node server.js
# Ctrl+A, D to detach
```

---

## API Reference

### Public
| Method | Endpoint                     | Description          |
|--------|------------------------------|----------------------|
| GET    | /api/posts                   | List posts           |
| GET    | /api/posts/featured          | Featured posts       |
| GET    | /api/posts/search?q=         | Search posts         |
| GET    | /api/posts/:slug             | Get post by slug     |
| GET    | /api/posts/related/:slug     | Related posts        |
| GET    | /api/categories              | List categories      |
| GET    | /api/comments/post/:id       | Get post comments    |
| POST   | /api/comments/post/:id       | Add comment          |
| PATCH  | /api/posts/:id/like          | Like a post          |

### Admin (JWT required)
| Method | Endpoint                | Description          |
|--------|-------------------------|----------------------|
| POST   | /api/auth/login         | Admin login          |
| GET    | /api/auth/me            | Get current user     |
| POST   | /api/posts              | Create post          |
| PUT    | /api/posts/:id          | Update post          |
| DELETE | /api/posts/:id          | Delete post          |
| POST   | /api/categories         | Create category      |
| PUT    | /api/categories/:id     | Update category      |
| DELETE | /api/categories/:id     | Delete category      |
| DELETE | /api/comments/:id       | Delete comment       |

---

## Seed Scripts

```bash
# Populate demo data
npm run seed

# Clear all data and re-seed
npm run seed:reset
```

The seed script creates:
- 1 admin user
- 5 categories
- 8 blog posts with realistic content
- Comments on 3 posts

---

## Environment Variables

### server/.env.template
| Variable       | Description                          | Default              |
|----------------|--------------------------------------|----------------------|
| PORT           | Server port                          | 5000                 |
| MONGO_URI      | MongoDB connection string            | localhost/mern_blog  |
| JWT_SECRET     | Secret for signing JWT tokens        | —                    |
| CLIENT_URL     | Frontend URL (for CORS in dev)       | http://localhost:5173|
| NODE_ENV       | Environment                          | development          |
| ADMIN_EMAIL    | Default admin email                  | admin@blog.com       |
| ADMIN_PASSWORD | Default admin password               | Admin@123            |

### client/.env.template
| Variable           | Description          | Default                        |
|--------------------|----------------------|--------------------------------|
| VITE_API_BASE_URL  | Backend API base URL | http://localhost:5000/api      |
