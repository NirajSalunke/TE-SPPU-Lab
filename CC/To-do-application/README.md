# Full-Stack MERN To-Do List Application

A modern, responsive To-Do List application built with MongoDB, Express, React, Node.js, and Tailwind CSS. It features a clean UI, task categorization, priority setting, due dates, and seamless API integration.

## Features

- **CRUD Operations**: Create, Read, Update, and Delete tasks.
- **Task Status & Filters**: Mark tasks as completed and easily filter by All, Active, and Completed.
- **Task Details**: Support for descriptions, priorities (Low, Medium, High), and due dates.
- **Modern UI**: Polished, responsive design utilizing Tailwind CSS and Lucide Icons.
- **Environment Driven**: Backend and Frontend URLs are configured via `.env` variables for easy deployment.

## Project Structure

```
To-do-application/
│
├── client/          # React + Vite frontend
│   ├── .env.template
│   ├── src/         # React components, styles, and utils
│   └── package.json
│
├── server/          # Node.js + Express backend
│   ├── .env.template
│   ├── models/      # Mongoose models
│   ├── routes/      # API endpoints
│   ├── server.js    # Entry point
│   └── package.json
│
└── README.md        # This documentation
```

---

## Local Development Setup

### 1. Backend Setup (`/server`)

1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the environment template:
   ```bash
   cp .env.template .env
   ```
4. **Configure `.env`**: Open `.env` and set your MongoDB Atlas connection string (`MONGO_URI`). You can obtain one by creating a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
5. Start the backend development server:
   ```bash
   node server.js
   ```
   *The server will run on `http://localhost:5000`.*

### 2. Frontend Setup (`/client`)

1. Navigate to the client directory (open a new terminal tab):
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the environment template:
   ```bash
   cp .env.template .env
   ```
4. **Configure `.env`**: Open `.env` and ensure `VITE_API_URL` points to your backend URL (default is `http://localhost:5000/api/todos`).
5. Start the frontend development server:
   ```bash
   npm run dev
   ```
   *The app will be available at `http://localhost:5173`.*

---

## AWS Deployment Guide

Deploying this MERN stack to AWS involves hosting the frontend on a static hosting service and the backend on a compute service. 

### Prerequisites
- An AWS Account.
- MongoDB Atlas cluster set up and IP access configured (allow `0.0.0.0/0` or the specific IP of your AWS server).

### Deploying the Backend (EC2)

1. Launch an EC2 instance (Ubuntu Server 24.04 LTS is recommended).
2. Connect to the instance via SSH.
3. Install Node.js and NPM:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```
4. Clone your repository or upload the `server` folder.
5. Navigate to the `server` directory and run `npm install`.
6. Create a `.env` file with your production `MONGO_URI` and `PORT` (e.g., `80`).
7. Use **PM2** to run the app in the background:
   ```bash
   sudo npm install -g pm2
   sudo pm2 start server.js --name "todo-backend"
   ```
8. Ensure the EC2 Security Group allows inbound traffic on the port you specified (e.g., HTTP port 80).
9. Note the **Public IPv4 address or DNS** of your EC2 instance. This is your API URL.

### Deploying the Frontend (AWS Amplify or S3/CloudFront)

**Option A: AWS Amplify (Easiest)**
1. Go to the AWS Amplify Console.
2. Connect your GitHub repository containing the project.
3. Select the `client` directory as your application root.
4. Amplify will automatically detect the Vite build settings. 
5. Under Advanced Settings, add an Environment Variable:
   - Key: `VITE_API_URL`
   - Value: `http://<YOUR_EC2_PUBLIC_IP>/api/todos`
6. Click Save and Deploy. Amplify will build and host your frontend globally.

**Option B: S3 + CloudFront**
1. In your local `client` folder, update the `.env` file with your EC2 API URL.
2. Build the production application:
   ```bash
   npm run build
   ```
3. Create an S3 Bucket in AWS (e.g., `my-todo-app`). Disable "Block all public access".
4. Enable Static Website Hosting in the bucket properties.
5. Upload the contents of the `client/dist` folder to your S3 bucket.
6. Create an AWS CloudFront distribution pointing to your S3 bucket to provide HTTPS and global caching.

---
*Built as a functional and modern application assignment.*
