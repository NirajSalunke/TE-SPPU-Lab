import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#6366f1','#10b981','#f59e0b','#3b82f6','#8b5cf6','#ef4444','#64748b'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-slate-100 rounded-lg shadow-lg p-3 text-sm">
        <p className="font-semibold" style={{ color: payload[0].payload.fill }}>{payload[0].name}</p>
        <p className="text-slate-600">{payload[0].value} students</p>
      </div>
    );
  }
  return null;
};

export default function GradePieChart({ data = [] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={data}
          dataKey="count"
          nameKey="grade"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={3}
          label={({ grade, percent }) => `${grade} ${(percent * 100).toFixed(0)}%`}
          labelLine={false}
        >
          {data.map((entry, index) => (
            <Cell key={entry.grade} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend iconType="circle" iconSize={8} formatter={(v) => <span className="text-xs text-slate-600">{v}</span>} />
      </PieChart>
    </ResponsiveContainer>
  );
}
