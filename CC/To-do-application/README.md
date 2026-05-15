# MERN Stack To-Do Application

A modern, full-stack Task Management application built using MongoDB, Express.js, React (Vite), and Node.js. 

## Features
- **Frontend:** React, Vite, Tailwind CSS (shadcn-inspired UI), Zustand state management, and `lucide-react` icons.
- **Backend:** Node.js, Express, MongoDB with Mongoose.
- **Core Functionality:** Create, Read, Update, Delete tasks with completion statuses.
- **Dynamic Images:** Uses `picsum.photos` for placeholder task images without needing external blob storage like Cloudinary.
- **Deployment Ready:** Configured via environment variables to run easily on AWS EC2 or local environments.

---

## Folder Structure

```text
To-do-application/
├── client/          # Vite React application
│   ├── .env.template
│   └── src/
├── server/          # Node.js + Express backend
│   ├── .env.template
│   └── src/
└── README.md        # This file
```

---

## Local Development

### 1. Database Setup
You will need a MongoDB instance running locally or a MongoDB Atlas cluster.
If using Atlas, get your connection string (e.g., `mongodb+srv://...`).

### 2. Backend Setup
```bash
cd server
npm install
cp .env.template .env
```
Edit `server/.env` and insert your MongoDB connection string into `MONGODB_URI`.
```bash
# Seed the database with sample data
npm run seed

# Start the server in development mode
npm run dev
```
The server will run on `http://localhost:5000`.

### 3. Frontend Setup
```bash
cd client
npm install
cp .env.template .env
```
Ensure `VITE_API_BASE_URL=http://localhost:5000/api` in `client/.env`.
```bash
# Start the Vite development server
npm run dev
```
The client will run on `http://localhost:5173`.

---

## AWS EC2 Deployment Guide

This guide assumes you are deploying to a fresh Ubuntu server on AWS EC2.

### Step 1: Install Dependencies on EC2
SSH into your EC2 instance and install Node.js and Nginx:
```bash
sudo apt update
sudo apt install -y curl
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx git
```

### Step 2: Clone the Repository
```bash
git clone <your-repository-url>
cd To-do-application
```

### Step 3: Configure and Start the Backend
1. Navigate to the server folder:
   ```bash
   cd server
   npm install
   cp .env.template .env
   ```
2. Edit the `.env` file to include your **MongoDB Atlas** URI:
   ```bash
   nano .env
   ```
   Set `MONGODB_URI=mongodb+srv://<username>:<password>@cluster0...`
   Set `NODE_ENV=production`
   Set `CORS_ORIGIN=http://<your-ec2-public-ip>`
3. Install PM2 to keep the app running in the background:
   ```bash
   sudo npm install -g pm2
   pm2 start src/server.js --name "todo-backend"
   pm2 save
   pm2 startup
   ```

### Step 4: Build the Frontend
1. Navigate to the client folder:
   ```bash
   cd ../client
   npm install
   cp .env.template .env
   ```
2. Edit the client `.env` to point to the backend API:
   ```bash
   nano .env
   ```
   Set `VITE_API_BASE_URL=http://<your-ec2-public-ip>/api`
3. Build the static files:
   ```bash
   npm run build
   ```

### Step 5: Configure Nginx
Nginx will serve the built React files and reverse-proxy `/api` to the Node.js backend.

1. Open the default Nginx configuration:
   ```bash
   sudo nano /etc/nginx/sites-available/default
   ```
2. Replace the contents with the following:
   ```nginx
   server {
       listen 80 default_server;
       listen [::]:80 default_server;
       
       # Serve the React frontend
       root /home/ubuntu/To-do-application/client/dist;
       index index.html index.htm index.nginx-debian.html;

       server_name _;

       location / {
           try_files $uri $uri/ /index.html;
       }

       # Reverse proxy API requests to Node.js backend
       location /api {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
   *(Note: Adjust the `root` path if your username isn't `ubuntu` or the folder is located elsewhere).*

3. Test and restart Nginx:
   ```bash
   sudo nginx -t
   sudo systemctl restart nginx
   ```

### Step 6: Set Directory Permissions
Ensure Nginx has permission to read the built `dist` folder:
```bash
sudo chmod -R 755 /home/ubuntu
```

You can now access your application using your EC2 instance's Public IP address in your browser!
