import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/client';

const categories = ['FITNESS', 'ACADEMICS', 'HEALTH', 'MENTAL', 'CUSTOM'];

export default function AddHabitPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: 'FITNESS',
    durationDays: 30,
    timeBound: false,
    targetTime: '',
    graceMinutes: 0
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/habits', {
        ...form,
        durationDays: Number(form.durationDays),
        graceMinutes: Number(form.graceMinutes),
        targetTime: form.timeBound ? form.targetTime : null
      });

      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create habit.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <Navbar />

      <div className="content-grid single-panel">
        <form className="form-card glass-card polished-form-card" onSubmit={handleSubmit}>
          <div className="form-heading-wrap">
            <p className="eyebrow">New routine</p>
            <h1>Build something worth repeating.</h1>
            <p className="form-subtext">
              Keep it flexible if timing does not matter. Make it time-bound only when the clock actually matters.
            </p>
          </div>

          <div className="form-field-group">
            <label className="field-label">Habit name</label>
            <input
              name="name"
              placeholder="Habit name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field-group">
            <label className="field-label">Why this matters</label>
            <textarea
              name="description"
              placeholder="Why this matters"
              value={form.description}
              onChange={handleChange}
              rows="4"
            />
          </div>

          <div className="form-two-col">
            <div className="form-field-group">
              <label className="field-label">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field-group">
              <label className="field-label">Duration (days)</label>
              <input
                name="durationDays"
                type="number"
                min="1"
                max="365"
                value={form.durationDays}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="time-bound-box">
            <label className="time-bound-toggle">
              <input
                type="checkbox"
                name="timeBound"
                checked={form.timeBound}
                onChange={handleChange}
              />
              <span>Make this a time-bound habit</span>
            </label>

            <p className="time-bound-help">
              Use this only for habits where timing matters, like waking up at 5:00 AM.
            </p>

            {form.timeBound && (
              <div className="form-two-col">
                <div className="form-field-group">
                  <label className="field-label">Target time</label>
                  <input
                    name="targetTime"
                    type="time"
                    value={form.targetTime}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-field-group">
                  <label className="field-label">Grace minutes</label>
                  <input
                    name="graceMinutes"
                    type="number"
                    min="0"
                    max="180"
                    placeholder="Grace minutes"
                    value={form.graceMinutes}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            )}
          </div>

          {error && <p className="error-text">{error}</p>}

          <button className="primary-btn" disabled={loading}>
            {loading ? 'Saving...' : 'Save Habit'}
          </button>
        </form>
      </div>
    </div>
  );
}