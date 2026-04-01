import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import Logo from './Logo';
import ProfileModal from './ProfileModal';
import { loadPrefs, getGreeting } from '../utils/userPrefs';

const THEMES = [
  { value: 'blush', label: 'Blush' },
  { value: 'midnight', label: 'Midnight' },
  { value: 'matcha', label: 'Matcha' }
];

const NAV_LINKS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/add-habit', label: 'New Habit' },
  { to: '/performance', label: 'Performance' },
  { to: '/history', label: 'History' },
  { to: '/coach', label: 'Coach' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('slayit_theme') || 'blush';
  });

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('slayit_theme', theme);
  }, [theme]);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const firstName = user?.name?.split(' ')[0] || 'User';
  const initial = firstName.charAt(0).toUpperCase();

  // Load prefs for greeting
  const prefs = loadPrefs(user?.email);
  const greeting = getGreeting(prefs, firstName);

  return (
    <>
      <nav className="navbar glass-card">
        {/* Brand */}
        <Link to="/dashboard" className="brand brand-with-logo">
          <Logo />
          <div className="brand-copy">
            <span className="brand-name">Slayit</span>
            <span className="brand-tagline">Track the work. Not the excuses.</span>
          </div>
        </Link>

        {/* Desktop nav links */}
        <div className="nav-links nav-links-desktop">
          {NAV_LINKS.map(({ to, label }) => (
            <Link key={to} to={to} className={location.pathname === to ? 'nav-active' : ''}>
              {label}
            </Link>
          ))}
        </div>

        {/* Desktop actions */}
        <div className="nav-actions nav-actions-desktop">
          <div className="theme-switcher">
            <label className="theme-label" htmlFor="theme-select">Theme</label>
            <select
              id="theme-select"
              className="theme-select"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
            >
              {THEMES.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>
          </div>

          {/* Clickable profile area — opens ProfileModal */}
          <button
            className="nav-profile-wrap nav-profile-btn"
            onClick={() => setProfileOpen(true)}
            title="Open profile & preferences"
            aria-label="Open profile and personalization settings"
          >
            <div className="avatar-circle">{initial}</div>
            <div className="nav-user-copy">
              <span className="nav-hello">{greeting}</span>
              <span className="nav-subtext">Tap to personalize ✦</span>
            </div>
          </button>

          <button className="ghost-btn" onClick={handleLogout}>Logout</button>
        </div>

        {/* Mobile right side: avatar + hamburger */}
        <div className="nav-mobile-right">
          <button
            className="avatar-circle avatar-circle-sm avatar-btn"
            onClick={() => setProfileOpen(true)}
            aria-label="Open profile"
            title="Profile & preferences"
          >
            {initial}
          </button>
          <button
            className="hamburger-btn"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span className={`ham-line ${menuOpen ? 'ham-open' : ''}`} />
            <span className={`ham-line ${menuOpen ? 'ham-open' : ''}`} />
            <span className={`ham-line ${menuOpen ? 'ham-open' : ''}`} />
          </button>
        </div>

        {/* Mobile drawer */}
        {menuOpen && (
          <div className="mobile-drawer glass-card">
            <div className="mobile-drawer-links">
              {NAV_LINKS.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`mobile-nav-link ${location.pathname === to ? 'nav-active' : ''}`}
                >
                  {label}
                </Link>
              ))}
            </div>
            <div className="mobile-drawer-footer">
              {/* Profile shortcut in mobile drawer */}
              <button
                className="ghost-btn"
                style={{ width: '100%' }}
                onClick={() => { setMenuOpen(false); setProfileOpen(true); }}
              >
                ✦ Profile & Preferences
              </button>
              <select
                className="theme-select"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
              >
                {THEMES.map((item) => (
                  <option key={item.value} value={item.value}>{item.label}</option>
                ))}
              </select>
              <button className="ghost-btn" style={{ width: '100%' }} onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Profile modal — rendered outside nav so it overlays everything */}
      {profileOpen && <ProfileModal onClose={() => setProfileOpen(false)} />}
    </>
  );
}
