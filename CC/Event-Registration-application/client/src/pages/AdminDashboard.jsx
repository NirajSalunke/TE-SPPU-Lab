import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Users, Calendar, MapPin, Frown, Settings } from 'lucide-react';
import { getEvents, deleteEvent } from '../api';
import Spinner from '../components/Spinner';
import ConfirmModal from '../components/ConfirmModal';
import { useToast, ToastContainer } from '../components/Toast';

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const { toasts, toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Admin Panel — EventHub';
    loadEvents();
  }, []);

  async function loadEvents() {
    try {
      setLoading(true);
      const { data } = await getEvents();
      setEvents(data);
    } catch {
      toast.error('Failed to load events.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    try {
      await deleteEvent(deleteTarget._id);
      setEvents((prev) => prev.filter((e) => e._id !== deleteTarget._id));
      toast.success(`"${deleteTarget.name}" deleted successfully.`);
    } catch {
      toast.error('Failed to delete event.');
    } finally {
      setDeleteTarget(null);
    }
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <ToastContainer toasts={toasts} onClose={() => {}} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <Settings size={18} color="#6366f1" />
            <span style={{ color: '#6366f1', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Admin Panel</span>
          </div>
          <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, color: '#f1f5f9' }}>Manage Events</h1>
        </div>
        <Link to="/admin/events/new" className="btn btn-primary" id="add-event-btn">
          <Plus size={16} /> Add New Event
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Total Events', value: events.length, color: '#6366f1' },
          { label: 'Total Registrations', value: events.reduce((s, e) => s + e.registrationCount, 0), color: '#059669' },
          { label: 'Full Events', value: events.filter((e) => e.registrationCount >= e.maxCapacity).length, color: '#dc2626' },
        ].map((stat) => (
          <div key={stat.label} className="glass-card" style={{ padding: '1.1rem 1.3rem' }}>
            <p style={{ margin: '0 0 0.25rem', color: '#475569', fontSize: '0.78rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{stat.label}</p>
            <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800, color: stat.color }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <Spinner message="Loading events..." />
      ) : events.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#475569' }}>
          <Frown size={48} color="#334155" style={{ marginBottom: '1rem' }} />
          <h2 style={{ color: '#64748b' }}>No events yet</h2>
          <p style={{ fontSize: '0.9rem' }}>Create your first event to get started.</p>
          <Link to="/admin/events/new" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-flex' }}>
            <Plus size={15} /> Create First Event
          </Link>
        </div>
      ) : (
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Event Name</th>
                  <th>Date</th>
                  <th>Location</th>
                  <th>Capacity</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => {
                  const isFull = event.registrationCount >= event.maxCapacity;
                  const pct = Math.round((event.registrationCount / event.maxCapacity) * 100);
                  return (
                    <tr key={event._id}>
                      <td>
                        <div style={{ fontWeight: 600, color: '#f1f5f9', fontSize: '0.9rem' }}>{event.name}</div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#94a3b8' }}>
                          <Calendar size={13} color="#6366f1" />
                          {formatDate(event.date)}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#94a3b8', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          <MapPin size={13} color="#6366f1" />
                          {event.location}
                        </div>
                      </td>
                      <td>
                        <span style={{ fontWeight: 600, color: isFull ? '#f87171' : '#34d399' }}>
                          {event.registrationCount}
                        </span>
                        <span style={{ color: '#475569' }}> / {event.maxCapacity}</span>
                        <span style={{ color: '#475569', fontSize: '0.78rem' }}> ({pct}%)</span>
                      </td>
                      <td>
                        {isFull
                          ? <span className="badge badge-red">Full</span>
                          : <span className="badge badge-green">Open</span>
                        }
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <Link
                            to={`/admin/events/${event._id}/registrations`}
                            className="btn btn-secondary"
                            style={{ padding: '0.35rem 0.7rem', fontSize: '0.78rem' }}
                            title="View Registrations"
                          >
                            <Users size={13} />
                          </Link>
                          <Link
                            to={`/admin/events/${event._id}/edit`}
                            className="btn btn-secondary"
                            style={{ padding: '0.35rem 0.7rem', fontSize: '0.78rem' }}
                            title="Edit Event"
                          >
                            <Edit2 size={13} />
                          </Link>
                          <button
                            className="btn btn-danger"
                            style={{ padding: '0.35rem 0.7rem', fontSize: '0.78rem' }}
                            onClick={() => setDeleteTarget(event)}
                            title="Delete Event"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Event?"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This will also delete all ${deleteTarget?.registrationCount} registrations for this event. This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        confirmLabel="Delete Event"
      />
    </div>
  );
}
