import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import Logo from './Logo';

const THEMES = [
  { value: 'blush', label: 'Blush' },
  { value: 'midnight', label: 'Midnight' },
  { value: 'matcha', label: 'Matcha' }
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('slayit_theme') || 'blush';
  });

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('slayit_theme', theme);
  }, [theme]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const firstName = user?.name?.split(' ')[0] || 'User';
  const initial = firstName.charAt(0).toUpperCase();

  return (
    <nav className="navbar glass-card">
      <Link to="/dashboard" className="brand brand-with-logo">
        <Logo />
        <div className="brand-copy">
          <span className="brand-name">Slayit</span>
          <span className="brand-tagline">Track the work. Not the excuses.</span>
        </div>
      </Link>

      <div className="nav-links">
        <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'nav-active' : ''}>
          Dashboard
        </Link>

        <Link to="/add-habit" className={location.pathname === '/add-habit' ? 'nav-active' : ''}>
          New Habit
        </Link>

        <Link to="/performance" className={location.pathname === '/performance' ? 'nav-active' : ''}>
          Performance
        </Link>

        <Link to="/history" className={location.pathname === '/history' ? 'nav-active' : ''}>
          History
        </Link>

        <Link to="/coach" className={location.pathname === '/coach' ? 'nav-active' : ''}>
          Coach
        </Link>
      </div>

      <div className="nav-actions">
        <div className="theme-switcher">
          <label className="theme-label" htmlFor="theme-select">Theme</label>
          <select
            id="theme-select"
            className="theme-select"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          >
            {THEMES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div className="nav-profile-wrap">
          <div className="avatar-circle">{initial}</div>
          <div className="nav-user-copy">
            <span className="nav-hello">Hey, {firstName}</span>
            <span className="nav-subtext">Stay consistent.</span>
          </div>
        </div>

        <button className="ghost-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}