import React from 'react';

/**
 * Design-system button.
 * variant: 'primary' | 'secondary' | 'ghost' | 'danger'
 * size:    'md' (default) | 'sm'
 */
export default function Button({
  as: Comp = 'button',
  variant = 'primary',
  size = 'md',
  block = false,
  className = '',
  children,
  ...props
}) {
  const classes = [
    'btn',
    `btn-${variant}`,
    size === 'sm' ? 'btn-sm' : '',
    block ? 'btn-block' : 'btn-auto',
    className,
  ].filter(Boolean).join(' ');
  return (
    <Comp className={classes} {...props}>
      {children}
    </Comp>
  );
}
