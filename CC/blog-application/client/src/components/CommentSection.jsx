import { useState, useEffect } from 'react'
import { Send, MessageCircle, Trash2 } from 'lucide-react'
import { getComments, addComment, deleteComment } from '../api/comments'
import { timeAgo } from '../utils/helpers'
import useAuthStore from '../store/useAuthStore'

export default function CommentSection({ postId }) {
  const { user } = useAuthStore()
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [guestName, setGuestName] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchComments()
  }, [postId])

  const fetchComments = async () => {
    try {
      const { data } = await getComments(postId)
      setComments(data)
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!guestName.trim() || !message.trim()) {
      setError('Name and message are required')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      const { data } = await addComment(postId, { guestName: guestName.trim(), message: message.trim() })
      setComments([data, ...comments])
      setGuestName('')
      setMessage('')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post comment')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this comment?')) return
    try {
      await deleteComment(id)
      setComments(comments.filter((c) => c._id !== id))
    } catch {
      // silent
    }
  }

  return (
    <section className="mt-12">
      <h3 className="flex items-center gap-2 text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">
        <MessageCircle size={20} className="text-primary-500" />
        Comments ({comments.length})
      </h3>

      {/* Comment form */}
      <form onSubmit={handleSubmit} className="card p-5 mb-8">
        <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-4">Leave a comment</h4>
        {error && <p className="text-sm text-red-500 mb-3">{error}</p>}
        <input
          type="text"
          placeholder="Your name"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          className="input mb-3"
          maxLength={60}
        />
        <textarea
          placeholder="Share your thoughts..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          className="input resize-none mb-3"
          maxLength={1000}
        />
        <div className="flex justify-end">
          <button type="submit" disabled={submitting} className="btn-primary">
            <Send size={15} /> {submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </div>
      </form>

      {/* Comment list */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="card p-4">
              <div className="skeleton h-4 w-24 rounded mb-2" />
              <div className="skeleton h-4 w-full rounded" />
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <p className="text-center text-zinc-400 dark:text-zinc-500 text-sm py-8">No comments yet. Be the first!</p>
      ) : (
        <div className="space-y-4">
          {comments.map((c) => (
            <div key={c._id} className="card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center text-primary-600 dark:text-primary-400 font-semibold text-sm shrink-0">
                    {c.guestName[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{c.guestName}</p>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500">{timeAgo(c.createdAt)}</p>
                  </div>
                </div>
                {user && (
                  <button onClick={() => handleDelete(c._id)} className="btn-ghost p-1.5 rounded-lg text-red-400 hover:text-red-500">
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
              <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{c.message}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
