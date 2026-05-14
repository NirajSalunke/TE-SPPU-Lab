# 🚀 Deploy TechStore E-Commerce App on AWS EC2 (Using Screen)

> **Stack:** MERN (MongoDB Atlas + Express + React/Vite + Node.js)
> **Goal:** Get the app publicly accessible via EC2 Public IP
> **Process Manager:** GNU Screen (simpler than PM2!)

---

## 📋 Prerequisites

- AWS account (Free Tier works!)
- MongoDB Atlas account (free cluster) — [https://cloud.mongodb.com](https://cloud.mongodb.com)
- Your GitHub repo: `https://github.com/NirajSalunke/TE-SPPU-Lab`

---

## STEP 1 — Launch EC2 Instance

1. Go to **AWS Console → EC2 → Launch Instance**
2. Fill in:
   - **Name:** `ecommerce-app`
   - **AMI:** `Ubuntu Server 22.04 LTS` (Free Tier eligible)
   - **Instance type:** `t2.micro` (Free Tier)
   - **Key pair:** Create new → name it `ecommerce-key` → Download the `.pem` file
3. Under **Network Settings → Security Group**, click **Edit** and add these rules:

   | Type        | Protocol | Port  | Source    |
   |-------------|----------|-------|-----------|
   | SSH         | TCP      | 22    | 0.0.0.0/0 |
   | HTTP        | TCP      | 80    | 0.0.0.0/0 |
   | Custom TCP  | TCP      | 5000  | 0.0.0.0/0 |
   | Custom TCP  | TCP      | 4173  | 0.0.0.0/0 |

4. Click **Launch Instance** ✅

---

## STEP 2 — Connect to EC2 via SSH

> On your local machine (Linux/Mac terminal or Windows Git Bash):

```bash
chmod 400 ecommerce-key.pem
ssh -i "ecommerce-key.pem" ubuntu@<YOUR_EC2_PUBLIC_IP>
```

> 💡 Find your Public IP in EC2 Dashboard → Instances → Public IPv4 address

---

## STEP 3 — Install Node.js, Git & Screen

Run these commands one by one after SSH-ing in:

```bash
sudo apt update && sudo apt upgrade -y

# Install Node.js 20 (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git screen

# Verify
node -v
npm -v
git --version
screen --version
```

---

## STEP 4 — Clone the Repository

```bash
cd ~
git clone https://github.com/NirajSalunke/TE-SPPU-Lab.git
cd TE-SPPU-Lab/CC/e-commerce-application
```

---

## STEP 5 — Setup MongoDB Atlas (Get Connection String)

1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com) → your cluster
2. Click **Connect → Drivers → Node.js**
3. Copy the connection string — looks like:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority
   ```
4. In **Network Access**, add `0.0.0.0/0` to allow EC2 connections (for education purpose)

---

## STEP 6 — Setup & Run Backend in Screen

```bash
cd ~/TE-SPPU-Lab/CC/e-commerce-application/backend
npm install

# Create the .env file
cat > .env << 'EOF'
MONGO_URI=your_mongodb_connection_string_here
PORT=5000
EOF
```

> ✏️ **Replace** `your_mongodb_connection_string_here` with your actual Atlas URI

**Seed the database with dummy products:**

```bash
node seed.js
```

**Start backend in a screen session:**

```bash
screen -S backend
node server.js
```

> You'll see the server running. Press **Ctrl+A** then **D** to detach (keeps it running in background).

---

## STEP 7 — Build & Run Frontend in Another Screen

The frontend needs to know where the backend API is. We'll use the EC2 Public IP.

```bash
cd ~/TE-SPPU-Lab/CC/e-commerce-application/frontend
npm install
```

**Create a `.env` file for the frontend API URL:**

```bash
cat > .env << 'EOF'
VITE_API_URL=http://<YOUR_EC2_PUBLIC_IP>:5000
EOF
```

> ✏️ **Replace** `<YOUR_EC2_PUBLIC_IP>` with your actual EC2 IP (e.g., `http://13.235.10.50:5000`)

**Build the React app:**

```bash
npm run build
```

**Install serve globally:**

```bash
sudo npm install -g serve
```

**Start frontend in another screen session:**

```bash
screen -S frontend
serve -s dist -l 4173
```

> Again, press **Ctrl+A** then **D** to detach.

---

## STEP 8 — Access Your App 🎉

Open your browser and go to:

```
http://<YOUR_EC2_PUBLIC_IP>:4173
```

- **Frontend (Shop):** `http://<EC2_IP>:4173`
- **Backend API:** `http://<EC2_IP>:5000`
- **Admin Panel:** `http://<EC2_IP>:4173/admin` — Login: `admin` / `admin`

---

## STEP 9 — Useful Screen Commands

### List all screen sessions
```bash
screen -ls
```

### Reattach to backend (view logs)
```bash
screen -r backend
```
> Press **Ctrl+A** then **D** to detach again

### Reattach to frontend
```bash
screen -r frontend
```

### Kill a screen session (stop the app)
```bash
screen -S backend -X quit    # Stop backend
screen -S frontend -X quit   # Stop frontend
```

### If you get "There is a screen on..." error
```bash
screen -d backend   # Force detach
screen -r backend   # Then reattach
```

---

## ⚠️ If Frontend Can't Talk to Backend

Make sure your React code uses the correct API base URL. If it's hardcoded to `localhost:5000`, search in `/frontend/src` for `localhost` and replace with your EC2 IP:

```bash
grep -r "localhost" ~/TE-SPPU-Lab/CC/e-commerce-application/frontend/src/
```

Then update, rebuild and restart:

```bash
cd ~/TE-SPPU-Lab/CC/e-commerce-application/frontend
npm run build

# Kill old frontend screen and restart
screen -S frontend -X quit
screen -S frontend
serve -s dist -l 4173
# Press Ctrl+A then D to detach
```

---

## 🧹 To Stop / Terminate (When Done)

**Stop both apps:**
```bash
screen -S backend -X quit
screen -S frontend -X quit
```

**Verify they're stopped:**
```bash
screen -ls
```

**Terminate EC2 to avoid charges:**
- AWS Console → EC2 → Instances → Select instance → Instance State → **Terminate**

---

## 📌 Summary

| What              | Command / URL                          |
|-------------------|----------------------------------------|
| Frontend          | `http://<EC2_IP>:4173`                 |
| Backend API       | `http://<EC2_IP>:5000`                 |
| Admin Panel       | `http://<EC2_IP>:4173/admin`           |
| Admin Login       | `admin` / `admin`                      |
| SSH into EC2      | `ssh -i ecommerce-key.pem ubuntu@<IP>` |
| List screens      | `screen -ls`                           |
| Attach to backend | `screen -r backend`                    |
| Detach from screen| **Ctrl+A** then **D**                  |
| Kill screen       | `screen -S <name> -X quit`             |

---

## 🎯 Quick Cheat Sheet

| Action | Command |
|--------|---------|
| Create screen session | `screen -S session-name` |
| Detach (keep running) | **Ctrl+A** then **D** |
| List all sessions | `screen -ls` |
| Reattach | `screen -r session-name` |
| Kill session | `screen -S session-name -X quit` |
| Force detach | `screen -d session-name` |

---

> 📚 This is for **educational/assignment purposes** (SPPU CC Lab). For production, use proper process managers (PM2/systemd), HTTPS, env secrets, and restrict security groups.
