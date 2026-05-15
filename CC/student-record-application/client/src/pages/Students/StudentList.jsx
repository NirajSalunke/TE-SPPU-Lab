import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios.js';
import toast from 'react-hot-toast';
import DataTable from '../../components/common/DataTable.jsx';
import AvatarImg from '../../components/common/AvatarImg.jsx';
import { StatusBadge } from '../../components/common/Badge.jsx';
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { formatDate, SEMESTERS } from '../../utils/formatters.js';

export default function StudentList() {
  const { isAdmin } = useAuth();
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const LIMIT = 10;
  const [filters, setFilters] = useState({ search: '', department: '', semester: '', status: '' });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: LIMIT, ...filters };
      Object.keys(params).forEach((k) => !params[k] && delete params[k]);
      const res = await api.get('/students', { params });
      setStudents(res.data.data);
      setTotal(res.data.total);
    } catch { toast.error('Failed to load students'); }
    finally { setLoading(false); }
  }, [page, filters]);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);
  useEffect(() => { api.get('/departments').then((r) => setDepartments(r.data.data)); }, []);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/students/${deleteTarget}`);
      toast.success('Student suspended');
      setDeleteTarget(null);
      fetchStudents();
    } catch { toast.error('Failed to suspend student'); }
    finally { setDeleting(false); }
  };

  const columns = [
    {
      key: 'avatar', label: '',
      render: (s) => <AvatarImg seed={s.avatarSeed} size="sm" />,
    },
    {
      key: 'name', label: 'Student',
      render: (s) => (
        <div>
          <Link to={`/students/${s._id}`} className="font-semibold text-primary-700 hover:underline">
            {s.firstName} {s.lastName}
          </Link>
          <p className="text-xs text-slate-400">{s.studentId}</p>
        </div>
      ),
    },
    { key: 'email', label: 'Email', render: (s) => <span className="text-slate-500">{s.email}</span> },
    { key: 'department', label: 'Department', render: (s) => <span className="font-medium">{s.department?.name || '—'}</span> },
    { key: 'semester', label: 'Sem', render: (s) => <span className="font-medium">{s.semester}</span> },
    { key: 'status', label: 'Status', render: (s) => <StatusBadge status={s.status} /> },
    { key: 'createdAt', label: 'Joined', render: (s) => <span className="text-slate-400">{formatDate(s.createdAt)}</span> },
    {
      key: 'actions', label: '',
      render: (s) => (
        <div className="flex items-center gap-1">
          <Link to={`/students/${s._id}`} className="btn-ghost btn-sm px-2 py-1">View</Link>
          {isAdmin && <Link to={`/students/${s._id}/edit`} className="btn-ghost btn-sm px-2 py-1">Edit</Link>}
          {isAdmin && <button onClick={() => setDeleteTarget(s._id)} className="btn-ghost btn-sm px-2 py-1 text-red-500 hover:bg-red-50">Suspend</button>}
        </div>
      ),
    },
  ];

  const pages = Math.ceil(total / LIMIT);

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Students</h1>
          <p className="page-subtitle">{total} total students</p>
        </div>
        {isAdmin && <Link to="/students/new" className="btn-primary" id="add-student-btn">+ Add Student</Link>}
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <input
            className="input"
            placeholder="Search by name, ID or email..."
            value={filters.search}
            onChange={(e) => { setFilters((f) => ({ ...f, search: e.target.value })); setPage(1); }}
            id="search-input"
          />
          <select className="select" value={filters.department} onChange={(e) => { setFilters((f) => ({ ...f, department: e.target.value })); setPage(1); }}>
            <option value="">All Departments</option>
            {departments.map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}
          </select>
          <select className="select" value={filters.semester} onChange={(e) => { setFilters((f) => ({ ...f, semester: e.target.value })); setPage(1); }}>
            <option value="">All Semesters</option>
            {SEMESTERS.map((s) => <option key={s} value={s}>Semester {s}</option>)}
          </select>
          <select className="select" value={filters.status} onChange={(e) => { setFilters((f) => ({ ...f, status: e.target.value })); setPage(1); }}>
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="alumni">Alumni</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      <div className="card">
        <DataTable columns={columns} data={students} loading={loading} emptyMessage="No students found" />
        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
            <p className="text-xs text-slate-500">Page {page} of {pages}</p>
            <div className="flex gap-2">
              <button className="btn-secondary btn-sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>← Prev</button>
              <button className="btn-secondary btn-sm" disabled={page === pages} onClick={() => setPage((p) => p + 1)}>Next →</button>
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Suspend Student"
        message="This will mark the student as suspended. They won't be deleted from the database."
        confirmLabel="Suspend"
      />
    </div>
  );
}
