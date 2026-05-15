import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios.js';
import AvatarImg from '../../components/common/AvatarImg.jsx';
import { StatusBadge } from '../../components/common/Badge.jsx';
import DataTable from '../../components/common/DataTable.jsx';
import { formatDate, gradeColor } from '../../utils/formatters.js';
import { useAuth } from '../../context/AuthContext.jsx';

export default function StudentDetail() {
  const { id } = useParams();
  const { isAdmin } = useAuth();
  const [student, setStudent] = useState(null);
  const [enrolments, setEnrolments] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('enrolments');

  useEffect(() => {
    Promise.all([
      api.get(`/students/${id}`),
      api.get(`/students/${id}/enrolments`),
      api.get(`/students/${id}/attendance`),
    ]).then(([s, e, a]) => {
      setStudent(s.data.data);
      setEnrolments(e.data.data);
      setAttendance(a.data.data);
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="skeleton h-48 rounded-xl" />
        <div className="skeleton h-64 rounded-xl" />
      </div>
    );
  }
  if (!student) return <div className="text-center py-20 text-slate-500">Student not found</div>;

  const infoItems = [
    { label: 'Student ID', value: student.studentId },
    { label: 'Email', value: student.email },
    { label: 'Phone', value: student.phone || '—' },
    { label: 'Date of Birth', value: formatDate(student.dob) },
    { label: 'Gender', value: student.gender ? student.gender.charAt(0).toUpperCase() + student.gender.slice(1) : '—' },
    { label: 'Blood Group', value: student.bloodGroup || '—' },
    { label: 'Department', value: student.department?.name },
    { label: 'Semester', value: `Semester ${student.semester}` },
    { label: 'Enrolled At', value: formatDate(student.enrolledAt) },
    { label: 'Address', value: student.address || '—' },
    { label: 'Guardian', value: student.guardianName || '—' },
    { label: 'Guardian Phone', value: student.guardianPhone || '—' },
  ];

  const enrolColumns = [
    { key: 'course', label: 'Course', render: (e) => <div><p className="font-medium">{e.course?.title}</p><p className="text-xs text-slate-400">{e.course?.code}</p></div> },
    { key: 'semester', label: 'Sem', render: (e) => e.semester },
    { key: 'credits', label: 'Credits', render: (e) => e.course?.credits },
    { key: 'grade', label: 'Grade', render: (e) => e.grade ? <span className={`font-bold text-sm ${gradeColor(e.grade)}`}>{e.grade}</span> : <span className="text-slate-400 text-xs">Pending</span> },
    { key: 'status', label: 'Status', render: (e) => <StatusBadge status={e.status} /> },
  ];

  const attendColumns = [
    { key: 'course', label: 'Course', render: (a) => <div><p className="font-medium">{a.course?.title}</p><p className="text-xs text-slate-400">{a.course?.code}</p></div> },
    { key: 'present', label: 'Present', render: (a) => <span className="text-emerald-600 font-bold">{a.present}</span> },
    { key: 'absent', label: 'Absent', render: (a) => <span className="text-red-600 font-bold">{a.absent}</span> },
    { key: 'late', label: 'Late', render: (a) => <span className="text-amber-600 font-bold">{a.late}</span> },
    { key: 'total', label: 'Total', render: (a) => a.total },
    {
      key: 'percentage', label: 'Attendance %',
      render: (a) => (
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-slate-100 rounded-full h-1.5 w-20">
            <div className={`h-1.5 rounded-full ${parseFloat(a.percentage) >= 75 ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: `${Math.min(a.percentage, 100)}%` }} />
          </div>
          <span className={`text-xs font-bold ${parseFloat(a.percentage) >= 75 ? 'text-emerald-600' : 'text-red-600'}`}>{a.percentage}%</span>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Back + actions */}
      <div className="flex items-center justify-between">
        <Link to="/students" className="btn-ghost btn-sm">← Back to Students</Link>
        {isAdmin && <Link to={`/students/${id}/edit`} className="btn-primary btn-sm">Edit Student</Link>}
      </div>

      {/* Profile card */}
      <div className="card p-6 flex flex-col sm:flex-row gap-6">
        <div className="flex flex-col items-center gap-3 sm:w-40 shrink-0">
          <AvatarImg seed={student.avatarSeed} size="xl" />
          <StatusBadge status={student.status} />
          <p className="text-xs text-slate-400 font-mono">{student.studentId}</p>
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-900">{student.firstName} {student.lastName}</h1>
          <p className="text-slate-500 text-sm mb-4">{student.department?.name} · Semester {student.semester}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3">
            {infoItems.map((item) => (
              <div key={item.label}>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{item.label}</p>
                <p className="text-sm text-slate-800 font-medium">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="flex border-b border-slate-100 px-4">
          {['enrolments', 'attendance'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-3 text-sm font-semibold capitalize border-b-2 transition-colors ${tab === t ? 'border-primary-500 text-primary-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            >
              {t} {t === 'enrolments' ? `(${enrolments.length})` : `(${attendance.length} courses)`}
            </button>
          ))}
        </div>
        <div className="p-4">
          {tab === 'enrolments' ? (
            <DataTable columns={enrolColumns} data={enrolments} emptyMessage="No enrolments yet" />
          ) : (
            <DataTable columns={attendColumns} data={attendance} emptyMessage="No attendance records" rowKey="course._id" />
          )}
        </div>
      </div>
    </div>
  );
}
