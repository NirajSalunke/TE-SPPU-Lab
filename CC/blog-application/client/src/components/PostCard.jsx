import { Link } from 'react-router-dom'
import { Clock, Heart, Eye, Star } from 'lucide-react'
import { formatDate, readingTime } from '../utils/helpers'

export default function PostCard({ post, featured = false }) {
  const cover = post.coverImageUrl || `https://picsum.photos/seed/${post.slug}/800/450`

  return (
    <article className={`card group hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 ${featured ? 'md:flex' : ''}`}>
      {/* Cover image */}
      <Link
        to={`/post/${post.slug}`}
        className={`block overflow-hidden bg-zinc-100 dark:bg-zinc-800 ${featured ? 'md:w-2/5 shrink-0' : 'aspect-[16/9]'}`}
      >
        <img
          src={cover}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { e.target.src = `https://picsum.photos/seed/fallback/800/450` }}
        />
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Category & featured badge */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {post.featured && (
            <span className="badge badge-primary flex items-center gap-1">
              <Star size={10} /> Featured
            </span>
          )}
          {post.categoryId && (
            <Link
              to={`/category/${post.categoryId.slug}`}
              className="badge badge-zinc hover:bg-primary-100 dark:hover:bg-primary-500/20 hover:text-primary-700 dark:hover:text-primary-400 transition-colors"
            >
              {post.categoryId.name}
            </Link>
          )}
          {post.tags?.slice(0, 2).map((tag) => (
            <span key={tag} className="badge badge-zinc">#{tag}</span>
          ))}
        </div>

        {/* Title */}
        <Link to={`/post/${post.slug}`}>
          <h2 className={`font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors leading-snug mb-2 line-clamp-2 ${featured ? 'text-xl' : 'text-lg'}`}>
            {post.title}
          </h2>
        </Link>

        {/* Excerpt */}
        <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-4 leading-relaxed flex-1">
          {post.excerpt}
        </p>

        {/* Meta */}
        <div className="flex items-center justify-between text-xs text-zinc-400 dark:text-zinc-500 mt-auto">
          <div className="flex items-center gap-3">
            <img
              src={post.authorId?.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${post.authorId?.name || 'A'}`}
              alt={post.authorId?.name}
              className="w-6 h-6 rounded-full object-cover"
            />
            <span>{post.authorId?.name || 'Unknown'}</span>
            <span>·</span>
            <span>{formatDate(post.publishedAt || post.createdAt)}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><Clock size={12} /> {readingTime(post.content)}</span>
            <span className="flex items-center gap-1"><Eye size={12} /> {post.views || 0}</span>
            <span className="flex items-center gap-1"><Heart size={12} /> {post.likes || 0}</span>
          </div>
        </div>
      </div>
    </article>
  )
}
