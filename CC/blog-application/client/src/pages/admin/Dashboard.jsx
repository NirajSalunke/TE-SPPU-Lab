import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FileText, Eye, Heart, FolderOpen, PlusCircle, TrendingUp, MessageCircle } from 'lucide-react'
import { getPosts } from '../../api/posts'
import { getCategories } from '../../api/categories'
import useAuthStore from '../../store/useAuthStore'

export default function Dashboard() {
  const { user } = useAuthStore()
  const [stats, setStats] = useState({ total: 0, published: 0, drafts: 0, views: 0, likes: 0 })
  const [categories, setCategories] = useState([])
  const [recentPosts, setRecentPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const [allPosts, cats] = await Promise.all([
          getPosts({ limit: 100, status: 'all' }),
          getCategories(),
        ])
        const posts = allPosts.data.posts
        setRecentPosts(posts.slice(0, 5))
        setCategories(cats.data)
        setStats({
          total: allPosts.data.total,
          published: posts.filter((p) => p.status === 'published').length,
          drafts: posts.filter((p) => p.status === 'draft').length,
          views: posts.reduce((s, p) => s + (p.views || 0), 0),
          likes: posts.reduce((s, p) => s + (p.likes || 0), 0),
        })
      } catch { /* silent */ }
      finally { setLoading(false) }
    }
    fetch()
  }, [])

  const statCards = [
    { label: 'Total Posts', value: stats.total, icon: FileText, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-500/10' },
    { label: 'Published', value: stats.published, icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
    { label: 'Drafts', value: stats.drafts, icon: FileText, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10' },
    { label: 'Total Views', value: stats.views, icon: Eye, color: 'text-sky-500', bg: 'bg-sky-50 dark:bg-sky-500/10' },
    { label: 'Total Likes', value: stats.likes, icon: Heart, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-500/10' },
    { label: 'Categories', value: categories.length, icon: FolderOpen, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-500/10' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Dashboard</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-0.5">Welcome back, {user?.name}!</p>
        </div>
        <Link to="/admin/posts/new" className="btn-primary">
          <PlusCircle size={16} /> New Post
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="card p-5">
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
              <Icon size={18} className={color} />
            </div>
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{loading ? '—' : value}</div>
            <div className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Recent Posts */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">Recent Posts</h2>
          <Link to="/admin/posts" className="text-sm text-primary-500 hover:underline">View all</Link>
        </div>
        <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="px-5 py-3 flex gap-3">
                <div className="skeleton h-4 flex-1 rounded" />
                <div className="skeleton h-4 w-16 rounded" />
              </div>
            ))
          ) : recentPosts.length === 0 ? (
            <p className="px-5 py-8 text-sm text-center text-zinc-400">No posts yet.</p>
          ) : (
            recentPosts.map((p) => (
              <div key={p._id} className="px-5 py-3 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <Link to={`/admin/posts/edit/${p._id}`} className="text-sm font-medium text-zinc-800 dark:text-zinc-200 hover:text-primary-500 truncate block">
                    {p.title}
                  </Link>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500">{p.categoryId?.name || 'Uncategorized'}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`badge ${p.status === 'published' ? 'badge-primary' : 'badge-zinc'}`}>{p.status}</span>
                  <span className="text-xs text-zinc-400 flex items-center gap-1"><Eye size={11} />{p.views}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
