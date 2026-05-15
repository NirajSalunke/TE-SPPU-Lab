import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Save, ArrowLeft, Image, Tag, X } from 'lucide-react'
import { createPost, updatePost, getPosts } from '../../api/posts'
import { getCategories } from '../../api/categories'

export default function PostForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState({
    title: '', excerpt: '', content: '', coverImageUrl: '',
    categoryId: '', tags: '', status: 'draft', featured: false,
  })
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEdit)
  const [error, setError] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState([])

  useEffect(() => {
    getCategories().then(({ data }) => setCategories(data)).catch(() => {})
    if (isEdit) {
      getPosts({ limit: 200 }).then(({ data }) => {
        const post = data.posts.find((p) => p._id === id)
        if (post) {
          setForm({
            title: post.title,
            excerpt: post.excerpt,
            content: post.content,
            coverImageUrl: post.coverImageUrl || '',
            categoryId: post.categoryId?._id || '',
            tags: '',
            status: post.status,
            featured: post.featured,
          })
          setTags(post.tags || [])
        }
      }).finally(() => setFetching(false))
    }
  }, [id])

  const set = (field, val) => setForm((f) => ({ ...f, [field]: val }))

  const addTag = () => {
    const t = tagInput.trim().toLowerCase().replace(/\s+/g, '-')
    if (t && !tags.includes(t)) setTags([...tags, t])
    setTagInput('')
  }
  const removeTag = (tag) => setTags(tags.filter((t) => t !== tag))

  const handleSubmit = async (asDraft = false) => {
    setError('')
    if (!form.title || !form.excerpt || !form.content) {
      setError('Title, excerpt, and content are required')
      return
    }
    setLoading(true)
    const payload = { ...form, tags, status: asDraft ? 'draft' : form.status }
    try {
      if (isEdit) {
        await updatePost(id, payload)
      } else {
        await createPost(payload)
      }
      navigate('/admin/posts')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save post')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return (
    <div className="space-y-4">
      {[1,2,3,4].map(i => <div key={i} className="skeleton h-10 rounded-xl" />)}
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/admin/posts')} className="btn-ghost p-2 rounded-xl">
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          {isEdit ? 'Edit Post' : 'New Post'}
        </h1>
      </div>

      {error && (
        <div className="mb-5 p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-5">
        {/* Title */}
        <div className="card p-5">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Title *</label>
          <input
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            className="input text-lg font-semibold"
            placeholder="Your post title..."
          />
        </div>

        {/* Excerpt */}
        <div className="card p-5">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Excerpt *</label>
          <textarea
            value={form.excerpt}
            onChange={(e) => set('excerpt', e.target.value)}
            rows={2}
            className="input resize-none"
            placeholder="A short summary shown on listing pages..."
          />
        </div>

        {/* Content */}
        <div className="card p-5">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
            Content * <span className="text-xs text-zinc-400">(Markdown supported: ## Heading, **bold**, `code`, - list)</span>
          </label>
          <textarea
            value={form.content}
            onChange={(e) => set('content', e.target.value)}
            rows={16}
            className="input resize-y font-mono text-sm"
            placeholder="Write your post content here..."
          />
        </div>

        {/* Cover image */}
        <div className="card p-5">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 flex items-center gap-1.5">
            <Image size={14} /> Cover Image URL
            <span className="text-xs text-zinc-400">(leave blank for auto-generated)</span>
          </label>
          <input
            value={form.coverImageUrl}
            onChange={(e) => set('coverImageUrl', e.target.value)}
            className="input"
            placeholder="https://picsum.photos/seed/my-post/800/450"
          />
          {form.coverImageUrl && (
            <img src={form.coverImageUrl} alt="Cover preview" className="mt-3 w-full h-40 object-cover rounded-xl" onError={(e) => { e.target.style.display = 'none' }} />
          )}
        </div>

        {/* Meta: category, tags, status, featured */}
        <div className="card p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Category</label>
            <select value={form.categoryId} onChange={(e) => set('categoryId', e.target.value)} className="input">
              <option value="">Uncategorized</option>
              {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Status</label>
            <select value={form.status} onChange={(e) => set('status', e.target.value)} className="input">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          {/* Tags */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 flex items-center gap-1.5">
              <Tag size={13} /> Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
                className="input flex-1"
                placeholder="Type a tag and press Enter"
              />
              <button type="button" onClick={addTag} className="btn-secondary">Add</button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span key={tag} className="badge badge-primary flex items-center gap-1">
                    #{tag}
                    <button onClick={() => removeTag(tag)} className="ml-0.5 hover:text-red-300"><X size={10} /></button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Featured */}
          <div className="sm:col-span-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => set('featured', e.target.checked)}
                className="w-4 h-4 rounded accent-primary-500"
              />
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Feature this post on the homepage</span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 justify-end">
          <button onClick={() => navigate('/admin/posts')} className="btn-outline">Cancel</button>
          <button onClick={() => handleSubmit(true)} disabled={loading} className="btn-secondary">
            Save as Draft
          </button>
          <button onClick={() => handleSubmit(false)} disabled={loading} className="btn-primary">
            <Save size={15} /> {loading ? 'Saving...' : (form.status === 'published' ? 'Publish' : 'Save Post')}
          </button>
        </div>
      </div>
    </div>
  )
}
