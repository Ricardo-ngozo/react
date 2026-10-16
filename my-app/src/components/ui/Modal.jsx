import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Button } from './Primitives.jsx';
import { Icon } from './Icon.jsx';
export function Modal({
  open,
  onClose,
  title,
  children,
  maxWidth = 600
}) {
  const ref = useRef(null),
    closeRef = useRef(onClose),
    titleId = useId();
  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement,
      overflow = document.body.style.overflow,
      dialog = ref.current;
    document.body.style.overflow = 'hidden';
    const focusables = () => [...dialog.querySelectorAll('button:not(:disabled),a[href],input:not(:disabled),select:not(:disabled),textarea:not(:disabled),[tabindex="0"]')].filter(el => el.getClientRects().length);
    (focusables()[0] || dialog).focus();
    const handler = e => {
      if (e.key === 'Escape') closeRef.current();
      if (e.key === 'Tab') {
        const elements = focusables(),
          first = elements[0],
          last = elements[elements.length - 1];
        if (!first) {
          e.preventDefault();
          dialog.focus();
        } else if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', handler);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener('keydown', handler);
      previous?.focus?.();
    };
  }, [open]);
  if (!open) return null;
  return createPortal(<div className="modal-overlay" onClick={e => {
    if (e.target === e.currentTarget) onClose();
  }}>
<div ref={ref} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1} className="modal" style={{
      maxWidth
    }}>
<header className="modal-header">
<div>
<p className="eyebrow">SIDELINE</p>
<h2 id={titleId}>{title}</h2>
</div>
<button type="button" className="icon-button" aria-label="Close dialog" onClick={onClose}>
<Icon name="close" />
</button>
</header>
<div className="modal-body">{children}</div>
</div>
</div>, document.body);
}
export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  danger
}) {
  return <Modal open={open} onClose={onClose} title={title} maxWidth={460}>
<p className="muted leading">{message}</p>
<div className="modal-actions">
<Button variant="secondary" onClick={onClose}>Cancel</Button>
<Button variant={danger ? 'danger' : 'primary'} onClick={() => {
        onConfirm();
        onClose();
      }}>{confirmLabel}</Button>
</div>
</Modal>;
}
