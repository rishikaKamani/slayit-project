import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import Logo from './Logo';
import ProfileModal from './ProfileModal';
import Avatar from './Avatar';
import { loadPrefs, getGreeting } from '../utils/userPrefs';
import { applyTheme, getSavedTheme } from '../utils/themeConfig';

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
  const [avatarKey, setAvatarKey] = useState(0);

  useEffect(() => { applyTheme(getSavedTheme()); }, []);

  useEffect(() => {
    const handler = () => { setAvatarKey((k) => k + 1); applyTheme(getSavedTheme()); };
    window.addEventListener('slayit-prefs-saved', handler);
    return () => window.removeEventListener('slayit-prefs-saved', handler);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const handleLogout = () => { logout(); navigate('/login'); };

  const firstName = user?.name?.split(' ')[0] || 'User';
  const initial = firstName.charAt(0).toUpperCase();
  const prefs = loadPrefs(user?.email);
  const greeting = getGreeting(prefs, firstName);

  const handleProfileClose = () => {
    setProfileOpen(false);
    setAvatarKey((k) => k + 1);
    applyTheme(getSavedTheme());
  };

  return (
    <>
      <nav className="navbar glass-card">
        <Link to="/dashboard" className="brand brand-with-logo">
          <Logo />
          <div className="brand-copy">
            <span className="brand-name">Slayit</span>
            <span className="brand-tagline">Track the work. Not the excuses.</span>
          </div>
        </Link>

        <div className="nav-links nav-links-desktop">
          {NAV_LINKS.map(({ to, label }) => (
            <Link key={to} to={to} className={location.pathname === to ? 'nav-active' : ''}>
              {label}
            </Link>
          ))}
        </div>

        <div className="nav-actions nav-actions-desktop">
          <button
            className="nav-profile-wrap nav-profile-btn"
            onClick={() => setProfileOpen(true)}
            title="Profile and preferences"
            aria-label="Open profile and personalization settings"
          >
            <Avatar key={avatarKey} email={user?.email} initial={initial} size="md" />
            <div className="nav-user-copy">
              <span className="nav-hello">{greeting}</span>
              <span className="nav-subtext">Tap to personalize</span>
            </div>
          </button>
          <button className="ghost-btn" onClick={handleLogout}>Logout</button>
        </div>

        <div className="nav-mobile-right">
          <Avatar key={avatarKey} email={user?.email} initial={initial} size="sm"
            onClick={() => setProfileOpen(true)} />
          <button className="hamburger-btn" onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu" aria-expanded={menuOpen}>
            <span className={`ham-line ${menuOpen ? 'ham-open' : ''}`} />
            <span className={`ham-line ${menuOpen ? 'ham-open' : ''}`} />
            <span className={`ham-line ${menuOpen ? 'ham-open' : ''}`} />
          </button>
        </div>

        {menuOpen && (
          <div className="mobile-drawer glass-card">
            <div className="mobile-drawer-links">
              {NAV_LINKS.map(({ to, label }) => (
                <Link key={to} to={to}
                  className={`mobile-nav-link ${location.pathname === to ? 'nav-active' : ''}`}>
                  {label}
                </Link>
              ))}
            </div>
            <div className="mobile-drawer-footer">
              <button className="ghost-btn" style={{ width: '100%' }}
                onClick={() => { setMenuOpen(false); setProfileOpen(true); }}>
                Themes and Profile
              </button>
              <button className="ghost-btn" style={{ width: '100%' }} onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>

      {profileOpen && <ProfileModal onClose={handleProfileClose} />}
    </>
  );
}
