import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Search } from 'lucide-react'
import { searchPosts } from '../api/posts'
import PostCard from '../components/PostCard'
import { SkeletonGrid } from '../components/SkeletonCard'
import EmptyState from '../components/EmptyState'

export default function SearchResults() {
  const location = useLocation()
  const q = new URLSearchParams(location.search).get('q') || ''
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!q.trim()) return
    setLoading(true)
    searchPosts(q)
      .then(({ data }) => setResults(data))
      .catch(() => setResults([]))
      .finally(() => setLoading(false))
  }, [q])

  return (
    <div className="section">
      <div className="container-blog">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            Search Results
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            {q ? `Showing results for "${q}"` : 'Enter a search term to begin'}
          </p>
        </div>

        {loading ? <SkeletonGrid count={6} /> : !q ? null : results.length === 0 ? (
          <EmptyState
            title="No results found"
            description={`We couldn't find any posts matching "${q}". Try different keywords.`}
            icon={Search}
          />
        ) : (
          <>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">{results.length} result{results.length !== 1 ? 's' : ''} found</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((p) => <PostCard key={p._id} post={p} />)}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
