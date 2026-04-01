// ── Smart Notification Service ──
// Standalone module — does NOT touch existing state logic

const NOTIF_MORNING_KEY = 'slayit_notif_morning';
const NOTIF_EVENING_KEY = 'slayit_notif_evening';
const NOTIF_INACTIVITY_KEY = 'slayit_notif_inactivity';
const LAST_ACTIVE_KEY = 'slayit_last_active';

export function recordActivity() {
  localStorage.setItem(LAST_ACTIVE_KEY, Date.now().toString());
}

export function getLastActiveDate() {
  const raw = localStorage.getItem(LAST_ACTIVE_KEY);
  return raw ? new Date(Number(raw)) : null;
}

export function getDaysSinceActive() {
  const last = getLastActiveDate();
  if (!last) return 0;
  const now = new Date();
  return Math.floor((now - last) / (1000 * 60 * 60 * 24));
}

export function isInactive() {
  return getDaysSinceActive() >= 2;
}

// Request browser notification permission
export async function requestNotificationPermission() {
  if (!('Notification' in window)) return 'unsupported';
  if (Notification.permission === 'granted') return 'granted';
  if (Notification.permission === 'denied') return 'denied';
  const result = await Notification.requestPermission();
  return result;
}

export function canNotify() {
  return 'Notification' in window && Notification.permission === 'granted';
}

function sendNotification(title, body, tag) {
  if (!canNotify()) return;
  try {
    new Notification(title, {
      body,
      tag,
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
    });
  } catch (_) {}
}

// Schedule morning reminder (8 AM)
export function scheduleMorningReminder() {
  const now = new Date();
  const target = new Date();
  target.setHours(8, 0, 0, 0);
  if (now >= target) target.setDate(target.getDate() + 1);
  const delay = target - now;

  const existing = localStorage.getItem(NOTIF_MORNING_KEY);
  if (existing && Number(existing) > Date.now()) return; // already scheduled for today

  localStorage.setItem(NOTIF_MORNING_KEY, target.getTime().toString());

  setTimeout(() => {
    sendNotification(
      "Morning check-in 🌅",
      "Your habits are waiting. Don't make them wait too long.",
      'slayit-morning'
    );
    localStorage.removeItem(NOTIF_MORNING_KEY);
  }, delay);
}

// Schedule evening reminder (8 PM) — only if habits are incomplete
export function scheduleEveningReminder(hasIncomplete) {
  if (!hasIncomplete) return;

  const now = new Date();
  const target = new Date();
  target.setHours(20, 0, 0, 0);
  if (now >= target) return; // already past 8 PM

  const existing = localStorage.getItem(NOTIF_EVENING_KEY);
  if (existing && Number(existing) > Date.now()) return;

  localStorage.setItem(NOTIF_EVENING_KEY, target.getTime().toString());

  const delay = target - now;
  setTimeout(() => {
    sendNotification(
      "Evening reminder 🌙",
      "Still have habits to complete today. Clock's ticking.",
      'slayit-evening'
    );
    localStorage.removeItem(NOTIF_EVENING_KEY);
  }, delay);
}

// Inactivity notification — fires immediately if 2+ days inactive
export function checkInactivityNotification() {
  if (!isInactive()) return;

  const lastSent = localStorage.getItem(NOTIF_INACTIVITY_KEY);
  const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
  if (lastSent && Number(lastSent) > oneDayAgo) return; // don't spam

  localStorage.setItem(NOTIF_INACTIVITY_KEY, Date.now().toString());

  sendNotification(
    "You've been gone a while 👀",
    `${getDaysSinceActive()} days of silence. Your habits are collecting dust.`,
    'slayit-inactivity'
  );
}

// Call this once on app load
export function initNotifications(hasIncomplete = false) {
  if (!canNotify()) return;
  scheduleMorningReminder();
  scheduleEveningReminder(hasIncomplete);
  checkInactivityNotification();
}
