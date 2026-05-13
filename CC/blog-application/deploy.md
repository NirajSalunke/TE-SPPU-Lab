# CC Assignment #9 — Online Blog Application Deployment

**LP-II 2025-26 | Problem Statement #9**
**Repo Used:** [OkenHaha/react-blog](https://github.com/OkenHaha/react-blog)
**Stack:** MongoDB · Express.js · React (Vite) · Node.js (MERN)

***

## Assignment Objective

Deploy a full-stack blog application (frontend, backend, and database) on a cloud platform. Configure the server environment so that users can create, view, and manage blog posts through a web interface.

***

## Architecture Overview

```
Internet
   │
   ▼
[Cloud VM — Public IP]
   │
   ├── Nginx (Port 80)
   │     ├── /          → serves React build (static files)
   │     └── /api/      → reverse proxy → localhost:8080 (Node.js)
   │
   ├── Node.js / Express (Port 8080)  ← back-end/
   │
   └── MongoDB (Port 27017)           ← local or Atlas
```

**Folder structure of the repo:**
```
react-blog/
├── front-end/       # React + Vite + TailwindCSS
└── back-end/        # Express.js + MongoDB + JWT Auth
```

***

## Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 18.x LTS | Run frontend & backend |
| npm | 9.x+ | Package manager |
| MongoDB | 6.x or Atlas | Database |
| Nginx | latest | Web server + reverse proxy |
| Git | latest | Clone repository |
| PM2 | latest | Keep Node.js running |

***

## Part 1 — Local Testing (Do This First)

Before deploying on the cloud, verify the app runs locally.

### Step 1 — Clone the repository

```bash
git clone https://github.com/OkenHaha/react-blog.git
cd react-blog
```

### Step 2 — Install backend dependencies

```bash
cd back-end
npm install
```

### Step 3 — Create backend `.env` file

```bash
# Inside back-end/ directory
nano .env
```

Paste the following (replace values as needed):

```env
CONNECTION_URL="mongodb://localhost:27017/reactblog"
PORT=8080
JWT_SECRET="your-strong-jwt-secret-key"
SECRET_KEY="your-strong-secret-key"
MAIL_HOST="smtp.gmail.com"
MAIL_USER="your-email@gmail.com"
MAIL_PASS="your-gmail-app-password"
```

> **Note on MAIL_PASS:** Use a Gmail App Password (not your real password).
> Go to: Google Account → Security → 2-Step Verification → App Passwords → Generate one for "Mail".

### Step 4 — Install frontend dependencies

```bash
cd ../front-end
npm install
```

### Step 5 — Set the backend URL in frontend

```bash
# Navigate to: front-end/src/components/
nano src/components/baselink.js
```

Change the backend URL to:

```js
const baselink = "http://localhost:8080";
export default baselink;
```

### Step 6 — Start both servers locally

Open **two terminals**:

**Terminal 1 — Backend:**
```bash
cd react-blog/back-end
npm run dev
# Should say: Server running on port 8080
```

**Terminal 2 — Frontend:**
```bash
cd react-blog/front-end
npm run dev
# Should say: Local: http://127.0.0.1:5173/
```

### Step 7 — Verify locally

Open browser: `http://127.0.0.1:5173/`

Test:
- Register a new user
- Login
- Create a blog post
- Edit / delete a post

If everything works locally → proceed to cloud deployment.

***

## Part 2 — Cloud VM Setup (GCP / AWS / Oracle)

### Step 1 — Create a Cloud VM

**On GCP (Recommended — Free Tier eligible):**
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. **Compute Engine → VM Instances → Create Instance**
3. Settings:
   - **Name:** `blog-server`
   - **Region:** `asia-south1` (Mumbai) — closest to Pune
   - **Machine type:** `e2-micro` (free tier)
   - **Boot disk:** Ubuntu 22.04 LTS, 20 GB
   - **Firewall:** check Allow HTTP traffic, check Allow HTTPS traffic
4. Click **Create**
5. Note the **External IP** shown after creation

**On AWS EC2:**
1. Launch Instance → Ubuntu 22.04 LTS → t2.micro (free tier)
2. Security Group: Allow ports 22 (SSH), 80 (HTTP), 443 (HTTPS), 8080
3. Download `.pem` key file
4. Note the **Public IPv4 address**

**On Oracle Cloud (Always Free):**
1. Compute → Instances → Create Instance
2. Image: Ubuntu 22.04, Shape: VM.Standard.A1.Flex (Always Free)
3. Add SSH key, note Public IP

***

### Step 2 — SSH into the VM

**GCP (using browser SSH button, or terminal):**
```bash
# From GCP Console: VM Instances → SSH button (easiest for exam)
# OR from local terminal:
gcloud compute ssh blog-server --zone=asia-south1-a
```

**AWS:**
```bash
chmod 400 your-key.pem
ssh -i your-key.pem ubuntu@<PUBLIC_IP>
```

**Oracle Cloud:**
```bash
ssh -i your-key.pem ubuntu@<PUBLIC_IP>
```

***

### Step 3 — Update VM and install all dependencies

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x LTS
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify
node -v    # Should print v18.x.x
npm -v     # Should print 9.x.x

# Install MongoDB 6.x
curl -fsSL https://www.mongodb.org/static/pgp/server-6.0.asc | \
  sudo gpg -o /usr/share/keyrings/mongodb-server-6.0.gpg --dearmor

echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-6.0.gpg ] \
https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | \
  sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

sudo apt update
sudo apt install -y mongodb-org

# Start and enable MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Verify MongoDB is running
sudo systemctl status mongod

# Install Nginx
sudo apt install -y nginx

# Install PM2 (process manager — keeps Node.js alive)
sudo npm install -g pm2

# Install Git (usually pre-installed)
sudo apt install -y git
```

***

### Step 4 — Clone the repository on the VM

```bash
cd ~
git clone https://github.com/OkenHaha/react-blog.git
cd react-blog
```

***

### Step 5 — Setup and configure the backend

```bash
cd ~/react-blog/back-end
npm install

# Create the .env file
nano .env
```

Paste and fill in your values:

```env
CONNECTION_URL="mongodb://localhost:27017/reactblog"
PORT=8080
JWT_SECRET="replace-with-a-strong-random-string"
SECRET_KEY="replace-with-another-strong-string"
MAIL_HOST="smtp.gmail.com"
MAIL_USER="your-email@gmail.com"
MAIL_PASS="your-gmail-app-password"
```

Save and exit: `Ctrl+O` then `Enter` then `Ctrl+X`

***

### Step 6 — Build the frontend

```bash
cd ~/react-blog/front-end
npm install
```

Update `baselink.js` to point to your VM's **public IP**:

```bash
nano src/components/baselink.js
```

Change it to:

```js
const baselink = "http://<YOUR_VM_PUBLIC_IP>/api";
export default baselink;
```

> Replace `<YOUR_VM_PUBLIC_IP>` with the actual IP, e.g., `http://34.93.120.45/api`

Build the React app for production:

```bash
npm run build
# This creates a dist/ folder with optimized static files
```

***

### Step 7 — Configure Nginx

Nginx will:
- Serve the React `dist/` build on port 80
- Forward all `/api` requests to Node.js backend on port 8080

```bash
# Remove default Nginx config
sudo rm /etc/nginx/sites-enabled/default

# Create new config
sudo nano /etc/nginx/sites-available/react-blog
```

Paste the following (replace YOUR_VM_PUBLIC_IP):

```nginx
server {
    listen 80;
    server_name <YOUR_VM_PUBLIC_IP>;

    # Serve React frontend (built static files)
    root /home/ubuntu/react-blog/front-end/dist;
    index index.html;

    # For React Router — serve index.html for all routes
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API calls to Node.js backend
    location /api/ {
        proxy_pass http://localhost:8080/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/react-blog /etc/nginx/sites-enabled/

# Test Nginx config for syntax errors
sudo nginx -t
# Expected output: syntax is ok / test is successful

# Reload Nginx
sudo systemctl reload nginx
sudo systemctl enable nginx
```

***

### Step 8 — Start the backend with PM2

```bash
cd ~/react-blog/back-end

# Start backend using PM2
pm2 start npm --name "blog-backend" -- run start

# If the above fails, try directly:
# pm2 start index.js --name "blog-backend"

# Save PM2 config so it restarts on VM reboot
pm2 save
pm2 startup
# IMPORTANT: Copy and run the command that pm2 startup outputs
```

Check backend is running:
```bash
pm2 status
pm2 logs blog-backend
```

***

### Step 9 — Open firewall ports on the cloud

**GCP:**
1. GCP Console → VPC Network → Firewall → Create Firewall Rule
2. Name: `allow-http`
3. Targets: All instances in the network
4. Source IP ranges: `0.0.0.0/0`
5. Protocols and ports: TCP → `80, 8080`
6. Click Create

> Port 80 should already be open if you checked "Allow HTTP" during VM creation.

**AWS:**
- EC2 → Security Groups → Inbound Rules → Edit
- Add: HTTP (80) Source `0.0.0.0/0`
- Add: Custom TCP (8080) Source `0.0.0.0/0`

**Oracle Cloud:**
- Networking → VCN → Security Lists → Add Ingress Rules
- Port 80, TCP, Source `0.0.0.0/0`
- Port 8080, TCP, Source `0.0.0.0/0`

***

### Step 10 — Verify the deployment

Open in your browser:
```
http://<YOUR_VM_PUBLIC_IP>
```

Test the following:
- [ ] Homepage loads with blog list
- [ ] User registration works
- [ ] User login works
- [ ] Create a new blog post
- [ ] Edit a blog post
- [ ] Delete a blog post
- [ ] Search / filter blogs

***

## Part 3 — Remote Update Workflow

After the initial deploy, update the app remotely via SSH (this satisfies the "can be updated remotely" requirement):

```bash
# SSH into the VM
ssh ubuntu@<YOUR_VM_PUBLIC_IP>

# Pull latest changes from GitHub
cd ~/react-blog
git pull origin main

# Rebuild frontend if any frontend changes
cd front-end
npm install
npm run build

# Restart backend to pick up backend changes
pm2 restart blog-backend

# Reload Nginx if config changed
sudo systemctl reload nginx

# Verify everything is still up
pm2 status
sudo systemctl status nginx
sudo systemctl status mongod
```

***

## Part 4 — Verify All Services

```bash
# Check all services status
sudo systemctl status nginx        # Should say: active (running)
sudo systemctl status mongod       # Should say: active (running)
pm2 status                         # blog-backend should say: online

# Check what's listening on ports
sudo ss -tlnp | grep -E '80|8080|27017'

# Quick API health test from inside VM
curl http://localhost:8080/

# Test the full site from VM
curl http://localhost/
```

***

## Common Errors and Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `502 Bad Gateway` | Backend not running | `pm2 restart blog-backend` |
| `Cannot connect to MongoDB` | mongod stopped | `sudo systemctl start mongod` |
| CORS error in browser console | Wrong baselink URL | Update `baselink.js` to use `/api`, rebuild frontend |
| Port 80 connection refused | Nginx not running / firewall | `sudo systemctl start nginx`, check firewall rules |
| White screen on frontend | Wrong API URL in baselink.js | Set to `http://<IP>/api`, rebuild with `npm run build` |
| App stops after VM reboot | PM2 startup not configured | Run `pm2 startup`, copy-paste output command, `pm2 save` |
| `npm run build` fails | Node version too old | Verify `node -v` is 18.x |
| Git pull shows conflicts | Local changes conflict | `git stash` then `git pull` |

***

## Quick Reference — All Key Commands

```bash
# === INITIAL SETUP ===
git clone https://github.com/OkenHaha/react-blog.git
cd react-blog/back-end && npm install
cd ../front-end && npm install && npm run build

# === START SERVICES ===
sudo systemctl start mongod
sudo systemctl start nginx
pm2 start npm --name "blog-backend" -- run start

# === NGINX ===
sudo nginx -t                      # Test config
sudo systemctl reload nginx        # Apply config changes
sudo systemctl status nginx        # Check status

# === PM2 ===
pm2 status                         # See all processes
pm2 logs blog-backend              # View backend logs
pm2 restart blog-backend           # Restart backend
pm2 save                           # Save PM2 state
pm2 startup                        # Auto-start on reboot

# === MONGODB ===
sudo systemctl start mongod
sudo systemctl status mongod
mongosh                            # Open MongoDB shell

# === REMOTE UPDATE ===
git pull origin main
cd front-end && npm run build
pm2 restart blog-backend
```

***

## Assignment Checklist

Use this before your PR Exam / Viva:

- [ ] Cloud VM created (GCP / AWS / Oracle)
- [ ] Node.js 18.x installed on VM
- [ ] MongoDB installed and running (`systemctl status mongod`)
- [ ] Nginx installed and configured
- [ ] Repository cloned on VM
- [ ] Backend `.env` file created with correct values
- [ ] `baselink.js` updated with `http://<PUBLIC_IP>/api`
- [ ] React frontend built (`npm run build` → `dist/` folder created)
- [ ] Nginx config created and enabled in `sites-enabled`
- [ ] Nginx serving frontend on port 80
- [ ] Nginx proxying `/api` to Node.js on port 8080
- [ ] Backend running via PM2 (`pm2 status` shows `online`)
- [ ] PM2 startup configured (app survives reboot)
- [ ] Firewall ports 80 and 8080 open in cloud console
- [ ] Site accessible at `http://<PUBLIC_IP>` from any browser
- [ ] User registration and login working
- [ ] Blog post creation, edit, delete working
- [ ] Remote update via SSH tested (`git pull` + rebuild)

***

## Viva / PR Exam — Questions and Answers

**Q: What is a reverse proxy and why did you use Nginx?**
> Nginx acts as a reverse proxy — it receives all incoming requests on port 80. Requests to `/api` are forwarded internally to the Node.js server on port 8080. This avoids exposing Node.js directly to the internet, handles static file serving efficiently, and allows frontend and backend to appear on the same domain/IP.

**Q: What is PM2 and why is it needed?**
> PM2 (Process Manager 2) is a production process manager for Node.js. Without PM2, the Node.js backend stops the moment you close the SSH terminal. PM2 keeps the backend running as a background daemon and automatically restarts it if it crashes or if the VM reboots.

**Q: Where is data stored in this application?**
> Blog posts and user accounts are stored in MongoDB, running locally on the VM at port 27017. The database name is `reactblog`. Alternatively, MongoDB Atlas (cloud-hosted MongoDB) can be used by changing `CONNECTION_URL` in the `.env` file to an Atlas connection string.

**Q: What does `npm run build` do?**
> It compiles the React + Vite application into optimized, browser-ready static HTML, CSS, and JavaScript files inside the `dist/` folder. Nginx then serves these static files directly — no Node.js is involved in serving the frontend at runtime.

**Q: How do you update the application after deployment?**
> SSH into the VM, run `git pull origin main` to get the latest code, rebuild the frontend with `npm run build`, and restart the backend with `pm2 restart blog-backend`. No downtime for the database.

**Q: How is the website publicly accessible?**
> Port 80 is opened in the cloud's firewall (Security Group / Firewall Rule), and the Nginx config listens on port 80 with `server_name` set to the VM's public IP. Anyone on the internet can now visit `http://<PUBLIC_IP>` and reach the blog.

**Q: What is the role of JWT in this application?**
> JWT (JSON Web Token) is used for user authentication. When a user logs in, the backend generates a signed JWT using `JWT_SECRET` from `.env` and sends it to the frontend. The frontend stores it and includes it in the `Authorization` header of subsequent requests to protected API routes (create/edit/delete posts).

***

*LP-II CC Assignment #9 · SPPU TE Computer Science · 2025-26*