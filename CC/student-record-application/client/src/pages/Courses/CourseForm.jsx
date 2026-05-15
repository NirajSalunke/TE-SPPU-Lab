import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../../api/axios.js';
import toast from 'react-hot-toast';
import { SEMESTERS } from '../../utils/formatters.js';

const EMPTY = { title: '', code: '', department: '', faculty: '', credits: 3, semester: 1, description: '' };

export default function CourseForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [form, setForm] = useState(EMPTY);
  const [departments, setDepartments] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get('/departments'),
      api.get('/auth/me').then(() => api.get('/students')).catch(() => ({ data: { data: [] } })),
    ]).then(([d]) => setDepartments(d.data.data));

    // Load faculty users via students endpoint — actually load users separately via auth or hardcode
    // We'll get faculty from enrolments workaround: load departments and get faculty from courses
    api.get('/courses').then((r) => {
      const facultySet = new Map();
      r.data.data.forEach((c) => { if (c.faculty) facultySet.set(c.faculty._id, c.faculty); });
      setFaculty([...facultySet.values()]);
    });

    if (isEdit) {
      api.get(`/courses/${id}/students`).catch(() => {});
      api.get('/courses').then((r) => {
        const c = r.data.data.find((x) => x._id === id);
        if (c) setForm({
          title: c.title, code: c.code, department: c.department?._id || '',
          faculty: c.faculty?._id || '', credits: c.credits, semester: c.semester,
          description: c.description || '',
        });
      });
    }
  }, [id, isEdit]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) { await api.put(`/courses/${id}`, form); toast.success('Course updated!'); }
      else { await api.post('/courses', form); toast.success('Course created!'); }
      navigate('/courses');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save course');
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">{isEdit ? 'Edit Course' : 'Add New Course'}</h1>
          <p className="page-subtitle">{isEdit ? 'Update course details' : 'Create a new course offering'}</p>
        </div>
        <Link to="/courses" className="btn-secondary btn-sm">Cancel</Link>
      </div>
      <form onSubmit={handleSubmit} className="card p-6 space-y-4" id="course-form">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Course Title <span className="text-red-400">*</span></label>
            <input className="input" value={form.title} onChange={set('title')} required placeholder="e.g. Data Structures" />
          </div>
          <div>
            <label className="label">Course Code <span className="text-red-400">*</span></label>
            <input className="input uppercase" value={form.code} onChange={set('code')} required placeholder="e.g. CS101" />
          </div>
          <div>
            <label className="label">Department <span className="text-red-400">*</span></label>
            <select className="select" value={form.department} onChange={set('department')} required>
              <option value="">Select Department...</option>
              {departments.map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Faculty</label>
            <select className="select" value={form.faculty} onChange={set('faculty')}>
              <option value="">TBA / Unassigned</option>
              {faculty.map((f) => <option key={f._id} value={f._id}>{f.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Credits <span className="text-red-400">*</span></label>
            <input className="input" type="number" min={1} max={6} value={form.credits} onChange={set('credits')} required />
          </div>
          <div>
            <label className="label">Semester <span className="text-red-400">*</span></label>
            <select className="select" value={form.semester} onChange={set('semester')} required>
              {SEMESTERS.map((s) => <option key={s} value={s}>Semester {s}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="label">Description</label>
          <textarea className="input resize-none" rows={3} value={form.description} onChange={set('description')} placeholder="Brief course description..." />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Link to="/courses" className="btn-secondary">Cancel</Link>
          <button type="submit" className="btn-primary" disabled={loading} id="submit-btn">
            {loading ? 'Saving...' : isEdit ? 'Update Course' : 'Create Course'}
          </button>
        </div>
      </form>
    </div>
  );
}
