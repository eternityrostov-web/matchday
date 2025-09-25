import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: 'home', label: 'Dashboard' },
    { path: '/create', icon: 'add_circle', label: 'Create Report' },
    { path: '/reports', icon: 'description', label: 'Reports' },
    { path: '/statistics', icon: 'bar_chart', label: 'Statistics' }
  ];

  return (
    <div className="app-layout">
      <nav className="navbar">
        <div className="nav-brand">
          <span className="material-icons">stadium</span>
          <h1>FIFA World Cup 2026</h1>
        </div>
        <div className="nav-tabs">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-tab ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="material-icons">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      <main className="main-content">
        <div className="container">
          {children}
        </div>
      </main>
    </div>
  );
}