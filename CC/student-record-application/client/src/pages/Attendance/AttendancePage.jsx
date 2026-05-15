import { useEffect, useState, useCallback } from 'react';
import api from '../../api/axios.js';
import toast from 'react-hot-toast';
import AvatarImg from '../../components/common/AvatarImg.jsx';
import { StatusBadge } from '../../components/common/Badge.jsx';
import { formatDate } from '../../utils/formatters.js';

const STATUS_OPTS = ['present', 'absent', 'late'];
const STATUS_COLORS = {
  present: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  absent: 'bg-red-100 text-red-700 border-red-200',
  late: 'bg-amber-100 text-amber-700 border-amber-200',
};

export default function AttendancePage() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [attendance, setAttendance] = useState({}); // { studentId: status }
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [historyMode, setHistoryMode] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => { api.get('/courses').then((r) => setCourses(r.data.data)); }, []);

  const loadStudents = useCallback(async () => {
    if (!selectedCourse) return;
    setLoading(true);
    try {
      // Get enrolled students for course
      const res = await api.get(`/courses/${selectedCourse}/students`);
      const students = res.data.data.map((e) => e.student);
      setEnrolledStudents(students);
      // Load existing attendance for this date
      const attRes = await api.get('/attendance', {
        params: { course: selectedCourse, startDate: selectedDate, endDate: selectedDate },
      });
      const existing = {};
      attRes.data.data.forEach((a) => { existing[a.student._id] = a.status; });
      const initial = {};
      students.forEach((s) => { initial[s._id] = existing[s._id] || 'present'; });
      setAttendance(initial);
    } catch { toast.error('Failed to load students for course'); }
    finally { setLoading(false); }
  }, [selectedCourse, selectedDate]);

  useEffect(() => { if (!historyMode) loadStudents(); }, [loadStudents, historyMode]);

  const loadHistory = useCallback(async () => {
    if (!selectedCourse) return;
    setLoading(true);
    try {
      const endDate = new Date().toISOString().slice(0, 10);
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
      const res = await api.get('/attendance', { params: { course: selectedCourse, startDate, endDate } });
      setHistory(res.data.data);
    } catch { toast.error('Failed to load history'); }
    finally { setLoading(false); }
  }, [selectedCourse]);

  useEffect(() => { if (historyMode) loadHistory(); }, [historyMode, loadHistory]);

  const toggleStatus = (studentId) => {
    setAttendance((prev) => {
      const idx = STATUS_OPTS.indexOf(prev[studentId]);
      return { ...prev, [studentId]: STATUS_OPTS[(idx + 1) % STATUS_OPTS.length] };
    });
  };

  const markAll = (status) => {
    const updated = {};
    enrolledStudents.forEach((s) => { updated[s._id] = status; });
    setAttendance(updated);
  };

  const handleSubmit = async () => {
    if (!selectedCourse) { toast.error('Select a course first'); return; }
    setSubmitting(true);
    try {
      const records = enrolledStudents.map((s) => ({
        student: s._id,
        course: selectedCourse,
        date: selectedDate,
        status: attendance[s._id] || 'present',
      }));
      await api.post('/attendance', { records });
      toast.success(`Attendance saved for ${records.length} students!`);
    } catch { toast.error('Failed to save attendance'); }
    finally { setSubmitting(false); }
  };

  const present = Object.values(attendance).filter((v) => v === 'present').length;
  const absent = Object.values(attendance).filter((v) => v === 'absent').length;
  const late = Object.values(attendance).filter((v) => v === 'late').length;

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="page-title">Attendance</h1>
        <p className="page-subtitle">Mark and review student attendance by course</p>
      </div>

      {/* Controls */}
      <div className="card p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <select className="select" value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} id="course-select">
          <option value="">Select Course...</option>
          {courses.map((c) => <option key={c._id} value={c._id}>{c.title} ({c.code})</option>)}
        </select>
        <input type="date" className="input" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} id="date-input" />
        <div className="flex gap-2">
          <button
            className={`btn flex-1 ${!historyMode ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setHistoryMode(false)}
          >Mark</button>
          <button
            className={`btn flex-1 ${historyMode ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setHistoryMode(true)}
          >History</button>
        </div>
      </div>

      {!historyMode ? (
        <>
          {/* Summary + bulk actions */}
          {enrolledStudents.length > 0 && (
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex gap-3 text-sm font-medium">
                <span className="text-emerald-600">✅ Present: {present}</span>
                <span className="text-red-600">❌ Absent: {absent}</span>
                <span className="text-amber-600">⏰ Late: {late}</span>
              </div>
              <div className="flex gap-2 ml-auto">
                <button onClick={() => markAll('present')} className="btn-secondary btn-sm">All Present</button>
                <button onClick={() => markAll('absent')} className="btn-secondary btn-sm">All Absent</button>
              </div>
            </div>
          )}

          {/* Student list */}
          {loading ? (
            <div className="card divide-y divide-slate-50">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3">
                  <div className="skeleton w-9 h-9 rounded-full" />
                  <div className="flex-1 space-y-1.5"><div className="skeleton h-3 w-32 rounded" /><div className="skeleton h-2.5 w-20 rounded" /></div>
                  <div className="skeleton h-7 w-20 rounded-lg" />
                </div>
              ))}
            </div>
          ) : !selectedCourse ? (
            <div className="card flex flex-col items-center py-20 gap-3 text-slate-400">
              <span className="text-5xl">📋</span>
              <p className="font-medium">Select a course to mark attendance</p>
            </div>
          ) : enrolledStudents.length === 0 ? (
            <div className="card flex flex-col items-center py-20 gap-3 text-slate-400">
              <span className="text-5xl">📭</span>
              <p className="font-medium">No students enrolled in this course</p>
            </div>
          ) : (
            <div className="card divide-y divide-slate-50">
              {enrolledStudents.map((student) => {
                const status = attendance[student._id] || 'present';
                return (
                  <div key={student._id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors">
                    <AvatarImg seed={student.avatarSeed} size="md" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{student.firstName} {student.lastName}</p>
                      <p className="text-xs text-slate-400">{student.studentId}</p>
                    </div>
                    <button
                      onClick={() => toggleStatus(student._id)}
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 min-w-[80px] text-center ${STATUS_COLORS[status]}`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {enrolledStudents.length > 0 && (
            <div className="flex justify-end">
              <button onClick={handleSubmit} disabled={submitting} className="btn-primary px-8" id="save-attendance-btn">
                {submitting ? 'Saving...' : `Save Attendance (${formatDate(selectedDate)})`}
              </button>
            </div>
          )}
        </>
      ) : (
        /* History view */
        <div className="card">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-800">Last 30 Days — {courses.find((c) => c._id === selectedCourse)?.title || 'All Courses'}</h2>
          </div>
          {loading ? (
            <div className="p-5 space-y-3">
              {[...Array(8)].map((_, i) => <div key={i} className="skeleton h-10 rounded" />)}
            </div>
          ) : history.length === 0 ? (
            <div className="flex flex-col items-center py-20 gap-3 text-slate-400">
              <span className="text-5xl">📭</span>
              <p className="font-medium">No attendance records found</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50 max-h-[600px] overflow-y-auto">
              {history.map((rec) => (
                <div key={rec._id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50">
                  <AvatarImg seed={rec.student?.avatarSeed} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{rec.student?.firstName} {rec.student?.lastName}</p>
                    <p className="text-xs text-slate-400">{rec.course?.code} · {formatDate(rec.date)}</p>
                  </div>
                  <StatusBadge status={rec.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
