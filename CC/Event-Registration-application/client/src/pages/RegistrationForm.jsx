import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { User, Mail, Phone, Calendar, MapPin, ArrowLeft, Send } from 'lucide-react';
import { getEvent, registerForEvent } from '../api';
import Spinner from '../components/Spinner';

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' });
}

export default function RegistrationForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const [form, setForm] = useState({ fullName: '', email: '', phone: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    document.title = 'Register — EventHub';
    getEvent(id)
      .then(({ data }) => {
        setEvent(data);
        if (data.registrationCount >= data.maxCapacity) {
          navigate(`/events/${id}`, { replace: true });
        }
      })
      .catch(() => navigate('/', { replace: true }))
      .finally(() => setLoadingEvent(false));
  }, [id]);

  function validate() {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (!form.email.trim()) e.email = 'Email address is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Please enter a valid email address';
    if (form.phone && !/^\+?[\d\s\-()]{7,15}$/.test(form.phone)) e.phone = 'Enter a valid phone number';
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError('');
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});

    try {
      setSubmitting(true);
      const { data } = await registerForEvent(id, form);
      navigate(`/events/${id}/success`, { state: { registration: data, event } });
    } catch (err) {
      const msg = err.response?.data?.error || 'Registration failed. Please try again.';
      setServerError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  if (loadingEvent) return <div style={{ maxWidth: '620px', margin: '0 auto', padding: '2rem 1.5rem' }}><Spinner /></div>;

  return (
    <div style={{ maxWidth: '620px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <Link to={`/events/${id}`} className="btn btn-secondary" style={{ marginBottom: '1.5rem', display: 'inline-flex' }}>
        <ArrowLeft size={15} /> Back to Event
      </Link>

      {/* Event summary mini-card */}
      {event && (
        <div className="glass-card animate-fade-in-up" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <img
            src={event.imageUrl || `https://picsum.photos/seed/${id}/80/80`}
            alt={event.name}
            style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '0.5rem', flexShrink: 0 }}
          />
          <div>
            <p style={{ margin: '0 0 0.2rem', fontWeight: 700, color: '#f1f5f9', fontSize: '0.95rem' }}>{event.name}</p>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.8rem', display: 'flex', gap: '0.75rem' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}><Calendar size={11} /> {formatDate(event.date)}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}><MapPin size={11} /> {event.location}</span>
            </p>
          </div>
        </div>
      )}

      <div className="glass-card animate-fade-in-up" style={{ padding: '2rem' }}>
        <h1 style={{ margin: '0 0 0.4rem', fontSize: '1.5rem', fontWeight: 800, color: '#f1f5f9' }}>Register for Event</h1>
        <p style={{ margin: '0 0 1.75rem', color: '#64748b', fontSize: '0.9rem' }}>Fill in your details to secure your spot.</p>

        {serverError && (
          <div style={{
            background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)',
            borderRadius: '0.6rem', padding: '0.85rem 1rem',
            color: '#f87171', fontSize: '0.9rem', marginBottom: '1.25rem',
          }}>
            ⚠️ {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div>
              <label htmlFor="reg-name" className="form-label">
                <User size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                Full Name <span style={{ color: '#f87171' }}>*</span>
              </label>
              <input
                id="reg-name"
                type="text"
                className="form-input"
                placeholder="e.g. Niraj Salunke"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                style={errors.fullName ? { borderColor: '#dc2626' } : {}}
              />
              {errors.fullName && <p className="form-error">{errors.fullName}</p>}
            </div>

            <div>
              <label htmlFor="reg-email" className="form-label">
                <Mail size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                Email Address <span style={{ color: '#f87171' }}>*</span>
              </label>
              <input
                id="reg-email"
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                style={errors.email ? { borderColor: '#dc2626' } : {}}
              />
              {errors.email && <p className="form-error">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="reg-phone" className="form-label">
                <Phone size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                Phone Number <span style={{ color: '#475569', fontWeight: 400 }}>(optional)</span>
              </label>
              <input
                id="reg-phone"
                type="tel"
                className="form-input"
                placeholder="+91 98765 43210"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                style={errors.phone ? { borderColor: '#dc2626' } : {}}
              />
              {errors.phone && <p className="form-error">{errors.phone}</p>}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
              style={{ marginTop: '0.5rem', justifyContent: 'center', padding: '0.75rem' }}
              id="submit-registration"
            >
              {submitting ? (
                <>
                  <div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                  Registering...
                </>
              ) : (
                <><Send size={15} /> Register Now</>
              )}
            </button>
          </div>
        </form>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
