import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios.js';
import toast from 'react-hot-toast';
import DataTable from '../../components/common/DataTable.jsx';
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export default function DepartmentList() {
  const { isAdmin } = useAuth();
  const [depts, setDepts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchDepts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/departments');
      setDepts(res.data.data);
    } catch { toast.error('Failed to load departments'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchDepts(); }, [fetchDepts]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/departments/${deleteTarget}`);
      toast.success('Department deleted');
      setDeleteTarget(null);
      fetchDepts();
    } catch { toast.error('Failed to delete department'); }
    finally { setDeleting(false); }
  };

  const columns = [
    { key: 'code', label: 'Code', render: (d) => <span className="font-mono text-xs font-bold text-primary-700 bg-primary-50 px-2 py-0.5 rounded">{d.code}</span> },
    { key: 'name', label: 'Department', render: (d) => <div><p className="font-semibold">{d.name}</p><p className="text-xs text-slate-400">{d.description?.slice(0, 60)}</p></div> },
    { key: 'hodName', label: 'Head of Dept.', render: (d) => d.hodName || '—' },
    { key: 'courseCount', label: 'Courses', render: (d) => <span className="font-bold text-primary-600">{d.courseCount}</span> },
    { key: 'studentCount', label: 'Students', render: (d) => <span className="font-bold text-emerald-600">{d.studentCount}</span> },
    {
      key: 'actions', label: '',
      render: (d) => (
        <div className="flex gap-1">
          {isAdmin && <Link to={`/departments/${d._id}/edit`} className="btn-ghost btn-sm px-2 py-1">Edit</Link>}
          {isAdmin && <button onClick={() => setDeleteTarget(d._id)} className="btn-ghost btn-sm px-2 py-1 text-red-500 hover:bg-red-50">Delete</button>}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Departments</h1>
          <p className="page-subtitle">{depts.length} academic departments</p>
        </div>
        {isAdmin && <Link to="/departments/new" className="btn-primary" id="add-dept-btn">+ Add Department</Link>}
      </div>
      <div className="card">
        <DataTable columns={columns} data={depts} loading={loading} emptyMessage="No departments found" />
      </div>
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Department"
        message="This will permanently delete the department. Ensure no students or courses are assigned to it first."
        confirmLabel="Delete"
      />
    </div>
  );
}
