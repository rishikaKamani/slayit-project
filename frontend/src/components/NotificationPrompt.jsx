import { useEffect, useState } from 'react';
import { requestNotificationPermission, canNotify } from '../utils/notificationService';

const DISMISSED_KEY = 'slayit_notif_dismissed';

export default function NotificationPrompt() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (canNotify()) return;
    if (localStorage.getItem(DISMISSED_KEY)) return;
    if (!('Notification' in window)) return;
    if (Notification.permission === 'denied') return;
    const t = setTimeout(() => setShow(true), 3000);
    return () => clearTimeout(t);
  }, []);

  const handleEnable = async () => {
    const result = await requestNotificationPermission();
    if (result === 'granted' || result === 'denied') setShow(false);
  };

  const handleDismiss = () => {
    localStorage.setItem(DISMISSED_KEY, '1');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="notif-prompt-overlay" onClick={handleDismiss}>
      <div className="notif-prompt glass-card" onClick={(e) => e.stopPropagation()}>
        <span className="notif-prompt-emoji">??</span>
        <h3>Stay on track</h3>
        <p className="notif-prompt-text">
          Get morning reminders and evening nudges when habits are incomplete.
        </p>
        <div className="notif-prompt-actions">
          <button className="primary-btn" onClick={handleEnable}>Enable Notifications</button>
          <button className="ghost-btn" onClick={handleDismiss}>Not now</button>
        </div>
      </div>
    </div>
  );
}
