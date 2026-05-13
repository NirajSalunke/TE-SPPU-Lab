# MERN Task Management App

A simple, modern, and responsive Task Management web application built with the MERN stack (MongoDB, Express, React, Node.js) and Tailwind CSS.

## Features

- **CRUD Operations**: Create, read, update, and delete tasks.
- **Task Attributes**: Title, description, status (Pending, In Progress, Completed), priority (Low, Medium, High), and due date.
- **Filtering & Sorting**: Filter tasks by status and sort them by date or priority.
- **Modern UI**: Clean and responsive design using Tailwind CSS with a built-in dark mode supporting a cohesive color palette.

## Project Structure

- `client/`: React frontend (Vite)
- `server/`: Node.js + Express backend

## Prerequisites

- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB instance)

## Local Setup

### 1. Backend Setup

1. Navigate to the `server/` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file from the template:
   ```bash
   cp .env.template .env
   ```
4. Update the `.env` file with your MongoDB connection string (`MONGO_URI`).
5. Start the backend server:
   ```bash
   node server.js
   ```
   The API will run on `http://localhost:5000`.

### 2. Frontend Setup

1. Open a new terminal and navigate to the `client/` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file from the template:
   ```bash
   cp .env.template .env
   ```
4. Ensure `VITE_API_URL` points to your running backend (default is `http://localhost:5000/api`).
5. Start the frontend development server:
   ```bash
   npm run dev
   ```

## Deployment to AWS

### Backend Deployment (AWS EC2 / Elastic Beanstalk)
1. Set up an EC2 instance or Elastic Beanstalk environment running Node.js.
2. Clone this repository to the server.
3. Run `npm install` inside the `server/` directory.
4. Set the `MONGO_URI` environment variable in the AWS console to your MongoDB Atlas cluster URI.
5. Use `pm2` or a similar process manager to run `node server.js` to keep the backend running.

### Frontend Deployment (AWS S3 + CloudFront or Amplify)
1. Run `npm run build` inside the `client/` directory.
2. If using S3:
   - Create an S3 bucket configured for static website hosting.
   - Upload the contents of `client/dist` to the bucket.
   - (Optional) Set up CloudFront for CDN and HTTPS support.
3. If using AWS Amplify:
   - Connect the repository to AWS Amplify.
   - Set the build settings to run `npm run build` in the `client/` directory.
   - Add the required environment variables (`VITE_API_URL` pointing to your deployed backend API URL).

## License
MIT
