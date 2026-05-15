export const formatDate = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const formatDateTime = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

export const getStatusColor = (status) => {
  const map = {
    active: 'bg-emerald-100 text-emerald-700',
    alumni: 'bg-blue-100 text-blue-700',
    suspended: 'bg-red-100 text-red-700',
    completed: 'bg-violet-100 text-violet-700',
    dropped: 'bg-orange-100 text-orange-700',
    present: 'bg-emerald-100 text-emerald-700',
    absent: 'bg-red-100 text-red-700',
    late: 'bg-amber-100 text-amber-700',
  };
  return map[status] || 'bg-slate-100 text-slate-700';
};

export const gradeColor = (grade) => {
  const map = { 'A+': 'text-emerald-600', 'A': 'text-green-600', 'B+': 'text-blue-600', 'B': 'text-indigo-600', 'C': 'text-amber-600', 'D': 'text-orange-600', 'F': 'text-red-600' };
  return map[grade] || 'text-slate-500';
};

export const avatarUrl = (seed = 'User') => {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/200/200`;
};

export const capitalize = (str = '') => str.charAt(0).toUpperCase() + str.slice(1);

export const academicYears = () => {
  const y = new Date().getFullYear();
  return [`${y - 1}-${String(y).slice(-2)}`, `${y}-${String(y + 1).slice(-2)}`, `${y + 1}-${String(y + 2).slice(-2)}`];
};

export const GRADE_OPTIONS = ['A+', 'A', 'B+', 'B', 'C', 'D', 'F'];
export const GRADE_POINTS = { 'A+': 10, A: 9, 'B+': 8, B: 7, C: 6, D: 5, F: 0 };
export const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];
export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
