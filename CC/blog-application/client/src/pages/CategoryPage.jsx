import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { FolderOpen } from 'lucide-react'
import { getPosts } from '../api/posts'
import { getCategories } from '../api/categories'
import PostCard from '../components/PostCard'
import { SkeletonGrid } from '../components/SkeletonCard'
import EmptyState from '../components/EmptyState'

export default function CategoryPage() {
  const { slug } = useParams()
  const [posts, setPosts] = useState([])
  const [category, setCategory] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      try {
        const [cats, p] = await Promise.all([getCategories(), getPosts({ category: slug, limit: 20 })])
        const found = cats.data.find((c) => c.slug === slug)
        setCategory(found)
        setPosts(p.data.posts)
      } catch { /* silent */ }
      finally { setLoading(false) }
    }
    fetch()
  }, [slug])

  return (
    <div className="section">
      <div className="container-blog">
        <div className="mb-8">
          <span className="badge badge-primary mb-3">{slug}</span>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            {category?.name || 'Category'}
          </h1>
          {category?.description && (
            <p className="text-zinc-500 dark:text-zinc-400">{category.description}</p>
          )}
        </div>

        {loading ? <SkeletonGrid count={6} /> : posts.length === 0 ? (
          <EmptyState title="No posts in this category yet" icon={FolderOpen} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((p) => <PostCard key={p._id} post={p} />)}
          </div>
        )}
      </div>
    </div>
  )
}
