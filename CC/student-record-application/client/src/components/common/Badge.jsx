export default function Badge({ label, color = 'slate' }) {
  const colorMap = {
    slate: 'bg-slate-100 text-slate-700',
    indigo: 'bg-indigo-100 text-indigo-700',
    emerald: 'bg-emerald-100 text-emerald-700',
    red: 'bg-red-100 text-red-700',
    amber: 'bg-amber-100 text-amber-700',
    blue: 'bg-blue-100 text-blue-700',
    violet: 'bg-violet-100 text-violet-700',
    orange: 'bg-orange-100 text-orange-700',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${colorMap[color] || colorMap.slate}`}>
      {label}
    </span>
  );
}

export function StatusBadge({ status }) {
  const map = {
    active: { label: 'Active', color: 'emerald' },
    alumni: { label: 'Alumni', color: 'blue' },
    suspended: { label: 'Suspended', color: 'red' },
    completed: { label: 'Completed', color: 'violet' },
    dropped: { label: 'Dropped', color: 'orange' },
    present: { label: 'Present', color: 'emerald' },
    absent: { label: 'Absent', color: 'red' },
    late: { label: 'Late', color: 'amber' },
  };
  const cfg = map[status] || { label: status, color: 'slate' };
  return <Badge label={cfg.label} color={cfg.color} />;
}
