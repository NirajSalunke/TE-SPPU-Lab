import { useEffect, useState } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { BookOpen } from 'lucide-react'
import { getPosts } from '../api/posts'
import { getCategories } from '../api/categories'
import PostCard from '../components/PostCard'
import { SkeletonGrid } from '../components/SkeletonCard'
import EmptyState from '../components/EmptyState'

export default function Blog() {
  const [posts, setPosts] = useState([])
  const [categories, setCategories] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('')
  const location = useLocation()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    setActiveCategory(params.get('category') || '')
    setPage(1)
  }, [location.search])

  useEffect(() => {
    fetchPosts()
  }, [page, activeCategory])

  useEffect(() => {
    getCategories().then(({ data }) => setCategories(data)).catch(() => {})
  }, [])

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const params = { page, limit: 9 }
      if (activeCategory) params.category = activeCategory
      const { data } = await getPosts(params)
      setPosts(data.posts)
      setTotal(data.total)
      setPages(data.pages)
    } catch { /* silent */ }
    finally { setLoading(false) }
  }

  return (
    <div className="section">
      <div className="container-blog">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">Blog</h1>
          <p className="text-zinc-500 dark:text-zinc-400">{total} post{total !== 1 ? 's' : ''} published</p>
        </div>

        {/* Category filter */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setActiveCategory('')}
              className={`badge py-1.5 cursor-pointer transition-all ${!activeCategory ? 'badge-primary' : 'badge-zinc hover:badge-primary'}`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => setActiveCategory(cat.slug)}
                className={`badge py-1.5 cursor-pointer transition-all ${activeCategory === cat.slug ? 'badge-primary' : 'badge-zinc hover:badge-primary'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <SkeletonGrid count={9} />
        ) : posts.length === 0 ? (
          <EmptyState title="No posts found" description="Try a different category or check back later." icon={BookOpen} />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {posts.map((p) => <PostCard key={p._id} post={p} />)}
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div className="flex justify-center gap-2">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="btn-outline">← Prev</button>
                {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={p === page ? 'btn-primary' : 'btn-outline'}
                  >
                    {p}
                  </button>
                ))}
                <button onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page === pages} className="btn-outline">Next →</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
