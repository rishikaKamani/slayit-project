import { useEffect, useState } from 'react';

export default function NotificationPrompt() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!('Notification' in window)) return;

    const t = setTimeout(() => {
      if (Notification.permission === 'granted') {
        // Already allowed — just fire the reminder directly, no prompt needed
        new Notification('Slayit', {
          body: "Welcome back. Don't break your streak today.",
          icon: '/favicon.ico'
        });
      } else if (Notification.permission !== 'denied') {
        // Not decided yet — show our custom prompt
        setShow(true);
      }
      // If denied, do nothing
    }, 1200);

    return () => clearTimeout(t);
  }, []);

  const handleAllow = async () => {
    setShow(false);
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      new Notification('Slayit', {
        body: "Notifications on. We'll remind you to keep your streaks alive.",
        icon: '/favicon.ico'
      });
    }
  };

  if (!show) return null;

  return (
    <div className="notif-prompt-overlay">
      <div className="notif-prompt glass-card">
        <p className="notif-prompt-emoji">🔔</p>
        <h3>Stay on track</h3>
        <p className="notif-prompt-text">
          Allow notifications and we'll remind you to log your habits every time you log in.
        </p>
        <div className="notif-prompt-actions">
          <button className="primary-btn" onClick={handleAllow}>Allow</button>
          <button className="ghost-btn" onClick={() => setShow(false)}>No thanks</button>
        </div>
      </div>
    </div>
  );
}
