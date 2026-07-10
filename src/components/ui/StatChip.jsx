import React from 'react';

export default function StatChip({ icon, children, className = '', ...props }) {
  return (
    <span className={['stat-chip', className].filter(Boolean).join(' ')} {...props}>
      {icon && <span aria-hidden="true">{icon}</span>}
      {children}
    </span>
  );
}
