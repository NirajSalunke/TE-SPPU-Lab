export default function StatCard({ title, value, icon, color = 'indigo', loading = false, subtitle }) {
  const colorMap = {
    indigo: 'from-indigo-500 to-indigo-600',
    emerald: 'from-emerald-500 to-emerald-600',
    violet: 'from-violet-500 to-violet-600',
    amber: 'from-amber-500 to-amber-600',
    blue: 'from-blue-500 to-blue-600',
    rose: 'from-rose-500 to-rose-600',
  };
  const bgMap = {
    indigo: 'bg-indigo-50',
    emerald: 'bg-emerald-50',
    violet: 'bg-violet-50',
    amber: 'bg-amber-50',
    blue: 'bg-blue-50',
    rose: 'bg-rose-50',
  };

  return (
    <div className="card-hover p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorMap[color]} flex items-center justify-center text-white text-xl shadow-md shrink-0`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{title}</p>
        {loading ? (
          <div className="skeleton h-7 w-16 mt-1" />
        ) : (
          <p className="text-2xl font-bold text-slate-900 mt-0.5">{value?.toLocaleString()}</p>
        )}
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}
