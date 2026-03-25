import { useState } from 'react';
import Navbar from '../components/Navbar';

const HISTORY_KEY = 'slayit_habit_history';

export default function HistoryPage() {
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    } catch { return []; }
  });

  const handleClear = () => {
    localStorage.removeItem(HISTORY_KEY);
    setHistory([]);
  };

  const completed = history.filter((h) => h.type === 'completed');
  const deleted = history.filter((h) => h.type === 'deleted');

  return (
    <div className="page-shell">
      <Navbar />

      <div className="dashboard-page">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">History</h1>
            <p className="dashboard-subtitle">Everything you finished. And everything you gave up on.</p>
          </div>
          {history.length > 0 && (
            <button className="ghost-btn" onClick={handleClear}>Clear History</button>
          )}
        </div>

        {history.length === 0 && (
          <div className="empty-state glass-card">
            <h2>Nothing here yet</h2>
            <p>Complete or delete a habit and it'll show up here.</p>
          </div>
        )}

        {completed.length > 0 && (
          <div className="history-group">
            <p className="history-group-label">✅ Completed</p>
            <div className="history-list">
              {completed.map((item, i) => (
                <HistoryRow key={`c-${item.id}-${i}`} item={item} />
              ))}
            </div>
          </div>
        )}

        {deleted.length > 0 && (
          <div className="history-group">
            <p className="history-group-label">🗑️ Deleted</p>
            <div className="history-list">
              {deleted.map((item, i) => (
                <HistoryRow key={`d-${item.id}-${i}`} item={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function HistoryRow({ item }) {
  return (
    <div className={`history-item ${item.type === 'completed' ? 'history-completed' : 'history-deleted'}`}>
      <div className="history-item-left">
        <span className="history-icon">{item.type === 'completed' ? '✅' : '🗑️'}</span>
        <div>
          <p className="history-name">{item.name}</p>
          <p className="history-meta">{item.category} · {item.durationDays} day goal</p>
        </div>
      </div>
      <div className="history-item-right">
        <span className={`history-badge ${item.type === 'completed' ? 'badge-done' : 'badge-deleted'}`}>
          {item.type === 'completed' ? 'Completed' : 'Deleted'}
        </span>
        <span className="history-date">{item.date}</span>
      </div>
    </div>
  );
}
