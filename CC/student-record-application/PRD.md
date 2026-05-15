# 📚 Student Record Management System — Product Requirements Document

**Version:** 1.0  
**Stack:** MERN (MongoDB · Express · React · Node.js)  
**Date:** May 2026  

---

## 1. Project Overview

A full-stack **Student Record Management System (SRMS)** that allows administrators and faculty to create, view, update, and manage student academic records. The system covers student profiles, course enrolments, grades, attendance, and department management — all with a clean, modern UI. No payment gateway or third-party media storage (Cloudinary, S3, etc.) is used; avatar images are generated dynamically via a free avatar/placeholder API.

---

## 2. Goals & Non-Goals

### ✅ Goals
- Full CRUD for students, courses, departments, and faculty
- Student enrolment into courses and grade tracking
- Attendance recording per course per student
- Dashboard with summary statistics (charts)
- Role-based views: **Admin** and **Faculty**
- Seed scripts so the database is never empty on first run
- Configurable API base URL via environment variable on the frontend

### ❌ Non-Goals
- Payment processing of any kind
- Cloudinary / AWS S3 / any cloud media storage
- Student self-registration portal
- Mobile native app
- Email / SMS notification service

---

## 3. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router v6, Axios, Recharts, Tailwind CSS |
| Backend | Node.js 20, Express 5 |
| Database | MongoDB 7 (via Mongoose 8) |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Avatar Images | `https://api.dicebear.com/8.x/initials/svg?seed=<name>` (free, no account needed) |
| Environment Config | `dotenv` on backend · Vite `.env` (`VITE_API_BASE_URL`) on frontend |
| Dev Tooling | Nodemon, ESLint, Prettier, Concurrently |

---

## 4. Repository Structure

```
srms/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                  # Mongoose connection
│   │   ├── models/
│   │   │   ├── User.js                # Admin / Faculty accounts
│   │   │   ├── Student.js
│   │   │   ├── Department.js
│   │   │   ├── Course.js
│   │   │   ├── Enrolment.js           # Student ↔ Course join
│   │   │   └── Attendance.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── student.routes.js
│   │   │   ├── department.routes.js
│   │   │   ├── course.routes.js
│   │   │   ├── enrolment.routes.js
│   │   │   ├── attendance.routes.js
│   │   │   └── dashboard.routes.js
│   │   ├── controllers/               # One controller per route file
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js     # JWT verification
│   │   │   └── role.middleware.js     # Admin-only guard
│   │   └── utils/
│   │       └── avatarUrl.js           # Returns DiceBear URL from name
│   ├── seeds/
│   │   ├── index.js                   # Master seed runner
│   │   ├── users.seed.js
│   │   ├── departments.seed.js
│   │   ├── courses.seed.js
│   │   ├── students.seed.js
│   │   ├── enrolments.seed.js
│   │   └── attendance.seed.js
│   ├── .env.example
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── api/
    │   │   └── axios.js               # Axios instance using VITE_API_BASE_URL
    │   ├── assets/
    │   ├── components/
    │   │   ├── layout/
    │   │   │   ├── Sidebar.jsx
    │   │   │   ├── Topbar.jsx
    │   │   │   └── Layout.jsx
    │   │   ├── common/
    │   │   │   ├── DataTable.jsx
    │   │   │   ├── StatCard.jsx
    │   │   │   ├── Badge.jsx
    │   │   │   ├── Modal.jsx
    │   │   │   ├── ConfirmDialog.jsx
    │   │   │   └── AvatarImg.jsx      # Renders DiceBear avatar
    │   │   └── charts/
    │   │       ├── EnrolmentBarChart.jsx
    │   │       └── GradePieChart.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Students/
    │   │   │   ├── StudentList.jsx
    │   │   │   ├── StudentDetail.jsx
    │   │   │   └── StudentForm.jsx
    │   │   ├── Courses/
    │   │   │   ├── CourseList.jsx
    │   │   │   └── CourseForm.jsx
    │   │   ├── Departments/
    │   │   │   ├── DepartmentList.jsx
    │   │   │   └── DepartmentForm.jsx
    │   │   ├── Enrolments/
    │   │   │   └── EnrolmentManager.jsx
    │   │   ├── Attendance/
    │   │   │   └── AttendancePage.jsx
    │   │   └── NotFound.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── hooks/
    │   │   ├── useStudents.js
    │   │   ├── useCourses.js
    │   │   └── useDashboard.js
    │   ├── routes/
    │   │   └── AppRoutes.jsx           # Protected route wrapper
    │   ├── utils/
    │   │   └── formatters.js
    │   ├── App.jsx
    │   └── main.jsx
    ├── .env.example
    ├── index.html
    └── package.json
```

---

## 5. Environment Variables

### Backend — `backend/.env`
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/srms
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### Frontend — `frontend/.env`
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

> All Axios calls use the instance in `src/api/axios.js`:
> ```js
> import axios from 'axios';
> const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL });
> export default api;
> ```
> Changing the backend URL for staging/production requires only updating the `.env` file.

---

## 6. Data Models

### 6.1 User
```
_id, name, email, password (hashed), role (admin | faculty),
department (ref), createdAt, updatedAt
```

### 6.2 Department
```
_id, name, code (unique, e.g. "CS"), hodName, description,
createdAt, updatedAt
```

### 6.3 Course
```
_id, title, code (unique), department (ref), faculty (ref User),
credits, semester (1-8), description, createdAt, updatedAt
```

### 6.4 Student
```
_id, studentId (unique, auto-generated e.g. "STU-2024-0001"),
firstName, lastName, email (unique), phone, dob, gender,
department (ref), semester (1-8), avatarSeed (string — used to build
DiceBear URL), address, bloodGroup, guardianName, guardianPhone,
status (active | alumni | suspended), enrolledAt, createdAt, updatedAt
```
> **Avatar strategy:** Store a `avatarSeed` string (defaults to student's full name). The frontend and backend util construct the URL:
> `https://api.dicebear.com/8.x/initials/svg?seed=<avatarSeed>&backgroundColor=random`
> No image upload endpoint is needed.

### 6.5 Enrolment
```
_id, student (ref), course (ref), semester, academicYear,
grade (A+|A|B+|B|C|D|F|null), gradePoints (0-10),
status (active | dropped | completed), enrolledAt
```

### 6.6 Attendance
```
_id, student (ref), course (ref), date (Date), status (present|absent|late),
markedBy (ref User), remarks
```

---

## 7. API Endpoints

All routes prefixed `/api`.  
`🔒` = requires JWT.  `👑` = Admin only.

### Auth
| Method | Path | Description |
|---|---|---|
| POST | `/auth/login` | Login, returns JWT |
| GET | `/auth/me` | 🔒 Get current user profile |

### Students
| Method | Path | Description |
|---|---|---|
| GET | `/students` | 🔒 List all students (search, filter, paginate) |
| POST | `/students` | 👑 Create student |
| GET | `/students/:id` | 🔒 Get student detail |
| PUT | `/students/:id` | 👑 Update student |
| DELETE | `/students/:id` | 👑 Soft-delete (set status = suspended) |
| GET | `/students/:id/enrolments` | 🔒 Student's enrolments + grades |
| GET | `/students/:id/attendance` | 🔒 Student's attendance summary |

### Departments
| Method | Path | Description |
|---|---|---|
| GET | `/departments` | 🔒 List departments |
| POST | `/departments` | 👑 Create department |
| PUT | `/departments/:id` | 👑 Update |
| DELETE | `/departments/:id` | 👑 Delete |

### Courses
| Method | Path | Description |
|---|---|---|
| GET | `/courses` | 🔒 List courses (filter by dept/semester) |
| POST | `/courses` | 👑 Create course |
| PUT | `/courses/:id` | 👑 Update |
| DELETE | `/courses/:id` | 👑 Delete |
| GET | `/courses/:id/students` | 🔒 Enrolled students for a course |

### Enrolments
| Method | Path | Description |
|---|---|---|
| POST | `/enrolments` | 👑 Enrol student in course |
| PUT | `/enrolments/:id/grade` | 🔒 Faculty: assign/update grade |
| PUT | `/enrolments/:id/drop` | 👑 Drop enrolment |

### Attendance
| Method | Path | Description |
|---|---|---|
| POST | `/attendance` | 🔒 Mark attendance (bulk array per day) |
| GET | `/attendance` | 🔒 Query by course + date range |
| PUT | `/attendance/:id` | 🔒 Correct an entry |

### Dashboard
| Method | Path | Description |
|---|---|---|
| GET | `/dashboard/stats` | 🔒 Aggregate counts: students, courses, departments, enrolments |
| GET | `/dashboard/enrolments-by-dept` | 🔒 Enrolments grouped by department |
| GET | `/dashboard/grade-distribution` | 🔒 Grade counts across all enrolments |
| GET | `/dashboard/attendance-rate` | 🔒 Overall attendance % per course |
| GET | `/dashboard/recent-students` | 🔒 Last 5 newly added students |

---

## 8. Frontend Pages & Features

### 8.1 Login Page
- Email + password form
- JWT stored in `localStorage`
- Redirect to Dashboard on success

### 8.2 Dashboard
- **Stat cards:** Total Students · Total Courses · Total Departments · Active Enrolments
- **Bar chart:** Enrolments by Department (Recharts)
- **Pie chart:** Grade distribution (A+, A, B+, B, C, D, F)
- **Recent students table** with avatar

### 8.3 Students
| Feature | Detail |
|---|---|
| List | Searchable by name/ID, filterable by dept/semester/status, paginated |
| Detail | Profile card with DiceBear avatar, personal info, enrolments table, attendance summary |
| Add/Edit | Form with validation (react-hook-form or controlled) |
| Delete | Confirm dialog → soft delete |

### 8.4 Courses
- List with department filter
- Create / Edit / Delete
- View enrolled students per course

### 8.5 Departments
- List, Create, Edit, Delete
- Shows course count and student count

### 8.6 Enrolment Manager
- Select student + course → enrol
- View enrolments, assign grades via dropdown (A+, A, B+…)
- Drop enrolment button

### 8.7 Attendance
- Select course + date → shows enrolled students
- Toggle Present / Absent / Late per student
- Bulk submit
- View historical attendance with per-student % summary

### 8.8 Sidebar Navigation
```
Dashboard | Students | Courses | Departments | Enrolments | Attendance
```
Active route highlighted; collapsible on mobile.

---

## 9. UI / UX Guidelines

- **Theme:** Light mode with an indigo/blue primary palette; subtle shadows, rounded cards
- **Font:** Inter (via Google Fonts or Fontsource)
- **Component library:** Tailwind CSS utility classes only — no heavy component library dependency
- **Responsive:** Works on 1024 px+ desktop; sidebar collapses on smaller screens
- **Loading states:** Skeleton loaders on tables/cards while fetching
- **Error handling:** Toast notifications (react-hot-toast) for success/error API responses
- **Empty states:** Illustrated empty-state message when a table has no data
- **Avatars:** `<AvatarImg seed={student.avatarSeed} />` renders the DiceBear SVG URL in an `<img>` tag — no upload needed

---

## 10. Seed Scripts

Run with: `npm run seed` from the `backend/` directory.

### What gets seeded

| Seed File | Records |
|---|---|
| `users.seed.js` | 1 Admin + 4 Faculty accounts |
| `departments.seed.js` | 5 Departments (CS, IT, ECE, Mechanical, Civil) |
| `courses.seed.js` | 15 Courses spread across departments & semesters |
| `students.seed.js` | 40 Students with realistic fake data (faker.js) |
| `enrolments.seed.js` | ~120 Enrolments with grades (mix of graded and pending) |
| `attendance.seed.js` | Attendance records for the past 30 days per course |

### Seed order (to satisfy refs)
```
1. Departments → 2. Users (Faculty) → 3. Courses → 4. Students → 5. Enrolments → 6. Attendance
```

### Default Admin Credentials (post-seed)
```
Email:    admin@srms.edu
Password: Admin@1234
```

### Seed script structure (`seeds/index.js`)
```js
import mongoose from 'mongoose';
import { seedDepartments } from './departments.seed.js';
import { seedUsers }       from './users.seed.js';
import { seedCourses }     from './courses.seed.js';
import { seedStudents }    from './students.seed.js';
import { seedEnrolments }  from './enrolments.seed.js';
import { seedAttendance }  from './attendance.seed.js';

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('🌱 Starting seed...');
  await seedDepartments();
  await seedUsers();
  await seedCourses();
  await seedStudents();
  await seedEnrolments();
  await seedAttendance();
  console.log('✅ Seed complete!');
  process.exit(0);
}
main().catch(console.error);
```

Add to `backend/package.json`:
```json
"scripts": {
  "dev":  "nodemon server.js",
  "seed": "node -r dotenv/config seeds/index.js",
  "seed:fresh": "node -r dotenv/config seeds/index.js --fresh"
}
```
> `--fresh` flag: drops all collections before re-seeding.

---

## 11. Authentication & Authorization

- **Login** issues a signed JWT (`userId`, `role`, `exp`)
- All protected routes validate the token via `auth.middleware.js`
- `role.middleware.js` blocks non-admin users from write operations
- Frontend `AuthContext` stores decoded user + token; `AppRoutes.jsx` redirects unauthenticated users to `/login`
- Faculty can mark attendance and assign grades; cannot create/delete students or courses

---

## 12. Error Handling

### Backend
- Centralised Express error handler in `server.js`
- All controllers wrapped in `try/catch`; errors forwarded with `next(err)`
- Mongoose validation errors serialised to readable messages
- HTTP status codes: `200`, `201`, `400`, `401`, `403`, `404`, `409`, `500`

### Frontend
- Axios interceptor attaches JWT header; on 401 → clears auth and redirects to login
- `react-hot-toast` for user-facing success/error messages
- Form validation feedback inline (field-level error text)

---

## 13. npm Scripts Summary

### Backend (`backend/package.json`)
```json
{
  "dev":        "nodemon server.js",
  "start":      "node server.js",
  "seed":       "node -r dotenv/config seeds/index.js",
  "seed:fresh": "node -r dotenv/config seeds/index.js --fresh"
}
```

### Frontend (`frontend/package.json`)
```json
{
  "dev":    "vite",
  "build":  "vite build",
  "preview":"vite preview"
}
```

---

## 14. Getting Started (Developer Setup)

```bash
# 1. Clone
git clone <repo-url> && cd srms

# 2. Backend setup
cd backend
cp .env.example .env          # fill in MONGO_URI, JWT_SECRET
npm install
npm run seed                  # seed the database
npm run dev                   # starts on http://localhost:5000

# 3. Frontend setup (new terminal)
cd ../frontend
cp .env.example .env          # set VITE_API_BASE_URL=http://localhost:5000/api
npm install
npm run dev                   # starts on http://localhost:5173
```

---

## 15. Future Enhancements (Out of Scope for v1)

- Student self-service portal (view own grades & attendance)
- PDF report generation (transcripts)
- Dark mode toggle
- Bulk CSV import for students
- Role: **Student** (read-only own data)
- Timetable / Schedule module

---

*End of Document*
