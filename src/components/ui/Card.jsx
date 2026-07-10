import React from 'react';

export default function Card({ as: Comp = 'div', className = '', children, ...props }) {
  return (
    <Comp className={['card', className].filter(Boolean).join(' ')} {...props}>
      {children}
    </Comp>
  );
}
