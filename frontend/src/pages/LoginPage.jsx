import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import api from '../api/client';

const WAKE_MESSAGES = [
  { after: 4,  text: "Waking up the server... (Render free tier, give it a sec)" },
  { after: 10, text: "Still loading — the server was asleep. Almost there." },
  { after: 20, text: "Taking longer than usual. Hang tight, it'll connect." },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [wakeMsg, setWakeMsg] = useState('');

  // Ping the backend as soon as the page loads to start the cold-start warmup early
  useEffect(() => {
    api.get('/auth/ping').catch(() => {});
  }, []);

  // Tick elapsed seconds while loading
  useEffect(() => {
    if (!loading) { setElapsed(0); setWakeMsg(''); return; }
    const interval = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [loading]);

  // Update wake message based on elapsed time
  useEffect(() => {
    if (!loading) return;
    const match = [...WAKE_MESSAGES].reverse().find((m) => elapsed >= m.after);
    setWakeMsg(match ? match.text : '');
  }, [elapsed, loading]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Maybe type properly?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <div className="auth-brand-row">
          <Logo />
          <div className="auth-brand-copy">
            <h2>Slayit</h2>
            <p>Track the work. Not the excuses.</p>
          </div>
        </div>

        <form className="auth-card" onSubmit={handleSubmit}>
          <p className="eyebrow">Welcome back</p>
          <h1 className="auth-title">Log in and prove you still care.</h1>
          <p className="auth-subtitle">Your streaks are waiting. Your excuses are too.</p>

          <div className="auth-form-grid auth-form-grid-single">
            <div className="auth-field auth-field-full">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="auth-field auth-field-full">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Your password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button className="auth-submit-btn" disabled={loading}>
            {loading ? (
              <span className="auth-loading-row">
                <span className="auth-spinner" />
                Logging in{elapsed > 0 ? ` (${elapsed}s)` : '...'}
              </span>
            ) : 'Login'}
          </button>

          {wakeMsg && (
            <p className="auth-wake-msg">{wakeMsg}</p>
          )}

          <p className="auth-footer-text center-text">
            No account yet? <Link to="/signup" className="auth-link">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
