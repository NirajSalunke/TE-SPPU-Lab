import { useAuth } from '../../context/AuthContext.jsx';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

const breadcrumbMap = {
  '/': 'Dashboard',
  '/students': 'Students',
  '/courses': 'Courses',
  '/departments': 'Departments',
  '/enrolments': 'Enrolments',
  '/attendance': 'Attendance',
};

export default function Topbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const pathParts = location.pathname.split('/').filter(Boolean);
  const currentPage = breadcrumbMap[location.pathname] || (pathParts[0] ? pathParts[0].charAt(0).toUpperCase() + pathParts[0].slice(1) : 'Dashboard');

  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center px-4 gap-4 sticky top-0 z-10 shadow-sm">
      {/* Hamburger */}
      <button
        id="sidebar-toggle"
        onClick={onMenuClick}
        className="btn-icon lg:hidden text-slate-500"
        aria-label="Toggle sidebar"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 flex-1">
        <span className="text-slate-400 text-sm hidden sm:inline">SRMS</span>
        <span className="text-slate-300 hidden sm:inline">/</span>
        <span className="text-sm font-semibold text-slate-800">{currentPage}</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-2 text-sm text-slate-600">
          <span className="font-medium">{user?.name}</span>
        </div>
        <button
          id="logout-btn"
          onClick={handleLogout}
          className="btn-secondary btn-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
