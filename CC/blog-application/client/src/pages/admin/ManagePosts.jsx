import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PlusCircle, Pencil, Trash2, Eye, ExternalLink } from 'lucide-react'
import { getPosts, deletePost } from '../../api/posts'
import { formatDate } from '../../utils/helpers'

export default function ManagePosts() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => { fetchPosts() }, [filter])

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const params = { limit: 50 }
      if (filter !== 'all') params.status = filter
      const { data } = await getPosts(params)
      setPosts(data.posts)
    } catch { /* silent */ }
    finally { setLoading(false) }
  }

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete "${title}"?`)) return
    try {
      await deletePost(id)
      setPosts((prev) => prev.filter((p) => p._id !== id))
    } catch { alert('Failed to delete post') }
  }

  const filtered = filter === 'all' ? posts : posts.filter((p) => p.status === filter)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Posts</h1>
        <Link to="/admin/posts/new" className="btn-primary"><PlusCircle size={15} /> New Post</Link>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {['all', 'published', 'draft'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`badge py-1.5 cursor-pointer capitalize transition-all ${filter === f ? 'badge-primary' : 'badge-zinc'}`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="px-5 py-4 flex gap-4">
                <div className="skeleton h-4 flex-1 rounded" />
                <div className="skeleton h-4 w-20 rounded" />
                <div className="skeleton h-4 w-16 rounded" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="py-12 text-center text-sm text-zinc-400">No posts found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
                  <th className="text-left px-5 py-3 font-semibold text-zinc-600 dark:text-zinc-400">Title</th>
                  <th className="text-left px-4 py-3 font-semibold text-zinc-600 dark:text-zinc-400 hidden md:table-cell">Category</th>
                  <th className="text-left px-4 py-3 font-semibold text-zinc-600 dark:text-zinc-400">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-zinc-600 dark:text-zinc-400 hidden lg:table-cell">Date</th>
                  <th className="text-left px-4 py-3 font-semibold text-zinc-600 dark:text-zinc-400 hidden lg:table-cell">Views</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {filtered.map((p) => (
                  <tr key={p._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors">
                    <td className="px-5 py-3">
                      <p className="font-medium text-zinc-800 dark:text-zinc-200 line-clamp-1 max-w-xs">{p.title}</p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-zinc-500 dark:text-zinc-400">
                      {p.categoryId?.name || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge ${p.status === 'published' ? 'badge-primary' : 'badge-zinc'}`}>{p.status}</span>
                    </td>
                    <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400 hidden lg:table-cell whitespace-nowrap">
                      {formatDate(p.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400 hidden lg:table-cell">
                      {p.views}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        {p.status === 'published' && (
                          <Link to={`/post/${p.slug}`} target="_blank" className="btn-ghost p-1.5 rounded-lg text-zinc-400 hover:text-primary-500">
                            <ExternalLink size={14} />
                          </Link>
                        )}
                        <Link to={`/admin/posts/edit/${p._id}`} className="btn-ghost p-1.5 rounded-lg text-zinc-400 hover:text-primary-500">
                          <Pencil size={14} />
                        </Link>
                        <button onClick={() => handleDelete(p._id, p.title)} className="btn-ghost p-1.5 rounded-lg text-zinc-400 hover:text-red-500">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
