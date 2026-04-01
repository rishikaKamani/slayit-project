import { useEffect, useState } from 'react';

const NOTIF_KEY = 'slayit_last_notif_date';
const NOTIF_HOUR = 20; // 8 PM

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
  return localStorage.getItem(NOTIF_KEY) !== new Date().toDateString();
}

function markNotifiedToday() {
  localStorage.setItem(NOTIF_KEY, new Date().toDateString());
}

// Always use SW showNotification — works on mobile as a real system notification
async function showViaServiceWorker(title, body, force = false) {
  if (Notification.permission !== 'granted') return;
  if (!force && !shouldNotifyToday()) return;

  const reg = await navigator.serviceWorker?.ready;
  if (!reg) return;

  await reg.showNotification(title, {
    body,
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    tag: 'slayit-daily',
    renotify: true,
    vibrate: [200, 100, 200],
    data: { url: '/dashboard' },
  });

  if (!force) markNotifiedToday();
}

export async function testNotification() {
  if (Notification.permission !== 'granted') {
    alert('Notifications not allowed. Enable them first from the prompt.');
    return;
  }
  const msg = pick(SASSY_REMINDERS);
  await showViaServiceWorker(msg.title, msg.body, true);
}

function scheduleCheck() {
  const now = new Date();
  if (now.getHours() >= NOTIF_HOUR && shouldNotifyToday()) {
    const msg = pick(SASSY_REMINDERS);
    showViaServiceWorker(msg.title, msg.body);
  }
}

export default function NotificationPrompt() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!('Notification' in window) || !('serviceWorker' in navigator)) return;

    if (Notification.permission === 'granted') {
      scheduleCheck();
      const interval = setInterval(scheduleCheck, 60 * 1000);
      return () => clearInterval(interval);
    } else if (Notification.permission !== 'denied') {
      const t = setTimeout(() => setShow(true), 2000);
      return () => clearTimeout(t);
    }
  }, []);

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
      await showViaServiceWorker('👑 Slayit', "Notifications on. We'll remind you to keep your streaks alive.", true);
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
