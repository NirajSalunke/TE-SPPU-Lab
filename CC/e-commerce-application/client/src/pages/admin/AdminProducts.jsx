import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, ArrowLeft, X, Check } from 'lucide-react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../services/productService';
import { formatCurrency } from '../../utils/formatCurrency';
import { PageSpinner } from '../../components/ui/Spinner';

const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home & Kitchen', 'Sports', 'Beauty', 'Other'];
const EMPTY_FORM = { title: '', description: '', price: '', discountedPrice: '', category: 'Electronics', brand: '', stock: '', images: '', featured: false, rating: 0 };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState(1);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await getProducts({ page, limit: 15 });
      setProducts(data.products);
      setTotal(data.total);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, [page]);

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setShowModal(true); };
  const openEdit = (p) => {
    setEditing(p._id);
    setForm({ ...p, images: p.images?.join(', ') || '', discountedPrice: p.discountedPrice || '' });
    setShowModal(true);
  };

  const handleChange = (k) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [k]: val }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        discountedPrice: form.discountedPrice ? Number(form.discountedPrice) : null,
        stock: Number(form.stock),
        rating: Number(form.rating) || 0,
        images: form.images ? form.images.split(',').map((s) => s.trim()).filter(Boolean) : [],
      };
      if (editing) await updateProduct(editing, payload);
      else await createProduct(payload);
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Save failed');
    }
    setSaving(false);
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try {
      await deleteProduct(id);
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="container-custom py-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/admin" className="btn-ghost p-2"><ArrowLeft className="w-4 h-4" /></Link>
        <div className="flex-1">
          <h1 className="page-title">Products</h1>
          <p className="text-gray-500 text-sm">{total} products total</p>
        </div>
        <button onClick={openCreate} className="btn-primary gap-2">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {loading ? <PageSpinner /> : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Product</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Price</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Stock</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Featured</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={p.images?.[0] || `https://picsum.photos/seed/${p._id}/40/40`} alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                        <div>
                          <p className="font-medium text-gray-900 line-clamp-1 max-w-xs">{p.title}</p>
                          <p className="text-xs text-gray-500">{p.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><span className="badge-gray">{p.category}</span></td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-semibold">{formatCurrency(p.discountedPrice || p.price)}</p>
                        {p.discountedPrice && <p className="text-xs text-gray-400 line-through">{formatCurrency(p.price)}</p>}
                      </div>
                    </td>
                    <td className="px-4 py-3"><span className={p.stock > 0 ? 'text-emerald-600 font-medium' : 'text-red-500 font-medium'}>{p.stock}</span></td>
                    <td className="px-4 py-3">{p.featured ? <Check className="w-4 h-4 text-emerald-600" /> : <X className="w-4 h-4 text-gray-300" />}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(p)} className="p-1.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(p._id, p.title)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">{editing ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div>
                <label className="label">Title *</label>
                <input className="input" value={form.title} onChange={handleChange('title')} required placeholder="Product title" />
              </div>
              <div>
                <label className="label">Description *</label>
                <textarea className="input" rows={3} value={form.description} onChange={handleChange('description')} required placeholder="Product description" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Price (₹) *</label>
                  <input className="input" type="number" value={form.price} onChange={handleChange('price')} required min="0" placeholder="1999" />
                </div>
                <div>
                  <label className="label">Discounted Price (₹)</label>
                  <input className="input" type="number" value={form.discountedPrice} onChange={handleChange('discountedPrice')} min="0" placeholder="Optional" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Category *</label>
                  <select className="input" value={form.category} onChange={handleChange('category')}>
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Brand</label>
                  <input className="input" value={form.brand} onChange={handleChange('brand')} placeholder="Brand name" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Stock *</label>
                  <input className="input" type="number" value={form.stock} onChange={handleChange('stock')} required min="0" placeholder="100" />
                </div>
                <div>
                  <label className="label">Rating (0-5)</label>
                  <input className="input" type="number" value={form.rating} onChange={handleChange('rating')} min="0" max="5" step="0.1" placeholder="4.5" />
                </div>
              </div>
              <div>
                <label className="label">Image URLs (comma-separated)</label>
                <input className="input" value={form.images} onChange={handleChange('images')} placeholder="https://picsum.photos/seed/xyz/600/600, ..." />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="featured" checked={form.featured} onChange={handleChange('featured')} className="w-4 h-4 accent-primary-600" />
                <label htmlFor="featured" className="text-sm font-medium text-gray-700">Mark as Featured</label>
              </div>
              <div className="flex gap-3 pt-2 border-t border-gray-100">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center">
                  {saving ? 'Saving...' : editing ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
