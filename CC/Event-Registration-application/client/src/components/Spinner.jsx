export default function Spinner({ size = 36, message = '' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '3rem 0' }}>
      <div
        style={{
          width: size,
          height: size,
          border: '3px solid rgba(79, 70, 229, 0.2)',
          borderTopColor: '#4f46e5',
          borderRadius: '50%',
          animation: 'spin 0.7s linear infinite',
        }}
      />
      {message && <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{message}</p>}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
