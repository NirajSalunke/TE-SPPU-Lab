import { Link } from 'react-router-dom'
import { Github, Twitter, Rss } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 mt-auto">
      <div className="container-blog py-10">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 font-bold text-lg text-zinc-900 dark:text-zinc-100">
              <span className="w-7 h-7 rounded-lg bg-primary-500 flex items-center justify-center text-white text-xs font-black">I</span>
              Inkwell
            </Link>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 max-w-xs">
              A modern blog platform for ideas, stories, and tutorials.
            </p>
          </div>

          <div className="flex gap-12">
            <div>
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3">Explore</h4>
              <div className="space-y-2 text-sm">
                <Link to="/blog" className="block text-zinc-500 dark:text-zinc-400 hover:text-primary-500 transition-colors">All Posts</Link>
                <Link to="/categories" className="block text-zinc-500 dark:text-zinc-400 hover:text-primary-500 transition-colors">Categories</Link>
                <Link to="/search?q=" className="block text-zinc-500 dark:text-zinc-400 hover:text-primary-500 transition-colors">Search</Link>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3">Admin</h4>
              <div className="space-y-2 text-sm">
                <Link to="/login" className="block text-zinc-500 dark:text-zinc-400 hover:text-primary-500 transition-colors">Login</Link>
                <Link to="/admin" className="block text-zinc-500 dark:text-zinc-400 hover:text-primary-500 transition-colors">Dashboard</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            © {new Date().getFullYear()} Inkwell. Built with MERN stack.
          </p>
          <div className="flex items-center gap-3">
            <a href="#" className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"><Github size={16} /></a>
            <a href="#" className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"><Twitter size={16} /></a>
            <a href="#" className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"><Rss size={16} /></a>
          </div>
        </div>
      </div>
    </footer>
  )
}
