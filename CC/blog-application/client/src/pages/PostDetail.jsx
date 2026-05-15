import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Calendar, Clock, Eye, Heart, Share2, ArrowLeft, Tag } from 'lucide-react'
import { getPostBySlug, getRelatedPosts, likePost } from '../api/posts'
import { formatDate, readingTime } from '../utils/helpers'
import CommentSection from '../components/CommentSection'
import PostCard from '../components/PostCard'
import EmptyState from '../components/EmptyState'

function renderContent(content) {
  // Simple markdown-like rendering
  return content
    .split('\n\n')
    .map((block, i) => {
      if (block.startsWith('## ')) return `<h2>${block.slice(3)}</h2>`
      if (block.startsWith('### ')) return `<h3>${block.slice(4)}</h3>`
      if (block.startsWith('# ')) return `<h2>${block.slice(2)}</h2>`
      if (block.startsWith('- ') || block.startsWith('* ')) {
        const items = block.split('\n').map(l => `<li>${l.replace(/^[-*] /, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>`).join('')
        return `<ul>${items}</ul>`
      }
      if (/^\d+\./.test(block)) {
        const items = block.split('\n').map(l => `<li>${l.replace(/^\d+\. /, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>`).join('')
        return `<ol>${items}</ol>`
      }
      if (block.startsWith('```')) {
        const code = block.replace(/^```[a-z]*\n?/, '').replace(/```$/, '')
        return `<pre><code>${code}</code></pre>`
      }
      const p = block.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/`(.*?)`/g, '<code>$1</code>')
      return `<p>${p}</p>`
    })
    .join('')
}

export default function PostDetail() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    fetchPost()
  }, [slug])

  const fetchPost = async () => {
    setLoading(true)
    setNotFound(false)
    try {
      const { data } = await getPostBySlug(slug)
      setPost(data)
      const rel = await getRelatedPosts(slug)
      setRelated(rel.data)
    } catch (err) {
      if (err.response?.status === 404) setNotFound(true)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async () => {
    if (liked) return
    try {
      const { data } = await likePost(post._id)
      setPost((p) => ({ ...p, likes: data.likes }))
      setLiked(true)
    } catch { /* silent */ }
  }

  if (loading) return (
    <div className="section container-blog max-w-3xl mx-auto">
      <div className="skeleton h-8 w-32 rounded mb-6" />
      <div className="skeleton h-10 w-full rounded mb-3" />
      <div className="skeleton h-10 w-3/4 rounded mb-6" />
      <div className="skeleton aspect-[16/9] rounded-2xl mb-8" />
      {[1,2,3,4].map(i => <div key={i} className="skeleton h-4 w-full rounded mb-3" />)}
    </div>
  )

  if (notFound) return (
    <div className="section container-blog">
      <EmptyState title="Post not found" description="The post you're looking for doesn't exist." />
      <div className="flex justify-center mt-6">
        <Link to="/blog" className="btn-primary">← Back to Blog</Link>
      </div>
    </div>
  )

  if (!post) return null

  return (
    <div className="animate-fadeInUp">
      {/* Cover image */}
      {post.coverImageUrl && (
        <div className="w-full max-h-[480px] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
          <img
            src={post.coverImageUrl}
            alt={post.title}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.style.display = 'none' }}
          />
        </div>
      )}

      <div className="container-blog max-w-3xl mx-auto py-10">
        {/* Back */}
        <Link to="/blog" className="btn-ghost text-sm mb-6 inline-flex">
          <ArrowLeft size={15} /> Back to Blog
        </Link>

        {/* Category & tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.categoryId && (
            <Link to={`/category/${post.categoryId.slug}`} className="badge badge-primary">{post.categoryId.name}</Link>
          )}
          {post.tags?.map((tag) => (
            <span key={tag} className="badge badge-zinc flex items-center gap-1"><Tag size={10} />#{tag}</span>
          ))}
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-zinc-100 leading-tight mb-4">
          {post.title}
        </h1>

        {/* Excerpt */}
        <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6 border-l-4 border-primary-500 pl-4">
          {post.excerpt}
        </p>

        {/* Meta bar */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400 mb-10 pb-6 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <img
              src={post.authorId?.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${post.authorId?.name}`}
              alt={post.authorId?.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="font-medium text-zinc-700 dark:text-zinc-300">{post.authorId?.name}</span>
          </div>
          <span className="flex items-center gap-1"><Calendar size={14} /> {formatDate(post.publishedAt || post.createdAt)}</span>
          <span className="flex items-center gap-1"><Clock size={14} /> {readingTime(post.content)}</span>
          <span className="flex items-center gap-1"><Eye size={14} /> {post.views} views</span>
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 transition-colors ml-auto ${liked ? 'text-red-500' : 'hover:text-red-500'}`}
          >
            <Heart size={14} fill={liked ? 'currentColor' : 'none'} /> {post.likes}
          </button>
          <button
            onClick={() => navigator.share?.({ title: post.title, url: window.location.href })}
            className="flex items-center gap-1 hover:text-primary-500 transition-colors"
          >
            <Share2 size={14} /> Share
          </button>
        </div>

        {/* Content */}
        <article
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: renderContent(post.content) }}
        />

        {/* Comments */}
        <CommentSection postId={post._id} />

        {/* Related posts */}
        {related.length > 0 && (
          <section className="mt-16 pt-10 border-t border-zinc-200 dark:border-zinc-800">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">Related Posts</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {related.map((p) => <PostCard key={p._id} post={p} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
