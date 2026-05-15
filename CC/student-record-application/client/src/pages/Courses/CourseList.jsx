import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios.js';
import toast from 'react-hot-toast';
import DataTable from '../../components/common/DataTable.jsx';
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export default function CourseList() {
  const { isAdmin } = useAuth();
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deptFilter, setDeptFilter] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const params = deptFilter ? { department: deptFilter } : {};
      const res = await api.get('/courses', { params });
      setCourses(res.data.data);
    } catch { toast.error('Failed to load courses'); }
    finally { setLoading(false); }
  }, [deptFilter]);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);
  useEffect(() => { api.get('/departments').then((r) => setDepartments(r.data.data)); }, []);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/courses/${deleteTarget}`);
      toast.success('Course deleted');
      setDeleteTarget(null);
      fetchCourses();
    } catch { toast.error('Failed to delete course'); }
    finally { setDeleting(false); }
  };

  const columns = [
    { key: 'code', label: 'Code', render: (c) => <span className="font-mono text-xs font-bold text-primary-700 bg-primary-50 px-2 py-0.5 rounded">{c.code}</span> },
    { key: 'title', label: 'Course', render: (c) => <div><p className="font-semibold">{c.title}</p><p className="text-xs text-slate-400">{c.description?.slice(0, 60)}...</p></div> },
    { key: 'department', label: 'Department', render: (c) => c.department?.name || '—' },
    { key: 'faculty', label: 'Faculty', render: (c) => <span className="text-slate-600">{c.faculty?.name || 'TBA'}</span> },
    { key: 'credits', label: 'Credits', render: (c) => <span className="font-bold">{c.credits}</span> },
    { key: 'semester', label: 'Sem', render: (c) => <span className="font-medium">{c.semester}</span> },
    {
      key: 'actions', label: '',
      render: (c) => (
        <div className="flex gap-1">
          {isAdmin && <Link to={`/courses/${c._id}/edit`} className="btn-ghost btn-sm px-2 py-1">Edit</Link>}
          {isAdmin && <button onClick={() => setDeleteTarget(c._id)} className="btn-ghost btn-sm px-2 py-1 text-red-500 hover:bg-red-50">Delete</button>}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Courses</h1>
          <p className="page-subtitle">{courses.length} courses</p>
        </div>
        {isAdmin && <Link to="/courses/new" className="btn-primary" id="add-course-btn">+ Add Course</Link>}
      </div>
      <div className="card p-4">
        <select className="select max-w-xs" value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}>
          <option value="">All Departments</option>
          {departments.map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}
        </select>
      </div>
      <div className="card">
        <DataTable columns={columns} data={courses} loading={loading} emptyMessage="No courses found" />
      </div>
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Course"
        message="This will permanently delete the course. This action cannot be undone."
        confirmLabel="Delete Course"
      />
    </div>
  );
}
