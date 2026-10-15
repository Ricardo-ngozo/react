import { useEffect } from 'react';
import { tokens } from '../../styles/tokens.js';
import { Button } from './Button.jsx';

export function Modal({ open, onClose, title, children, maxWidth = 520 }) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape' && open) onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: 24,
      }}
    >
      <div style={{
        background: tokens.surface,
        border: `1px solid ${tokens.border}`,
        borderRadius: tokens.radius.xl,
        width: '100%',
        maxWidth,
        boxShadow: tokens.shadow.modal,
        maxHeight: '90vh',
        overflow: 'auto',
      }}>
        {title && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 24px',
            borderBottom: `1px solid ${tokens.border}`,
          }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.01em' }}>{title}</h2>
            <button
              onClick={onClose}
              aria-label="Close"
              style={{
                background: 'none',
                border: 'none',
                color: tokens.muted,
                cursor: 'pointer',
                fontSize: 20,
                lineHeight: 1,
                padding: '2px 6px',
                borderRadius: tokens.radius.sm,
                fontFamily: tokens.font,
              }}
            >×</button>
          </div>
        )}
        <div style={{ padding: '24px' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export function ConfirmModal({ open, onClose, onConfirm, title, message, confirmLabel = 'Confirm', danger }) {
  return (
    <Modal open={open} onClose={onClose} title={title} maxWidth={400}>
      <p style={{ color: tokens.muted, fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>{message}</p>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button variant={danger ? 'danger' : 'primary'} onClick={() => { onConfirm(); onClose(); }}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
