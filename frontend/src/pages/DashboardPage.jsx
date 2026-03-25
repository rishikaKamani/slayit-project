import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import HabitCard from '../components/HabitCard';
import NotificationPrompt from '../components/NotificationPrompt';
import api from '../api/client';

const HIDDEN_COMPLETED_KEY = 'slayit_hidden_completed_habits';
const HISTORY_KEY = 'slayit_habit_history';

function addToHistory(prev, habit, type) {
  // replace existing entry for same id
  const filtered = prev.filter((h) => h.id !== habit.id);
  return [
    {
      id: habit.id,
      name: habit.name,
      category: habit.category,
      durationDays: habit.durationDays,
      type,
      date: new Date().toLocaleDateString()
    },
    ...filtered
  ];
}

export default function DashboardPage() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [hiddenIds, setHiddenIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem(HIDDEN_COMPLETED_KEY) || '[]'); }
    catch { return []; }
  });

  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); }
    catch { return []; }
  });

  useEffect(() => {
    api.get('/habits').then((res) => {
      const fetched = res.data || [];
      setHabits(fetched);

        const today = new Date(); today.setHours(0,0,0,0);
        fetched.forEach((h) => {
          const allDone = h.days && h.days.length > 0 && h.days.every((d) =>
            (d.status || '').toLowerCase().trim() === 'done'
          );
          const parts = h.createdDate ? String(h.createdDate).split('T')[0].split('-') : null;
          const start = parts ? new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2])) : null;
          const periodOver = start && Math.floor((today - start) / 86400000) >= h.durationDays;

        if (allDone) {
          setHiddenIds((prev) => prev.includes(h.id) ? prev : [...prev, h.id]);
          setHistory((prev) => {
            if (prev.find((x) => x.id === h.id && x.type === 'completed')) return prev;
            return addToHistory(prev, h, 'completed');
          });
        } else if (periodOver) {
          setHiddenIds((prev) => prev.includes(h.id) ? prev : [...prev, h.id]);
          setHistory((prev) => {
            if (prev.find((x) => x.id === h.id)) return prev;
            return addToHistory(prev, h, 'completed');
          });
        }
      });
    }).catch((err) => {
      setError(err.response?.data?.message || 'Could not load habits.');
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    localStorage.setItem(HIDDEN_COMPLETED_KEY, JSON.stringify(hiddenIds));
  }, [hiddenIds]);

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  const visibleHabits = useMemo(
    () => habits.filter((h) => !hiddenIds.includes(h.id)),
    [habits, hiddenIds]
  );

  // Called by HabitCard when all days are marked done or period over
  const handleCompleted = (habitId) => {
    const habit = habits.find((h) => h.id === habitId);
    if (habit) {
      setHistory((prev) => addToHistory(prev, habit, 'completed'));
    }
    setHiddenIds((prev) => prev.includes(habitId) ? prev : [...prev, habitId]);
    setHabits((prev) => prev.filter((h) => h.id !== habitId));
  };

  // Called by HabitCard on delete
  const handleDeleted = (habitId) => {
    const habit = habits.find((h) => h.id === habitId);
    if (habit) {
      setHistory((prev) => addToHistory(prev, habit, 'deleted'));
    }
    setHabits((prev) => prev.filter((h) => h.id !== habitId));
  };

  return (
    <div className="page-shell">
      <Navbar />
      <NotificationPrompt />
      <div className="dashboard-page">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Your Habits</h1>
            <p className="dashboard-subtitle">Track what you started. Or ignore it creatively.</p>
          </div>
        </div>

        {loading && <p>Loading your habits...</p>}
        {!loading && error && <p className="error-text">{error}</p>}

        {!loading && !error && visibleHabits.length === 0 && (
          <div className="empty-state glass-card">
            <h2>No active habits left</h2>
            <p>Either you finished everything like a maniac, or you have nothing going on.</p>
            <Link to="/add-habit" className="primary-btn">Create New Habit</Link>
          </div>
        )}

        {!loading && !error && visibleHabits.length > 0 && (
          <div className="habit-grid">
            {visibleHabits.map((habit) => (
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
