import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, FileText, FolderOpen, LogOut, PlusCircle, Home } from 'lucide-react'
import useAuthStore from '../store/useAuthStore'
import { useEffect } from 'react'

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { to: '/admin/posts', icon: FileText, label: 'Posts' },
  { to: '/admin/posts/new', icon: PlusCircle, label: 'New Post' },
  { to: '/admin/categories', icon: FolderOpen, label: 'Categories' },
]

export default function AdminLayout() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!user) navigate('/login')
  }, [user])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex bg-zinc-50 dark:bg-zinc-950">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 hidden md:flex flex-col border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="flex items-center gap-2 p-5 border-b border-zinc-200 dark:border-zinc-800">
          <span className="w-7 h-7 rounded-lg bg-primary-500 flex items-center justify-center text-white text-xs font-black">I</span>
          <span className="font-bold text-zinc-900 dark:text-zinc-100">Inkwell</span>
          <span className="ml-auto badge badge-zinc text-xs">Admin</span>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ to, icon: Icon, label, exact }) => {
            const active = exact ? location.pathname === to : location.pathname.startsWith(to)
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-primary-500 text-white'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                <Icon size={16} /> {label}
              </Link>
            )
          })}
        </nav>
        <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 space-y-1">
          <Link to="/" className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800">
            <Home size={16} /> View Blog
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 w-full text-left"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center px-6 gap-4 md:hidden">
          <span className="font-bold text-zinc-900 dark:text-zinc-100">Admin</span>
          <div className="flex items-center gap-2 ml-auto">
            {navItems.map(({ to, icon: Icon }) => (
              <Link key={to} to={to} className="btn-ghost p-2 rounded-xl"><Icon size={16} /></Link>
            ))}
            <button onClick={handleLogout} className="btn-ghost p-2 rounded-xl text-red-500"><LogOut size={16} /></button>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
