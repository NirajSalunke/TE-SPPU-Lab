import { useState, useEffect } from 'react';
import { Search, Calendar, Frown } from 'lucide-react';
import { getEvents } from '../api';
import EventCard from '../components/EventCard';
import Spinner from '../components/Spinner';

export default function EventsListing() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    document.title = 'EventHub — Browse Events';
    loadEvents();
  }, []);

  async function loadEvents() {
    try {
      setLoading(true);
      const { data } = await getEvents();
      setEvents(data);
    } catch (err) {
      setError('Failed to load events. Please make sure the server is running.');
    } finally {
      setLoading(false);
    }
  }

  const filtered = events.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }} className="animate-fade-in-up">
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          background: 'rgba(79,70,229,0.1)', border: '1px solid rgba(79,70,229,0.25)',
          borderRadius: '999px', padding: '0.35rem 1rem', marginBottom: '1rem',
          fontSize: '0.8rem', color: '#818cf8', fontWeight: 500,
        }}>
          <Calendar size={13} /> Upcoming Events
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, margin: '0 0 0.75rem', lineHeight: 1.2 }}>
          Discover &amp; Register for<br />
          <span className="gradient-text">Amazing Events</span>
        </h1>
        <p style={{ color: '#64748b', fontSize: '1.05rem', maxWidth: '500px', margin: '0 auto' }}>
          Browse upcoming conferences, workshops, and meetups. Register in seconds.
        </p>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', maxWidth: '480px', margin: '0 auto 2.5rem' }}>
        <Search
          size={16}
          color="#4f46e5"
          style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }}
        />
        <input
          id="search-events"
          type="text"
          placeholder="Search events by name or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="form-input"
          style={{ paddingLeft: '2.5rem' }}
        />
      </div>

      {/* Content */}
      {loading ? (
        <Spinner message="Loading events..." />
      ) : error ? (
        <div style={{
          textAlign: 'center', padding: '3rem',
          background: 'rgba(220,38,38,0.08)', borderRadius: '1rem',
          border: '1px solid rgba(220,38,38,0.2)',
        }}>
          <p style={{ color: '#f87171', fontSize: '1rem' }}>{error}</p>
          <button className="btn btn-secondary" onClick={loadEvents} style={{ marginTop: '1rem' }}>
            Retry
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#475569' }}>
          <Frown size={48} color="#334155" style={{ marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.25rem', color: '#64748b', marginBottom: '0.5rem' }}>
            {search ? 'No events match your search' : 'No events available yet'}
          </h2>
          <p style={{ fontSize: '0.9rem' }}>
            {search ? 'Try different keywords.' : 'Check back soon — events will appear here.'}
          </p>
          {search && (
            <button className="btn btn-secondary" onClick={() => setSearch('')} style={{ marginTop: '1rem' }}>
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <>
          <p style={{ color: '#475569', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            Showing {filtered.length} event{filtered.length !== 1 ? 's' : ''}
            {search && ` for "${search}"`}
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem',
          }}>
            {filtered.map((event, i) => (
              <div key={event._id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                <EventCard event={event} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
