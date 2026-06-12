import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ title, children, onClose }) => {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '2rem', width: '90%', maxWidth: '500px', position: 'relative', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
          <X size={24} />
        </button>
        <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>{title}</h2>
        {children}
      </div>
    </div>
  );
};

export default Modal;
