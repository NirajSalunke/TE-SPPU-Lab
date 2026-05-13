import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Calendar, MapPin, Users, Image, FileText, Type } from 'lucide-react';
import { getEvent, createEvent, updateEvent } from '../api';
import Spinner from '../components/Spinner';

export default function AdminEventForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    name: '',
    description: '',
    date: '',
    location: '',
    maxCapacity: '',
    imageUrl: '',
  });

  useEffect(() => {
    document.title = isEditing ? 'Edit Event — Admin' : 'New Event — Admin';
    if (isEditing) {
      getEvent(id)
        .then(({ data }) => {
          setForm({
            name: data.name,
            description: data.description || '',
            date: new Date(data.date).toISOString().slice(0, 16),
            location: data.location,
            maxCapacity: String(data.maxCapacity),
            imageUrl: data.imageUrl || '',
          });
        })
        .catch(() => navigate('/admin', { replace: true }))
        .finally(() => setLoading(false));
    }
  }, [id]);

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = 'Event name is required';
    if (!form.date) e.date = 'Event date and time is required';
    if (!form.location.trim()) e.location = 'Location is required';
    if (!form.maxCapacity) e.maxCapacity = 'Max capacity is required';
    else if (isNaN(form.maxCapacity) || Number(form.maxCapacity) < 1) e.maxCapacity = 'Capacity must be a positive number';
    if (form.imageUrl && !/^https?:\/\//.test(form.imageUrl)) e.imageUrl = 'Image URL must start with http:// or https://';
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError('');
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      date: new Date(form.date).toISOString(),
      location: form.location.trim(),
      maxCapacity: Number(form.maxCapacity),
      imageUrl: form.imageUrl.trim(),
    };

    try {
      setSubmitting(true);
      if (isEditing) {
        await updateEvent(id, payload);
      } else {
        await createEvent(payload);
      }
      navigate('/admin');
    } catch (err) {
      setServerError(err.response?.data?.error || 'An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  function setField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => { const e = { ...prev }; delete e[field]; return e; });
  }

  if (loading) return <div style={{ maxWidth: '700px', margin: '0 auto', padding: '2rem 1.5rem' }}><Spinner /></div>;

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <Link to="/admin" className="btn btn-secondary" style={{ marginBottom: '1.5rem', display: 'inline-flex' }}>
        <ArrowLeft size={15} /> Back to Admin
      </Link>

      <div className="glass-card animate-fade-in-up" style={{ padding: '2rem' }}>
        <h1 style={{ margin: '0 0 0.3rem', fontSize: '1.6rem', fontWeight: 800, color: '#f1f5f9' }}>
          {isEditing ? 'Edit Event' : 'Create New Event'}
        </h1>
        <p style={{ margin: '0 0 2rem', color: '#64748b', fontSize: '0.9rem' }}>
          {isEditing ? 'Update the event details below.' : 'Fill in the details to create a new event.'}
        </p>

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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>

            <FormField label="Event Name" icon={<Type size={13} />} required error={errors.name}>
              <input
                id="event-name"
                type="text"
                className="form-input"
                placeholder="e.g. TechSpark 2026 Conference"
                value={form.name}
                onChange={(e) => setField('name', e.target.value)}
                style={errors.name ? { borderColor: '#dc2626' } : {}}
              />
            </FormField>

            <FormField label="Description" icon={<FileText size={13} />} error={errors.description}>
              <textarea
                id="event-desc"
                className="form-input"
                placeholder="Describe what attendees can expect..."
                value={form.description}
                onChange={(e) => setField('description', e.target.value)}
                rows={4}
                style={{ resize: 'vertical', minHeight: '90px' }}
              />
            </FormField>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <FormField label="Date & Time" icon={<Calendar size={13} />} required error={errors.date}>
                <input
                  id="event-date"
                  type="datetime-local"
                  className="form-input"
                  value={form.date}
                  onChange={(e) => setField('date', e.target.value)}
                  style={errors.date ? { borderColor: '#dc2626' } : {}}
                />
              </FormField>

              <FormField label="Max Capacity" icon={<Users size={13} />} required error={errors.maxCapacity}>
                <input
                  id="event-capacity"
                  type="number"
                  className="form-input"
                  placeholder="e.g. 200"
                  min="1"
                  value={form.maxCapacity}
                  onChange={(e) => setField('maxCapacity', e.target.value)}
                  style={errors.maxCapacity ? { borderColor: '#dc2626' } : {}}
                />
              </FormField>
            </div>

            <FormField label="Location / Venue" icon={<MapPin size={13} />} required error={errors.location}>
              <input
                id="event-location"
                type="text"
                className="form-input"
                placeholder="e.g. Bombay Exhibition Centre, Mumbai"
                value={form.location}
                onChange={(e) => setField('location', e.target.value)}
                style={errors.location ? { borderColor: '#dc2626' } : {}}
              />
            </FormField>

            <FormField label="Banner Image URL" icon={<Image size={13} />} error={errors.imageUrl} hint="Optional — use https://picsum.photos/seed/name/800/450">
              <input
                id="event-image"
                type="url"
                className="form-input"
                placeholder="https://picsum.photos/seed/myevent/800/450"
                value={form.imageUrl}
                onChange={(e) => setField('imageUrl', e.target.value)}
                style={errors.imageUrl ? { borderColor: '#dc2626' } : {}}
              />
              {form.imageUrl && !errors.imageUrl && (
                <img
                  src={form.imageUrl}
                  alt="Preview"
                  style={{ marginTop: '0.5rem', width: '100%', height: '120px', objectFit: 'cover', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.08)' }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              )}
            </FormField>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
              style={{ justifyContent: 'center', padding: '0.75rem', marginTop: '0.5rem' }}
              id="save-event-btn"
            >
              {submitting ? (
                <>
                  <div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                  Saving...
                </>
              ) : (
                <><Save size={15} /> {isEditing ? 'Save Changes' : 'Create Event'}</>
              )}
            </button>
          </div>
        </form>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function FormField({ label, icon, required, error, hint, children }) {
  return (
    <div>
      <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {icon} {label} {required && <span style={{ color: '#f87171' }}>*</span>}
      </label>
      {children}
      {hint && !error && <p style={{ color: '#475569', fontSize: '0.78rem', marginTop: '0.25rem' }}>{hint}</p>}
      {error && <p className="form-error">{error}</p>}
    </div>
  );
}
