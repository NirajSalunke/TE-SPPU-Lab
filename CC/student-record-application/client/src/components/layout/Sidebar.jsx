import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const navItems = [
  { to: '/', label: 'Dashboard', icon: '📊', end: true },
  { to: '/students', label: 'Students', icon: '🎓' },
  { to: '/courses', label: 'Courses', icon: '📚' },
  { to: '/departments', label: 'Departments', icon: '🏛️' },
  { to: '/enrolments', label: 'Enrolments', icon: '📝' },
  { to: '/attendance', label: 'Attendance', icon: '✅' },
];

export default function Sidebar({ open, onClose }) {
  const { user, isAdmin } = useAuth();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 flex flex-col w-64 bg-white border-r border-slate-100 shadow-lg lg:shadow-none transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 h-16 border-b border-slate-100 shrink-0">
          <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center text-white text-lg shadow-sm">
            🎓
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 leading-tight">SRMS</p>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Student Records</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'nav-link-active' : ''}`
              }
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User info */}
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <img
              src={`https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(user?.name || 'User')}&backgroundColor=random`}
              alt={user?.name}
              className="w-8 h-8 rounded-full ring-2 ring-primary-200"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-800 truncate">{user?.name}</p>
              <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
            </div>
            <span className={`shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded ${isAdmin ? 'bg-primary-100 text-primary-700' : 'bg-slate-100 text-slate-600'}`}>
              {isAdmin ? 'ADMIN' : 'FACULTY'}
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
