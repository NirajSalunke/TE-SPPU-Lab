import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './src/config/db.js';
import authRoutes from './src/routes/auth.routes.js';
import studentRoutes from './src/routes/student.routes.js';
import departmentRoutes from './src/routes/department.routes.js';
import courseRoutes from './src/routes/course.routes.js';
import enrolmentRoutes from './src/routes/enrolment.routes.js';
import attendanceRoutes from './src/routes/attendance.routes.js';
import dashboardRoutes from './src/routes/dashboard.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Connect DB
connectDB();

// Middleware
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrolments', enrolmentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// Serve React build in production (no Nginx needed — one process serves everything)
if (process.env.NODE_ENV === 'production') {
  const clientDist = path.join(__dirname, '..', 'client', 'dist');
  app.use(express.static(clientDist));
  // Catch-all for React Router client-side navigation
  app.get('*', (_req, res) => res.sendFile(path.join(clientDist, 'index.html')));
}

// Global error handler
app.use((err, _req, res, _next) => {
  console.error('❌', err.message);
  const status = err.status || 500;
  res.status(status).json({ success: false, message: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 SRMS server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
});
