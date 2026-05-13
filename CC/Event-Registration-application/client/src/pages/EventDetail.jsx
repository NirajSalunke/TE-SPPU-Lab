import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, ArrowLeft, Ticket, Clock } from 'lucide-react';
import { getEvent } from '../api';
import Spinner from '../components/Spinner';

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}
function formatTime(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadEvent();
  }, [id]);

  async function loadEvent() {
    try {
      setLoading(true);
      const { data } = await getEvent(id);
      setEvent(data);
      document.title = `${data.name} — EventHub`;
    } catch (err) {
      setError('Event not found or server error.');
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1.5rem' }}><Spinner message="Loading event details..." /></div>;

  if (error) return (
    <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '2rem 1.5rem', textAlign: 'center' }}>
      <p style={{ color: '#f87171' }}>{error}</p>
      <Link to="/" className="btn btn-secondary" style={{ marginTop: '1rem' }}>← Back to Events</Link>
    </div>
  );

  if (!event) return null;

  const seatsAvailable = event.maxCapacity - event.registrationCount;
  const isFull = seatsAvailable <= 0;
  const pct = Math.min((event.registrationCount / event.maxCapacity) * 100, 100);
  const imgSrc = event.imageUrl || `https://picsum.photos/seed/${event._id}/1200/500`;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Back */}
      <Link to="/" className="btn btn-secondary" style={{ marginBottom: '1.5rem', display: 'inline-flex' }}>
        <ArrowLeft size={15} /> Back to Events
      </Link>

      {/* Hero image */}
      <div style={{
        borderRadius: '1.25rem', overflow: 'hidden',
        marginBottom: '2rem', position: 'relative',
        background: '#1a1a2e',
      }}>
        <img
          src={imgSrc}
          alt={event.name}
          style={{ width: '100%', maxHeight: '380px', objectFit: 'cover', display: 'block' }}
          onError={(e) => { e.target.src = `https://picsum.photos/seed/detail/1200/500`; }}
        />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          background: 'linear-gradient(to top, rgba(15,15,26,0.95), transparent)',
          padding: '3rem 2rem 1.5rem',
        }}>
          {isFull ? (
            <span className="badge badge-red" style={{ marginBottom: '0.75rem' }}>⛔ Seats Full</span>
          ) : seatsAvailable <= Math.ceil(event.maxCapacity * 0.1) ? (
            <span className="badge badge-yellow" style={{ marginBottom: '0.75rem' }}>⚡ Almost Full — {seatsAvailable} seats left</span>
          ) : (
            <span className="badge badge-green" style={{ marginBottom: '0.75rem' }}>✓ {seatsAvailable} seats available</span>
          )}
          <h1 style={{ margin: 0, fontSize: 'clamp(1.4rem, 4vw, 2rem)', fontWeight: 800, color: '#f1f5f9' }}>
            {event.name}
          </h1>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '2rem', alignItems: 'start' }}
        className="detail-grid">
        <div>
          {/* Meta */}
          <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Calendar size={16} color="#6366f1" />
              <div>
                <p style={{ margin: 0, color: '#f1f5f9', fontWeight: 500, fontSize: '0.9rem' }}>{formatDate(event.date)}</p>
                <p style={{ margin: 0, color: '#64748b', fontSize: '0.8rem' }}>{formatTime(event.date)}</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <MapPin size={16} color="#6366f1" />
              <p style={{ margin: 0, color: '#f1f5f9', fontWeight: 500, fontSize: '0.9rem' }}>{event.location}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Users size={16} color="#6366f1" />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Capacity</span>
                  <span style={{ color: '#f1f5f9', fontSize: '0.85rem', fontWeight: 600 }}>
                    {event.registrationCount} / {event.maxCapacity}
                  </span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{
                    width: `${pct}%`,
                    background: isFull ? '#dc2626' : 'linear-gradient(90deg, #4f46e5, #7c3aed)',
                  }} />
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {event.description && (
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <h2 style={{ margin: '0 0 0.75rem', fontSize: '1rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.75rem' }}>
                About This Event
              </h2>
              <p style={{ margin: 0, color: '#cbd5e1', lineHeight: 1.7, fontSize: '0.95rem' }}>
                {event.description}
              </p>
            </div>
          )}
        </div>

        {/* Register CTA */}
        <div className="glass-card" style={{ padding: '1.5rem', minWidth: '220px', textAlign: 'center', border: isFull ? '1px solid rgba(220,38,38,0.25)' : '1px solid rgba(79,70,229,0.25)' }}>
          <Ticket size={28} color={isFull ? '#f87171' : '#818cf8'} style={{ marginBottom: '0.75rem' }} />
          {isFull ? (
            <>
              <p style={{ color: '#f87171', fontWeight: 700, marginBottom: '0.5rem' }}>Event Full</p>
              <p style={{ color: '#64748b', fontSize: '0.82rem' }}>All seats have been claimed.</p>
            </>
          ) : (
            <>
              <p style={{ color: '#e2e8f0', fontWeight: 600, marginBottom: '0.35rem' }}>{seatsAvailable} seats left</p>
              <p style={{ color: '#64748b', fontSize: '0.82rem', marginBottom: '1rem' }}>Secure your spot now!</p>
              <Link
                to={`/events/${id}/register`}
                className="btn btn-primary"
                style={{ justifyContent: 'center', width: '100%' }}
              >
                Register Now
              </Link>
            </>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
