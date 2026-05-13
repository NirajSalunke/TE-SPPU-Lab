import { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const toast = {
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error'),
  };

  return { toasts, toast };
}

export function ToastContainer({ toasts, onClose }) {
  return (
    <div style={{
      position: 'fixed',
      bottom: '1.5rem',
      right: '1.5rem',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.6rem',
    }}>
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} onClose={() => onClose(t.id)} />
      ))}
    </div>
  );
}

function Toast({ toast, onClose }) {
  const isSuccess = toast.type === 'success';
  return (
    <div
      className="animate-fade-in-up"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.8rem 1.1rem',
        borderRadius: '0.75rem',
        background: isSuccess ? 'rgba(5,150,105,0.15)' : 'rgba(220,38,38,0.15)',
        border: `1px solid ${isSuccess ? 'rgba(5,150,105,0.4)' : 'rgba(220,38,38,0.4)'}`,
        backdropFilter: 'blur(12px)',
        color: isSuccess ? '#34d399' : '#f87171',
        maxWidth: '360px',
        fontSize: '0.9rem',
        fontWeight: 500,
        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
      }}
    >
      {isSuccess ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
      <span style={{ flex: 1, color: '#e2e8f0' }}>{toast.message}</span>
      <button
        onClick={onClose}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '2px' }}
      >
        <X size={15} />
      </button>
    </div>
  );
}
