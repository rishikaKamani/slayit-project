import { useEffect, useState } from 'react';

const NOTIF_KEY = 'slayit_last_notif_date';
const NOTIF_HOUR = 20; // 8 PM — remind users in the evening

const SASSY_REMINDERS = [
  { title: "👑 Slayit", body: "Your habits are waiting. They're not impressed yet." },
  { title: "🔥 Slayit", body: "Streak check. Don't be the person who forgets." },
  { title: "💀 Slayit", body: "Zero progress today. Bold strategy. Log your habits." },
  { title: "😤 Slayit", body: "Your future self is watching. Don't embarrass them." },
  { title: "👑 Slayit", body: "The streak doesn't maintain itself. You do. Go." },
  { title: "🙂 Slayit", body: "Still haven't logged today? Interesting choice." },
  { title: "💪 Slayit", body: "Consistency is boring. Do it anyway." },
  { title: "🔥 Slayit", body: "One log. That's all. You can do one thing." },
  { title: "😬 Slayit", body: "Your habits miss you. Well, not really. But log them." },
  { title: "👑 Slayit", body: "Day's almost over. Don't let it end with zero." },
];

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function shouldNotifyToday() {
  const last = localStorage.getItem(NOTIF_KEY);
  const today = new Date().toDateString();
  return last !== today;
}

function markNotifiedToday() {
  localStorage.setItem(NOTIF_KEY, new Date().toDateString());
}

function fireReminder(force = false) {
  if (Notification.permission !== 'granted') return;
  if (!force && !shouldNotifyToday()) return;

  const msg = pick(SASSY_REMINDERS);
  const notif = new Notification(msg.title, {
    body: msg.body,
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    tag: 'slayit-daily',
    renotify: true,
  });

  notif.onclick = () => {
    window.focus();
    notif.close();
  };

  if (!force) markNotifiedToday();
}

function scheduleCheck() {
  // Check every minute if it's time to notify (after NOTIF_HOUR)
  const now = new Date();
  if (now.getHours() >= NOTIF_HOUR && shouldNotifyToday()) {
    fireReminder();
  }
}

export function testNotification() {
  if (Notification.permission !== 'granted') {
    alert('Notifications not allowed. Enable them first.');
    return;
  }
  fireReminder(true);
}

export default function NotificationPrompt() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!('Notification' in window)) return;

    if (Notification.permission === 'granted') {
      // Already allowed — run check immediately + every minute
      scheduleCheck();
      const interval = setInterval(scheduleCheck, 60 * 1000);
      return () => clearInterval(interval);
    } else if (Notification.permission !== 'denied') {
      // Show our custom prompt after 2s
      const t = setTimeout(() => setShow(true), 2000);
      return () => clearTimeout(t);
    }
  }, []);

  // Also fire on window focus (user comes back to app)
  useEffect(() => {
    if (Notification.permission !== 'granted') return;
    const onFocus = () => scheduleCheck();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  const handleAllow = async () => {
    setShow(false);
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      // Welcome notification immediately
      new Notification('👑 Slayit', {
        body: "Notifications on. We'll remind you to keep your streaks alive.",
        icon: '/icons/icon-192.png',
        tag: 'slayit-welcome',
      });
      // Start the daily check
      scheduleCheck();
      setInterval(scheduleCheck, 60 * 1000);
    }
  };

  if (!show) return null;

  return (
    <div className="notif-prompt-overlay">
      <div className="notif-prompt glass-card">
        <p className="notif-prompt-emoji">🔔</p>
        <h3>Don't ghost your habits</h3>
        <p className="notif-prompt-text">
          Allow notifications and we'll remind you every evening before you forget. Again.
        </p>
        <div className="notif-prompt-actions">
          <button className="primary-btn" onClick={handleAllow}>Allow</button>
          <button className="ghost-btn" onClick={() => setShow(false)}>No thanks</button>
        </div>
      </div>
    </div>
  );
}
