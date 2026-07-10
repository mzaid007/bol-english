import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const HomeIcon = ({ filled }) => (
  <svg viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1V9.5Z" />
  </svg>
);

const ProfileIcon = ({ filled }) => (
  <svg viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
  </svg>
);

const items = [
  { to: '/dashboard', label: 'होम (Home)', Icon: HomeIcon },
  { to: '/profile', label: 'प्रोफ़ाइल (Profile)', Icon: ProfileIcon },
];

export default function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav className="bottom-nav" aria-label="Primary">
      <div className="bottom-nav-inner">
        {items.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
          >
            {({ isActive }) => <Icon filled={isActive} />}
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
