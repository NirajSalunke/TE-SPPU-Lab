import { Calendar } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      background: 'rgba(15,15,26,0.8)',
      borderTop: '1px solid rgba(255,255,255,0.07)',
      padding: '2rem 1.5rem',
      marginTop: 'auto',
      textAlign: 'center',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
            borderRadius: '8px',
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Calendar size={14} color="#fff" />
          </div>
          <span style={{ fontWeight: 700, color: '#e2e8f0', fontSize: '0.95rem' }}>EventHub</span>
        </div>
        <p style={{ color: '#475569', fontSize: '0.8rem', margin: 0 }}>
          Event Registration System — CC Assignment 15 &nbsp;•&nbsp; Built with MERN Stack
        </p>
      </div>
    </footer>
  );
}
