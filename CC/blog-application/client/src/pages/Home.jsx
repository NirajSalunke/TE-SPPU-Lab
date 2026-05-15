import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, BookOpen } from 'lucide-react'
import { getFeaturedPosts, getPosts } from '../api/posts'
import { getCategories } from '../api/categories'
import PostCard from '../components/PostCard'
import SkeletonCard, { SkeletonGrid } from '../components/SkeletonCard'
import EmptyState from '../components/EmptyState'

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [latest, setLatest] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const [f, p, c] = await Promise.all([
          getFeaturedPosts(),
          getPosts({ limit: 6 }),
          getCategories(),
        ])
        setFeatured(f.data)
        setLatest(p.data.posts)
        setCategories(c.data)
      } catch { /* silent */ }
      finally { setLoading(false) }
    }
    fetch()
  }, [])

  return (
    <div className="animate-fadeInUp">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-500 via-primary-600 to-indigo-700 dark:from-primary-700 dark:via-indigo-800 dark:to-zinc-900">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="container-blog py-24 relative z-10">
          <div className="max-w-2xl">
            <span className="badge bg-white/20 text-white border border-white/30 mb-4">
              <Sparkles size={12} /> Modern Blog Platform
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6">
              Ideas worth<br />
              <span className="text-primary-200">reading.</span>
            </h1>
            <p className="text-lg text-primary-100 mb-8 leading-relaxed">
              Dive into thoughtful articles on technology, design, development, and career growth.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/blog" className="btn bg-white text-primary-600 hover:bg-primary-50 font-semibold shadow-lg">
                <BookOpen size={16} /> Browse All Posts
              </Link>
              <Link to="/categories" className="btn bg-white/10 border border-white/30 text-white hover:bg-white/20">
                Explore Categories <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories strip */}
      {categories.length > 0 && (
        <section className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-x-auto">
          <div className="container-blog py-4 flex items-center gap-3">
            <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider shrink-0">Topics:</span>
            <div className="flex gap-2">
              {categories.map((cat) => (
                <Link key={cat._id} to={`/category/${cat.slug}`} className="badge badge-zinc hover:badge-primary whitespace-nowrap transition-colors">
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured posts */}
      {(loading || featured.length > 0) && (
        <section className="section bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
          <div className="container-blog">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Sparkles size={20} className="text-primary-500" /> Featured
              </h2>
            </div>
            {loading ? (
              <div className="space-y-6">
                <SkeletonCard featured />
              </div>
            ) : featured.length === 0 ? null : (
              <div className="space-y-6">
                <PostCard post={featured[0]} featured />
                {featured.length > 1 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                    {featured.slice(1, 3).map((p) => <PostCard key={p._id} post={p} />)}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Latest posts */}
      <section className="section">
        <div className="container-blog">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Latest Posts</h2>
            <Link to="/blog" className="btn-outline text-sm">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          {loading ? (
            <SkeletonGrid count={6} />
          ) : latest.length === 0 ? (
            <EmptyState title="No posts yet" description="Run the seed script to add demo content." icon={BookOpen} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {latest.map((p) => <PostCard key={p._id} post={p} />)}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
