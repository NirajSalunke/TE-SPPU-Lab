import { useLocation, useParams, Link, Navigate } from 'react-router-dom';
import { CheckCircle, Calendar, MapPin, User, Mail, Phone, Home, Copy } from 'lucide-react';
import { useState, useEffect } from 'react';

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}
function formatTime(d) {
  return new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

export default function RegistrationSuccess() {
  const { state } = useLocation();
  const { id } = useParams();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    document.title = 'Registration Confirmed — EventHub';
  }, []);

  if (!state?.registration) {
    return <Navigate to={`/events/${id}`} replace />;
  }

  const { registration, event } = state;

  function copyRegId() {
    navigator.clipboard.writeText(registration.registrationId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <div className="glass-card animate-fade-in-up" style={{ padding: '2.5rem', textAlign: 'center', border: '1px solid rgba(5,150,105,0.25)' }}>
        {/* Success icon */}
        <div style={{
          width: '72px', height: '72px', borderRadius: '50%',
          background: 'rgba(5,150,105,0.15)', border: '2px solid rgba(5,150,105,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1.25rem',
          animation: 'pulse-glow 2s ease infinite',
        }}>
          <CheckCircle size={36} color="#34d399" />
        </div>

        <h1 style={{ margin: '0 0 0.4rem', fontSize: '1.75rem', fontWeight: 800, color: '#f1f5f9' }}>
          You're Registered! 🎉
        </h1>
        <p style={{ color: '#64748b', marginBottom: '1.75rem', fontSize: '0.95rem' }}>
          Your spot has been confirmed. See you there!
        </p>

        {/* Registration ID */}
        <div style={{
          background: 'rgba(79,70,229,0.1)', border: '1px solid rgba(79,70,229,0.3)',
          borderRadius: '0.75rem', padding: '1rem 1.5rem', marginBottom: '1.75rem',
        }}>
          <p style={{ margin: '0 0 0.35rem', color: '#6366f1', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            Registration ID
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#a5b4fc', letterSpacing: '0.03em' }}>
              {registration.registrationId}
            </span>
            <button
              onClick={copyRegId}
              title="Copy ID"
              style={{
                background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)',
                borderRadius: '6px', padding: '4px 8px', cursor: 'pointer',
                color: copied ? '#34d399' : '#6366f1', fontSize: '0.75rem', fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: '4px',
              }}
            >
              <Copy size={13} />{copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Details */}
        <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
          {event && (
            <>
              <DetailRow icon={<Calendar size={15} color="#6366f1" />} label="Event" value={event.name} />
              <DetailRow icon={<Calendar size={15} color="#6366f1" />} label="Date & Time" value={`${formatDate(event.date)} at ${formatTime(event.date)}`} />
              <DetailRow icon={<MapPin size={15} color="#6366f1" />} label="Venue" value={event.location} />
            </>
          )}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '0.75rem' }} />
          <DetailRow icon={<User size={15} color="#818cf8" />} label="Name" value={registration.fullName} />
          <DetailRow icon={<Mail size={15} color="#818cf8" />} label="Email" value={registration.email} />
          {registration.phone && (
            <DetailRow icon={<Phone size={15} color="#818cf8" />} label="Phone" value={registration.phone} />
          )}
        </div>

        <Link to="/" className="btn btn-primary" style={{ justifyContent: 'center' }}>
          <Home size={15} /> Browse More Events
        </Link>
      </div>

      <style>{`
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(5, 150, 105, 0.3); }
          50% { box-shadow: 0 0 0 12px rgba(5, 150, 105, 0); }
        }
      `}</style>
    </div>
  );
}

function DetailRow({ icon, label, value }) {
  return (
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
      <div style={{ flexShrink: 0, marginTop: '2px' }}>{icon}</div>
      <div>
        <span style={{ color: '#475569', fontSize: '0.78rem', fontWeight: 500 }}>{label}</span>
        <p style={{ margin: 0, color: '#e2e8f0', fontSize: '0.9rem', fontWeight: 500 }}>{value}</p>
      </div>
    </div>
  );
}
