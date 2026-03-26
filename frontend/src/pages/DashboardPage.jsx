import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import HabitCard from '../components/HabitCard';
import NotificationPrompt from '../components/NotificationPrompt';
import api from '../api/client';

const HIDDEN_COMPLETED_KEY = 'slayit_hidden_completed_habits';
const HISTORY_KEY = 'slayit_habit_history';

function addToHistory(prev, habit, type) {
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

function parseCreatedDate(createdDate) {
  if (!createdDate) return null;
  // Handle array format [2026, 3, 25] from Java LocalDate without JavaTime module
  if (Array.isArray(createdDate)) {
    return new Date(createdDate[0], createdDate[1] - 1, createdDate[2]);
  }
  // Handle string format "2026-03-25" or "2026-03-25T00:00:00"
  const parts = String(createdDate).split('T')[0].split('-');
  return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
}

function isPeriodOver(h) {
  const start = parseCreatedDate(h.createdDate);
  if (!start) return false;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return Math.floor((today - start) / 86400000) >= h.durationDays;
}

function isAllDone(h) {
  return h.days && h.days.length > 0 && h.days.every((d) =>
    (d.status || '').toLowerCase().trim() === 'done'
  );
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
      const newHistoryEntries = [];

      fetched.forEach((h) => {
        if (isAllDone(h)) {
          newHistoryEntries.push({ ...h, type: 'completed' });
        } else if (isPeriodOver(h)) {
          newHistoryEntries.push({ ...h, type: 'completed' });
        } else {
          active.push(h);
        }
      });

      setHabits(active);
      habitsRef.current = active;

      if (newHistoryEntries.length > 0) {
        setHistory((prev) => {
          let updated = [...prev];
          newHistoryEntries.forEach((h) => {
            if (!updated.find((x) => x.id === h.id)) {
              updated = addToHistory(updated, h, h.type);
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

  // Called by HabitCard when all days are marked done
  const handleCompleted = (habitId) => {
    const habit = habitsRef.current.find((h) => h.id === habitId);
    if (habit) {
      setHistory((prev) => addToHistory(prev, habit, 'completed'));
    }
    setHabits((prev) => {
      const updated = prev.filter((h) => h.id !== habitId);
      habitsRef.current = updated;
      return updated;
    });
  };

  // Called by HabitCard on delete
  const handleDeleted = (habitId) => {
    const habit = habitsRef.current.find((h) => h.id === habitId);
    if (habit) {
      setHistory((prev) => addToHistory(prev, habit, 'deleted'));
    }
    setHabits((prev) => {
      const updated = prev.filter((h) => h.id !== habitId);
      habitsRef.current = updated;
      return updated;
    });
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

