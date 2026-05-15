import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Layout from '../components/layout/Layout.jsx';
import Login from '../pages/Login.jsx';
import Dashboard from '../pages/Dashboard.jsx';
import StudentList from '../pages/Students/StudentList.jsx';
import StudentDetail from '../pages/Students/StudentDetail.jsx';
import StudentForm from '../pages/Students/StudentForm.jsx';
import CourseList from '../pages/Courses/CourseList.jsx';
import CourseForm from '../pages/Courses/CourseForm.jsx';
import DepartmentList from '../pages/Departments/DepartmentList.jsx';
import DepartmentForm from '../pages/Departments/DepartmentForm.jsx';
import EnrolmentManager from '../pages/Enrolments/EnrolmentManager.jsx';
import AttendancePage from '../pages/Attendance/AttendancePage.jsx';
import NotFound from '../pages/NotFound.jsx';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        <p className="text-slate-500 text-sm">Loading SRMS...</p>
      </div>
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="students" element={<StudentList />} />
        <Route path="students/new" element={<StudentForm />} />
        <Route path="students/:id" element={<StudentDetail />} />
        <Route path="students/:id/edit" element={<StudentForm />} />
        <Route path="courses" element={<CourseList />} />
        <Route path="courses/new" element={<CourseForm />} />
        <Route path="courses/:id/edit" element={<CourseForm />} />
        <Route path="departments" element={<DepartmentList />} />
        <Route path="departments/new" element={<DepartmentForm />} />
        <Route path="departments/:id/edit" element={<DepartmentForm />} />
        <Route path="enrolments" element={<EnrolmentManager />} />
        <Route path="attendance" element={<AttendancePage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
