import { useEffect, useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { Search, ArrowRight } from 'lucide-react'
import { getCategories } from '../api/categories'

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCategories()
      .then(({ data }) => setCategories(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const colors = [
    'from-indigo-500 to-purple-600',
    'from-pink-500 to-rose-600',
    'from-emerald-500 to-teal-600',
    'from-amber-500 to-orange-600',
    'from-sky-500 to-blue-600',
    'from-violet-500 to-indigo-600',
  ]

  return (
    <div className="section">
      <div className="container-blog">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">Categories</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mb-10">Browse posts by topic</p>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => <div key={i} className="skeleton h-36 rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, i) => (
              <Link
                key={cat._id}
                to={`/category/${cat.slug}`}
                className={`relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br ${colors[i % colors.length]} text-white group hover:shadow-xl hover:-translate-y-1 transition-all duration-200`}
              >
                <h3 className="text-xl font-bold mb-2">{cat.name}</h3>
                {cat.description && <p className="text-sm text-white/80 mb-4 line-clamp-2">{cat.description}</p>}
                <span className="flex items-center gap-1 text-sm font-medium text-white/90 group-hover:gap-2 transition-all">
                  Explore <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
