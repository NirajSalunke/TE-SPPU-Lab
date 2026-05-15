import { Link, useNavigate } from 'react-router-dom'
import { Sun, Moon, Search, PenSquare, LogOut, LayoutDashboard, Menu, X } from 'lucide-react'
import { useState } from 'react'
import useAuthStore from '../store/useAuthStore'
import { useTheme } from '../hooks/useTheme'

export default function Navbar() {
  const { user, logout } = useAuthStore()
  const { theme, toggle } = useTheme()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQ, setSearchQ] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQ.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQ.trim())}`)
      setSearchQ('')
      setSearchOpen(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
    setMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
      <div className="container-blog flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-zinc-900 dark:text-zinc-100 shrink-0">
          <span className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center text-white text-sm font-black">I</span>
          <span className="hidden sm:block">Inkwell</span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-1">
          <Link to="/blog" className="btn-ghost text-sm">Blog</Link>
          <Link to="/categories" className="btn-ghost text-sm">Categories</Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Search toggle */}
          {searchOpen ? (
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <input
                autoFocus
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
                placeholder="Search posts..."
                className="input w-48 sm:w-64 py-1.5"
              />
              <button type="button" onClick={() => setSearchOpen(false)} className="btn-ghost p-2 rounded-xl">
                <X size={16} />
              </button>
            </form>
          ) : (
            <button onClick={() => setSearchOpen(true)} className="btn-ghost p-2 rounded-xl" aria-label="Search">
              <Search size={18} />
            </button>
          )}

          {/* Theme toggle */}
          <button onClick={toggle} className="btn-ghost p-2 rounded-xl" aria-label="Toggle theme">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Auth actions */}
          {user ? (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/admin" className="btn-secondary text-sm py-1.5">
                <LayoutDashboard size={15} /> Dashboard
              </Link>
              <button onClick={handleLogout} className="btn-ghost p-2 rounded-xl" aria-label="Logout">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="hidden md:flex btn-primary text-sm py-1.5">
              <PenSquare size={15} /> Admin
            </Link>
          )}

          {/* Mobile menu button */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="btn-ghost p-2 rounded-xl md:hidden">
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-3 space-y-1">
          <Link to="/blog" onClick={() => setMenuOpen(false)} className="block btn-ghost text-sm w-full text-left">Blog</Link>
          <Link to="/categories" onClick={() => setMenuOpen(false)} className="block btn-ghost text-sm w-full text-left">Categories</Link>
          {user ? (
            <>
              <Link to="/admin" onClick={() => setMenuOpen(false)} className="block btn-ghost text-sm w-full text-left">Dashboard</Link>
              <button onClick={handleLogout} className="block btn-ghost text-sm w-full text-left text-red-500">Logout</button>
            </>
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)} className="block btn-primary text-sm w-full justify-center">Admin Login</Link>
          )}
        </div>
      )}
    </header>
  )
}
