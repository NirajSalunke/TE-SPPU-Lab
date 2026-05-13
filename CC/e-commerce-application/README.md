# TechStore E-Commerce Application

A full-stack e-commerce web application built for academic/assignment purposes. It features a responsive UI, product browsing, shopping cart, checkout flow, and an admin dashboard.

## Tech Stack
- **Frontend**: React, React Router, Tailwind CSS, Vite
- **Backend**: Node.js, Express
- **Database**: MongoDB (Mongoose)

## Project Structure
- `/frontend`: Contains the React application.
- `/backend`: Contains the Express server, Mongoose models, API routes, and a seed script.

## Setup and Run Instructions

### 1. Database Setup
You will need a MongoDB Atlas cluster (or a local MongoDB instance).
1. Create a `.env` file in the `backend` folder based on `.env.template`.
2. Add your MongoDB connection string:
   ```env
   MONGO_URI=your_mongodb_connection_string
   PORT=5000
   ```

### 2. Backend Setup
Navigate to the `backend` directory:
```bash
cd backend
npm install
```

**Seed Database:**
To populate the database with initial dummy products, run:
```bash
node seed.js
```

**Start the Server:**
```bash
node server.js
```
The backend API will run on `http://localhost:5000`.

### 3. Frontend Setup
Open a new terminal and navigate to the `frontend` directory:
```bash
cd frontend
npm install
```

**Start the Development Server:**
```bash
npm run dev
```
The frontend will typically run on `http://localhost:5173`. Open this URL in your browser.

## Features
- **Product Listing**: View a grid of products with a search filter.
- **Product Details**: View individual product details and add to cart.
- **Shopping Cart**: Manage cart items (stored locally in the browser).
- **Checkout**: A simple mock checkout form.
- **Admin Panel**: Accessible at `/admin`. Default credentials: `admin` / `admin`. View placed orders.

## Deployment Notes (AWS)
To deploy this application on AWS (e.g., using EC2):
1. Provision an EC2 instance (Ubuntu/Amazon Linux).
2. Install Node.js, npm, and Git.
3. Clone the repository and install dependencies for both frontend and backend.
4. Set up environment variables in the backend using `.env`.
5. Use a process manager like `pm2` to keep the backend running.
6. For the frontend, you can build it (`npm run build`) and serve the static `dist` folder using Nginx.
7. Configure security groups to allow traffic on port 80 (HTTP) and optionally 443 (HTTPS) for the web server, and port 5000 if directly accessing the API.
