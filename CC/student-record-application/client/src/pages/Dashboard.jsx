import { useEffect, useState } from 'react';
import api from '../api/axios.js';
import StatCard from '../components/common/StatCard.jsx';
import EnrolmentBarChart from '../components/charts/EnrolmentBarChart.jsx';
import GradePieChart from '../components/charts/GradePieChart.jsx';
import AvatarImg from '../components/common/AvatarImg.jsx';
import { StatusBadge } from '../components/common/Badge.jsx';
import { formatDate } from '../utils/formatters.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [enrolByDept, setEnrolByDept] = useState([]);
  const [gradeDist, setGradeDist] = useState([]);
  const [recentStudents, setRecentStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/dashboard/stats'),
      api.get('/dashboard/enrolments-by-dept'),
      api.get('/dashboard/grade-distribution'),
      api.get('/dashboard/recent-students'),
    ])
      .then(([s, e, g, r]) => {
        setStats(s.data.data);
        setEnrolByDept(e.data.data.map((d) => ({ name: d.name, count: d.count })));
        setGradeDist(g.data.data);
        setRecentStudents(r.data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome */}
      <div>
        <h1 className="page-title">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
        <p className="page-subtitle">Here's what's happening in your institution today.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Active Students" value={stats?.totalStudents} icon="🎓" color="indigo" loading={loading} subtitle="Currently enrolled" />
        <StatCard title="Total Courses" value={stats?.totalCourses} icon="📚" color="emerald" loading={loading} subtitle="Across all departments" />
        <StatCard title="Departments" value={stats?.totalDepartments} icon="🏛️" color="violet" loading={loading} subtitle="Academic departments" />
        <StatCard title="Active Enrolments" value={stats?.activeEnrolments} icon="📝" color="amber" loading={loading} subtitle="Current semester" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="card p-5 lg:col-span-3">
          <h2 className="text-sm font-bold text-slate-800 mb-4">Enrolments by Department</h2>
          {loading ? <div className="skeleton h-56 rounded-lg" /> : <EnrolmentBarChart data={enrolByDept} />}
        </div>
        <div className="card p-5 lg:col-span-2">
          <h2 className="text-sm font-bold text-slate-800 mb-4">Grade Distribution</h2>
          {loading ? <div className="skeleton h-56 rounded-lg" /> : <GradePieChart data={gradeDist} />}
        </div>
      </div>

      {/* Recent students */}
      <div className="card">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800">Recently Added Students</h2>
          <a href="/students" className="text-xs text-primary-600 font-semibold hover:underline">View all →</a>
        </div>
        <div className="divide-y divide-slate-50">
          {loading
            ? [...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3">
                  <div className="skeleton w-9 h-9 rounded-full" />
                  <div className="flex-1 space-y-1.5">
                    <div className="skeleton h-3 w-32 rounded" />
                    <div className="skeleton h-2.5 w-20 rounded" />
                  </div>
                </div>
              ))
            : recentStudents.map((s) => (
                <div key={s._id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors">
                  <AvatarImg seed={s.avatarSeed} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{s.firstName} {s.lastName}</p>
                    <p className="text-xs text-slate-400">{s.department?.name} · Sem {s.semester}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <StatusBadge status={s.status} />
                    <span className="text-xs text-slate-400 hidden sm:inline">{formatDate(s.createdAt)}</span>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}
