import React, { useEffect } from 'react';
import Button from './Button';

/**
 * Accessible modal/dialog. Replaces window.alert + window.confirm.
 *
 * props:
 *  - open: boolean
 *  - title: string
 *  - onClose: () => void
 *  - children: body content
 *  - confirm: optional { label, onConfirm, variant, loading } — renders a confirm button
 */
export default function Modal({ open, title, onClose, children, confirm, footer }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        {title && <h3 className="mb-8">{title}</h3>}
        <div>{children}</div>

        {(confirm || footer) && (
          <div className="row gap-10 mt-20" style={{ justifyContent: 'flex-end' }}>
            {footer}
            {confirm && !confirm.loading && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                {confirm.cancelLabel || 'बंद करें (Close)'}
              </Button>
            )}
            {confirm && (
              <Button
                variant={confirm.variant || 'primary'}
                size="sm"
                onClick={confirm.onConfirm}
                disabled={confirm.loading}
              >
                {confirm.loading ? 'रुकिए...' : confirm.label}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
