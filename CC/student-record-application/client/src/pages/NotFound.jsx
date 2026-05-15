import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-4">
      <div className="text-8xl">🔍</div>
      <h1 className="text-3xl font-bold text-slate-800">404 — Page Not Found</h1>
      <p className="text-slate-500 max-w-sm">The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/" className="btn-primary mt-2">← Back to Dashboard</Link>
    </div>
  );
}
