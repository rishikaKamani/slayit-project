import { useEffect, useState } from 'react';

/**
 * Visual-only toast for streak break events.
 * Does NOT touch streak calculation logic.
 */
export default function StreakToast({ message, onDone }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 350);
    }, 3200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`streak-toast ${visible ? 'streak-toast-in' : 'streak-toast-out'}`}>
      <span className="streak-toast-icon">💔</span>
      <span className="streak-toast-text">{message}</span>
    </div>
  );
}
