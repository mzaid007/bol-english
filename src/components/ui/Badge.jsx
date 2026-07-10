import React from 'react';

/**
 * variant: 'default' | 'accent' | 'success' | 'warning' | 'sky'
 */
export default function Badge({ variant = 'default', className = '', children, ...props }) {
  return (
    <span className={['badge', `badge-${variant}`, className].filter(Boolean).join(' ')} {...props}>
      {children}
    </span>
  );
}
