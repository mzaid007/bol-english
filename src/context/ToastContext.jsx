import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

const ToastContext = createContext(null);

let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
    // Remove after the leave animation
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 250);
  }, []);

  const push = useCallback((message, opts = {}) => {
    const id = ++idCounter;
    const duration = opts.duration ?? 3200;
    const toast = {
      id,
      message,
      type: opts.type || 'default', // 'success' | 'error' | 'warning' | 'default'
      icon: opts.icon,
      leaving: false,
    };
    setToasts((prev) => [...prev, toast]);
    if (duration > 0) {
      timers.current[id] = window.setTimeout(() => dismiss(id), duration);
    }
    return id;
  }, [dismiss]);

  const api = {
    show: push,
    success: (msg, opts = {}) => push(msg, { ...opts, type: 'success', icon: opts.icon || '✅' }),
    error: (msg, opts = {}) => push(msg, { ...opts, type: 'error', icon: opts.icon || '⚠️' }),
    warning: (msg, opts = {}) => push(msg, { ...opts, type: 'warning', icon: opts.icon || '⚠️' }),
    dismiss,
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

function ToastViewport({ toasts, onDismiss }) {
  if (toasts.length === 0) return null;
  return (
    <div className="toast-stack" role="region" aria-label="Notifications" aria-live="polite">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`toast ${t.type} ${t.leaving ? 'leaving' : ''}`}
          role="status"
          onClick={() => onDismiss(t.id)}
        >
          {t.icon && <span aria-hidden="true">{t.icon}</span>}
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
