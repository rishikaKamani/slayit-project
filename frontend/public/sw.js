/* Slayit PWA Service Worker
 * Caches static assets only — never API responses.
 * Safe to fail: if this errors, the app works normally.
 */

const CACHE_NAME = 'slayit-v2';
const NOTIF_KEY = 'slayit_last_notif_date';
const NOTIF_HOUR = 20;

const SASSY_REMINDERS = [
  { title: "👑 Slayit", body: "Your habits are waiting. They're not impressed yet." },
  { title: "🔥 Slayit", body: "Streak check. Don't be the person who forgets." },
  { title: "💀 Slayit", body: "Zero progress today. Bold strategy. Log your habits." },
  { title: "😤 Slayit", body: "Your future self is watching. Don't embarrass them." },
  { title: "💪 Slayit", body: "Consistency is boring. Do it anyway." },
  { title: "🙂 Slayit", body: "Still haven't logged today? Interesting choice." },
  { title: "🔥 Slayit", body: "One log. That's all. You can do one thing." },
  { title: "👑 Slayit", body: "Day's almost over. Don't let it end with zero." },
];

function pickReminder() {
  return SASSY_REMINDERS[Math.floor(Math.random() * SASSY_REMINDERS.length)];
}

// Only cache static shell assets
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

// Install: cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: network-first for API, cache-first for static
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Never intercept API calls — always go to network
  if (url.pathname.startsWith('/api/') || url.hostname !== self.location.hostname) {
    return;
  }

  // For navigation requests (page loads), try network then fall back to cached '/'
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/'))
    );
    return;
  }

  // For static assets: cache-first
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});

// Handle notification click — open/focus the app
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      if (clients.length > 0) {
        return clients[0].focus();
      }
      return self.clients.openWindow('/dashboard');
    })
  );
});

// Periodic background sync (fires when browser supports it)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'slayit-daily-reminder') {
    event.waitUntil(sendDailyReminder());
  }
});

async function sendDailyReminder() {
  const now = new Date();
  if (now.getHours() < NOTIF_HOUR) return;

  const msg = pickReminder();
  await self.registration.showNotification(msg.title, {
    body: msg.body,
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    tag: 'slayit-daily',
    renotify: true,
  });
}
