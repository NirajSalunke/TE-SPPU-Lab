import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../../api/axios.js';
import toast from 'react-hot-toast';

const EMPTY = { name: '', code: '', hodName: '', description: '' };

export default function DepartmentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      api.get('/departments').then((r) => {
        const d = r.data.data.find((x) => x._id === id);
        if (d) setForm({ name: d.name, code: d.code, hodName: d.hodName || '', description: d.description || '' });
      });
    }
  }, [id, isEdit]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) { await api.put(`/departments/${id}`, form); toast.success('Department updated!'); }
      else { await api.post('/departments', form); toast.success('Department created!'); }
      navigate('/departments');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save department');
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-xl space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">{isEdit ? 'Edit Department' : 'Add Department'}</h1>
          <p className="page-subtitle">{isEdit ? 'Update department information' : 'Create a new academic department'}</p>
        </div>
        <Link to="/departments" className="btn-secondary btn-sm">Cancel</Link>
      </div>
      <form onSubmit={handleSubmit} className="card p-6 space-y-4" id="dept-form">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Department Name <span className="text-red-400">*</span></label>
            <input className="input" value={form.name} onChange={set('name')} required placeholder="e.g. Computer Science" />
          </div>
          <div>
            <label className="label">Code <span className="text-red-400">*</span></label>
            <input className="input uppercase" value={form.code} onChange={set('code')} required placeholder="e.g. CS" maxLength={10} />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Head of Department</label>
            <input className="input" value={form.hodName} onChange={set('hodName')} placeholder="Dr. Full Name" />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Description</label>
            <textarea className="input resize-none" rows={3} value={form.description} onChange={set('description')} placeholder="Brief department overview..." />
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Link to="/departments" className="btn-secondary">Cancel</Link>
          <button type="submit" className="btn-primary" disabled={loading} id="submit-btn">
            {loading ? 'Saving...' : isEdit ? 'Update Department' : 'Create Department'}
          </button>
        </div>
      </form>
    </div>
  );
}
