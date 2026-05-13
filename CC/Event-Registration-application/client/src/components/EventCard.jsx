import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react';

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
}

function formatTime(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

export default function EventCard({ event }) {
  const seatsAvailable = event.maxCapacity - event.registrationCount;
  const isFull = seatsAvailable <= 0;
  const isAlmostFull = !isFull && seatsAvailable <= Math.ceil(event.maxCapacity * 0.1);
  const pct = Math.min((event.registrationCount / event.maxCapacity) * 100, 100);

  const imgSrc = event.imageUrl || `https://picsum.photos/seed/${event._id}/800/450`;

  return (
    <div className="glass-card event-card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Banner */}
      <div style={{ position: 'relative', paddingTop: '56.25%', background: '#1a1a2e', overflow: 'hidden' }}>
        <img
          src={imgSrc}
          alt={event.name}
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', transition: 'transform 0.4s ease',
          }}
          onError={(e) => { e.target.src = `https://picsum.photos/seed/${event._id || 'event'}/800/450`; }}
        />
        {/* Seat badge overlay */}
        <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem' }}>
          {isFull ? (
            <span className="badge badge-red">⛔ Seats Full</span>
          ) : isAlmostFull ? (
            <span className="badge badge-yellow">⚡ {seatsAvailable} Left</span>
          ) : (
            <span className="badge badge-green">✓ {seatsAvailable} Available</span>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 style={{ margin: '0 0 0.6rem', fontSize: '1.05rem', fontWeight: 700, color: '#f1f5f9', lineHeight: 1.35 }}>
          {event.name}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#94a3b8', fontSize: '0.82rem' }}>
            <Calendar size={13} color="#6366f1" />
            <span>{formatDate(event.date)} &nbsp;·&nbsp; {formatTime(event.date)}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#94a3b8', fontSize: '0.82rem' }}>
            <MapPin size={13} color="#6366f1" />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{event.location}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#94a3b8', fontSize: '0.82rem' }}>
            <Users size={13} color="#6366f1" />
            <span>{event.registrationCount} / {event.maxCapacity} registered</span>
          </div>
        </div>

        {/* Capacity progress */}
        <div className="progress-bar" style={{ marginBottom: '1.1rem' }}>
          <div
            className="progress-fill"
            style={{
              width: `${pct}%`,
              background: isFull ? '#dc2626' : isAlmostFull ? '#d97706' : 'linear-gradient(90deg, #4f46e5, #7c3aed)',
            }}
          />
        </div>

        {/* View button */}
        <Link
          to={`/events/${event._id}`}
          className="btn btn-primary"
          style={{ justifyContent: 'center', marginTop: 'auto' }}
        >
          View Details <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}
