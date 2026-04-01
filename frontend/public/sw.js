/* Slayit PWA Service Worker
 * Caches static assets only — never API responses.
 * Safe to fail: if this errors, the app works normally.
 */

const CACHE_NAME = 'slayit-v5';

// Only cache icons and manifest — never JS/CSS
const STATIC_ASSETS = [
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/manifest.json',
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

// Fetch: never cache JS/CSS — always network. Only cache icons.
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Never intercept API calls
  if (url.pathname.startsWith('/api/') || url.hostname !== self.location.hostname) {
    return;
  }

  // JS/CSS/HTML: always network — never serve stale code
  if (
    event.request.mode === 'navigate' ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.html')
  ) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Icons/images: cache-first
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});

// Handle notification click — open/focus the app
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || '/dashboard';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      // If app is already open, focus it
      for (const client of clients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      // Otherwise open a new window
      return self.clients.openWindow(url);
    })
  );
});

// Periodic background sync (fires when browser supports it)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'slayit-daily-reminder') {
    event.waitUntil(
      self.registration.showNotification('👑 Slayit', {
        body: "Don't forget to log your habits today.",
        icon: '/icons/icon-192.png',
        badge: '/icons/icon-192.png',
        tag: 'slayit-daily',
        renotify: true,
      })
    );
  }
});
