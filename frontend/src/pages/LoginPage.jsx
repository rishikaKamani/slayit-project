import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
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
          <p className="auth-subtitle">
            Your streaks are waiting. Your excuses are too.
          </p>

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
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <p className="auth-footer-text center-text">
            No account yet? <Link to="/signup" className="auth-link">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}