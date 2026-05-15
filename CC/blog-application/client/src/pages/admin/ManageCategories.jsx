import { useEffect, useState } from 'react'
import { PlusCircle, Pencil, Trash2, FolderOpen } from 'lucide-react'
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../api/categories'

export default function ManageCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: '', description: '' })
  const [editing, setEditing] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { fetchCategories() }, [])

  const fetchCategories = async () => {
    try {
      const { data } = await getCategories()
      setCategories(data)
    } catch { /* silent */ }
    finally { setLoading(false) }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) { setError('Name is required'); return }
    setSubmitting(true); setError('')
    try {
      if (editing) {
        const { data } = await updateCategory(editing._id, form)
        setCategories(categories.map(c => c._id === editing._id ? data : c))
        setEditing(null)
      } else {
        const { data } = await createCategory(form)
        setCategories([...categories, data])
      }
      setForm({ name: '', description: '' })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save category')
    } finally { setSubmitting(false) }
  }

  const handleEdit = (cat) => {
    setEditing(cat)
    setForm({ name: cat.name, description: cat.description || '' })
  }

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete category "${name}"? Posts in this category won't be deleted.`)) return
    try {
      await deleteCategory(id)
      setCategories(categories.filter(c => c._id !== id))
    } catch { alert('Failed to delete') }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">Categories</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form */}
        <div className="card p-5">
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
            {editing ? 'Edit Category' : 'New Category'}
          </h2>
          {error && <p className="text-sm text-red-500 mb-3">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Name *</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input" placeholder="e.g. Technology" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Description</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="input resize-none" rows={2} placeholder="Optional description..." />
            </div>
            <div className="flex gap-2 pt-1">
              {editing && (
                <button type="button" onClick={() => { setEditing(null); setForm({ name: '', description: '' }) }} className="btn-outline">Cancel</button>
              )}
              <button type="submit" disabled={submitting} className="btn-primary flex-1 justify-center">
                <PlusCircle size={14} /> {submitting ? 'Saving...' : (editing ? 'Update' : 'Add Category')}
              </button>
            </div>
          </form>
        </div>

        {/* List */}
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800 font-semibold text-zinc-900 dark:text-zinc-100">
            All Categories ({categories.length})
          </div>
          {loading ? (
            <div className="p-5 space-y-3">
              {[1,2,3].map(i => <div key={i} className="skeleton h-10 rounded-xl" />)}
            </div>
          ) : categories.length === 0 ? (
            <p className="py-10 text-center text-sm text-zinc-400">No categories yet.</p>
          ) : (
            <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {categories.map(cat => (
                <li key={cat._id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{cat.name}</p>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500">/{cat.slug}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleEdit(cat)} className="btn-ghost p-1.5 rounded-lg text-zinc-400 hover:text-primary-500">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => handleDelete(cat._id, cat.name)} className="btn-ghost p-1.5 rounded-lg text-zinc-400 hover:text-red-500">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
