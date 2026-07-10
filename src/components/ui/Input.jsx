import React from 'react';

export default function Input({ label, hint, className = '', containerClassName = '', ...props }) {
  return (
    <div className={['form-group', containerClassName].filter(Boolean).join(' ')}>
      {label && <label className="form-label" htmlFor={props.id}>{label}</label>}
      <input className={['form-input', className].filter(Boolean).join(' ')} {...props} />
      {hint && <p className="text-xs muted mt-4">{hint}</p>}
    </div>
  );
}
