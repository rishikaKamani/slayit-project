import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
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
      await signup(form);
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.message ||
        JSON.stringify(err.response?.data) ||
        'Signup failed.'
      );
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
          <p className="eyebrow">Create account</p>
          <h1 className="auth-title">Join Slayit and stop lying to yourself.</h1>
          <p className="auth-subtitle">
            Build habits, protect streaks, and pretend you have your life together.
          </p>

          <div className="auth-form-grid">
            <div className="auth-field">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="auth-field">
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
                placeholder="Minimum 6 characters"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button className="auth-submit-btn" disabled={loading}>
            {loading ? 'Creating...' : 'Sign Up'}
          </button>

          <p className="auth-footer-text center-text">
            Already have an account? <Link to="/login" className="auth-link">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}