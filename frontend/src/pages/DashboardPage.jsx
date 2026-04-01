import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import HabitCard from '../components/HabitCard';
import NotificationPrompt, { testNotification } from '../components/NotificationPrompt';
import api from '../api/client';
import InstallButton from '../pwa/InstallButton';

const HISTORY_KEY = 'slayit_habit_history';

function addToHistory(prev, habit, type) {
  const filtered = prev.filter((h) => Number(h.id) !== Number(habit.id));
  return [
    { id: habit.id, name: habit.name, category: habit.category, durationDays: habit.durationDays, type, date: new Date().toLocaleDateString() },
    ...filtered
  ];
}

function parseDate(raw) {
  if (!raw) return null;
  // array: [2026, 3, 22]
  if (Array.isArray(raw)) return new Date(raw[0], raw[1] - 1, raw[2]);
  // string: "2026-03-22" or "2026-03-22T00:00:00"
  const s = String(raw).split('T')[0];
  const p = s.split('-');
  if (p.length === 3) return new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
  return null;
}

function isPeriodOver(h) {
  const start = parseDate(h.createdDate);
  if (!start) return false;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return Math.floor((today - start) / 86400000) >= Number(h.durationDays);
}

function isAllDone(h) {
  return h.days && h.days.length > 0 && h.days.every((d) => (d.status || '').toLowerCase().trim() === 'done');
}

export default function DashboardPage() {
  const [habits, setHabits] = useState([]);
  const habitsRef = useRef([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); }
    catch { return []; }
  });

  useEffect(() => {
    api.get('/habits').then((res) => {
      const fetched = res.data || [];
      const active = [];
      const toHistory = [];
      fetched.forEach((h) => {
        if (isAllDone(h) || isPeriodOver(h)) toHistory.push(h);
        else active.push(h);
      });
      setHabits(active);
      habitsRef.current = active;
      if (toHistory.length > 0) {
        setHistory((prev) => {
          let updated = [...prev];
          toHistory.forEach((h) => {
            if (!updated.find((x) => Number(x.id) === Number(h.id))) {
              updated = addToHistory(updated, h, 'completed');
            }
          });
          return updated;
        });
      }
    }).catch((err) => {
      setError(err.response?.data?.message || 'Could not load habits.');
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  const handleCompleted = (habitId) => {
    const id = Number(habitId);
    const habit = habitsRef.current.find((h) => Number(h.id) === id);
    if (habit) setHistory((prev) => addToHistory(prev, habit, 'completed'));
    setHabits((prev) => {
      const updated = prev.filter((h) => Number(h.id) !== id);
      habitsRef.current = updated;
      return updated;
    });
  };

  const handleDeleted = (habitId) => {
    const id = Number(habitId);
    const habit = habitsRef.current.find((h) => Number(h.id) === id);
    if (habit) setHistory((prev) => addToHistory(prev, habit, 'deleted'));
    setHabits((prev) => {
      const updated = prev.filter((h) => Number(h.id) !== id);
      habitsRef.current = updated;
      return updated;
    });
  };

  return (
    <div className="page-shell">
      <Navbar />
      <NotificationPrompt />
        <InstallButton />
      <div className="dashboard-page">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Your Habits</h1>
            <p className="dashboard-subtitle">Track what you started. Or ignore it creatively.</p>
          </div>
          {'Notification' in window && Notification.permission === 'granted' && (
            <button className="ghost-btn" style={{ fontSize: '0.82rem', padding: '8px 14px' }} onClick={testNotification}>
              🔔 Test Notification
            </button>
          )}
        </div>
        {loading && <p>Loading your habits...</p>}
        {!loading && error && <p className="error-text">{error}</p>}
        {!loading && !error && habits.length === 0 && (
          <div className="empty-state glass-card">
            <h2>No active habits left</h2>
            <p>Either you finished everything like a maniac, or you have nothing going on.</p>
            <Link to="/add-habit" className="primary-btn">Create New Habit</Link>
          </div>
        )}
        {!loading && !error && habits.length > 0 && (
          <div className="habit-grid">
            {habits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onHideCompleted={handleCompleted}
                onDelete={handleDeleted}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
