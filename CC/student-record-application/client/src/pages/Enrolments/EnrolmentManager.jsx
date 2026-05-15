import { useEffect, useState, useCallback } from 'react';
import api from '../../api/axios.js';
import toast from 'react-hot-toast';
import DataTable from '../../components/common/DataTable.jsx';
import AvatarImg from '../../components/common/AvatarImg.jsx';
import { StatusBadge } from '../../components/common/Badge.jsx';
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { GRADE_OPTIONS, GRADE_POINTS, academicYears, SEMESTERS } from '../../utils/formatters.js';

export default function EnrolmentManager() {
  const { isAdmin } = useAuth();
  const [enrolments, setEnrolments] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ student: '', course: '', semester: 1, academicYear: academicYears()[0] });
  const [submitting, setSubmitting] = useState(false);
  const [dropTarget, setDropTarget] = useState(null);
  const [dropping, setDropping] = useState(false);

  const fetchEnrolments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/enrolments');
      setEnrolments(res.data.data);
    } catch { toast.error('Failed to load enrolments'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    fetchEnrolments();
    api.get('/students', { params: { limit: 200, status: 'active' } }).then((r) => setStudents(r.data.data));
    api.get('/courses').then((r) => setCourses(r.data.data));
  }, [fetchEnrolments]);

  const handleEnrol = async (e) => {
    e.preventDefault();
    if (!form.student || !form.course) { toast.error('Select a student and course'); return; }
    setSubmitting(true);
    try {
      await api.post('/enrolments', form);
      toast.success('Student enrolled!');
      setForm((f) => ({ ...f, student: '', course: '' }));
      fetchEnrolments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to enrol');
    } finally { setSubmitting(false); }
  };

  const handleGradeChange = async (enrolmentId, grade) => {
    try {
      await api.put(`/enrolments/${enrolmentId}/grade`, { grade, gradePoints: GRADE_POINTS[grade] });
      toast.success('Grade assigned!');
      fetchEnrolments();
    } catch { toast.error('Failed to assign grade'); }
  };

  const handleDrop = async () => {
    setDropping(true);
    try {
      await api.put(`/enrolments/${dropTarget}/drop`);
      toast.success('Enrolment dropped');
      setDropTarget(null);
      fetchEnrolments();
    } catch { toast.error('Failed to drop enrolment'); }
    finally { setDropping(false); }
  };

  const columns = [
    {
      key: 'student', label: 'Student',
      render: (e) => (
        <div className="flex items-center gap-2">
          <AvatarImg seed={e.student?.avatarSeed} size="sm" />
          <div>
            <p className="font-semibold text-sm">{e.student?.firstName} {e.student?.lastName}</p>
            <p className="text-xs text-slate-400">{e.student?.studentId}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'course', label: 'Course',
      render: (e) => (
        <div>
          <p className="font-medium">{e.course?.title}</p>
          <p className="text-xs text-slate-400">{e.course?.code} · {e.course?.department?.name}</p>
        </div>
      ),
    },
    { key: 'semester', label: 'Sem', render: (e) => e.semester },
    { key: 'academicYear', label: 'Year', render: (e) => e.academicYear },
    {
      key: 'grade', label: 'Grade',
      render: (e) => (
        <select
          className="text-xs border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-400"
          value={e.grade || ''}
          onChange={(ev) => handleGradeChange(e._id, ev.target.value)}
        >
          <option value="">Pending</option>
          {GRADE_OPTIONS.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
      ),
    },
    { key: 'status', label: 'Status', render: (e) => <StatusBadge status={e.status} /> },
    {
      key: 'actions', label: '',
      render: (e) => isAdmin && e.status === 'active' ? (
        <button onClick={() => setDropTarget(e._id)} className="btn-ghost btn-sm px-2 py-1 text-red-500 hover:bg-red-50">Drop</button>
      ) : null,
    },
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="page-title">Enrolment Manager</h1>
        <p className="page-subtitle">Manage student course enrolments and grades</p>
      </div>

      {/* Enrol form */}
      {isAdmin && (
        <div className="card p-5">
          <h2 className="text-sm font-bold text-slate-800 mb-4">Enrol Student in Course</h2>
          <form onSubmit={handleEnrol} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3" id="enrol-form">
            <select className="select" value={form.student} onChange={(e) => setForm((f) => ({ ...f, student: e.target.value }))} required>
              <option value="">Select Student...</option>
              {students.map((s) => <option key={s._id} value={s._id}>{s.firstName} {s.lastName} ({s.studentId})</option>)}
            </select>
            <select className="select" value={form.course} onChange={(e) => setForm((f) => ({ ...f, course: e.target.value }))} required>
              <option value="">Select Course...</option>
              {courses.map((c) => <option key={c._id} value={c._id}>{c.title} ({c.code})</option>)}
            </select>
            <select className="select" value={form.semester} onChange={(e) => setForm((f) => ({ ...f, semester: Number(e.target.value) }))}>
              {SEMESTERS.map((s) => <option key={s} value={s}>Semester {s}</option>)}
            </select>
            <select className="select" value={form.academicYear} onChange={(e) => setForm((f) => ({ ...f, academicYear: e.target.value }))}>
              {academicYears().map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
            <button type="submit" className="btn-primary" disabled={submitting} id="enrol-btn">
              {submitting ? 'Enrolling...' : '+ Enrol'}
            </button>
          </form>
        </div>
      )}

      <div className="card">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-800">All Enrolments ({enrolments.length})</h2>
        </div>
        <DataTable columns={columns} data={enrolments} loading={loading} emptyMessage="No enrolments found" />
      </div>

      <ConfirmDialog
        open={!!dropTarget}
        onClose={() => setDropTarget(null)}
        onConfirm={handleDrop}
        loading={dropping}
        title="Drop Enrolment"
        message="This will change the enrolment status to 'dropped'. The student will no longer be active in this course."
        confirmLabel="Drop Enrolment"
      />
    </div>
  );
}
