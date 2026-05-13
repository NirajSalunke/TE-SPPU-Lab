import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Trash2, User, Mail, Phone, Calendar, Hash, Frown } from 'lucide-react';
import { getEvent, getRegistrations, deleteRegistration } from '../api';
import Spinner from '../components/Spinner';
import ConfirmModal from '../components/ConfirmModal';
import { useToast, ToastContainer } from '../components/Toast';

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
}
function formatDateTime(d) {
  return new Date(d).toLocaleString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function AdminRegistrations() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const { toasts, toast } = useToast();

  useEffect(() => {
    document.title = 'Registrations — Admin';
    loadData();
  }, [id]);

  async function loadData() {
    try {
      setLoading(true);
      const [evRes, regRes] = await Promise.all([getEvent(id), getRegistrations(id)]);
      setEvent(evRes.data);
      setRegistrations(regRes.data);
    } catch {
      toast.error('Failed to load data.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteReg() {
    try {
      await deleteRegistration(deleteTarget._id);
      setRegistrations((prev) => prev.filter((r) => r._id !== deleteTarget._id));
      if (event) setEvent((prev) => ({ ...prev, registrationCount: prev.registrationCount - 1 }));
      toast.success('Registration removed successfully.');
    } catch {
      toast.error('Failed to remove registration.');
    } finally {
      setDeleteTarget(null);
    }
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <ToastContainer toasts={toasts} onClose={() => {}} />

      <Link to="/admin" className="btn btn-secondary" style={{ marginBottom: '1.5rem', display: 'inline-flex' }}>
        <ArrowLeft size={15} /> Back to Admin
      </Link>

      {event && (
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ color: '#6366f1', fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
            Registrations for
          </p>
          <h1 style={{ margin: '0 0 0.4rem', fontSize: '1.6rem', fontWeight: 800, color: '#f1f5f9' }}>{event.name}</h1>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <span style={{ color: '#64748b', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={13} /> {formatDate(event.date)}
            </span>
            <span style={{ color: '#64748b', fontSize: '0.85rem' }}>
              {event.registrationCount} / {event.maxCapacity} seats filled
            </span>
          </div>
        </div>
      )}

      {loading ? (
        <Spinner message="Loading registrations..." />
      ) : registrations.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#475569' }}>
          <Frown size={48} color="#334155" style={{ marginBottom: '1rem' }} />
          <h2 style={{ color: '#64748b' }}>No registrations yet</h2>
          <p style={{ fontSize: '0.9rem' }}>No one has signed up for this event.</p>
        </div>
      ) : (
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: '#94a3b8', fontWeight: 600, fontSize: '0.85rem' }}>
              {registrations.length} registration{registrations.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th><Hash size={12} style={{ display: 'inline', verticalAlign: 'middle' }} /> Reg ID</th>
                  <th><User size={12} style={{ display: 'inline', verticalAlign: 'middle' }} /> Name</th>
                  <th><Mail size={12} style={{ display: 'inline', verticalAlign: 'middle' }} /> Email</th>
                  <th><Phone size={12} style={{ display: 'inline', verticalAlign: 'middle' }} /> Phone</th>
                  <th>Registered At</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((reg) => (
                  <tr key={reg._id}>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontSize: '0.82rem', color: '#818cf8', fontWeight: 600 }}>
                        {reg.registrationId}
                      </span>
                    </td>
                    <td style={{ fontWeight: 500, color: '#f1f5f9' }}>{reg.fullName}</td>
                    <td style={{ color: '#94a3b8' }}>{reg.email}</td>
                    <td style={{ color: '#94a3b8' }}>{reg.phone || '—'}</td>
                    <td style={{ color: '#64748b', fontSize: '0.82rem' }}>{formatDateTime(reg.createdAt)}</td>
                    <td>
                      <button
                        className="btn btn-danger"
                        style={{ padding: '0.3rem 0.65rem', fontSize: '0.78rem' }}
                        onClick={() => setDeleteTarget(reg)}
                        title="Remove Registration"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Remove Registration?"
        message={`Remove ${deleteTarget?.fullName}'s (${deleteTarget?.email}) registration? This will free up one seat for the event.`}
        onConfirm={handleDeleteReg}
        onCancel={() => setDeleteTarget(null)}
        confirmLabel="Remove"
      />
    </div>
  );
}
