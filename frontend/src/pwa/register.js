/* PWA Service Worker Registration
 * - Only runs in production
 * - Fails silently — never breaks the app
 * - Exposes deferredPrompt for install button
 */

const isProd = import.meta.env.PROD;

// Holds the beforeinstallprompt event for later use
let deferredPrompt = null;
const listeners = [];

function notifyListeners() {
  listeners.forEach((fn) => fn(deferredPrompt));
}

/** Subscribe to install prompt availability changes */
export function onInstallPromptChange(fn) {
  listeners.push(fn);
  // Immediately call with current state
  fn(deferredPrompt);
  return () => {
    const i = listeners.indexOf(fn);
    if (i !== -1) listeners.splice(i, 1);
  };
}

/** Trigger the native install prompt. Returns true if shown. */
export async function triggerInstall() {
  if (!deferredPrompt) return false;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  deferredPrompt = null;
  notifyListeners();
  return outcome === 'accepted';
}

/** Register the service worker — call once at app startup */
export function registerPWA() {
  if (!isProd) {
    // Dev mode: skip everything
    return;
  }

  // Capture install prompt
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    notifyListeners();
  });

  // Clear prompt after install
  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    notifyListeners();
  });

  // Register service worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          // Register periodic background sync if supported
          if ('periodicSync' in reg) {
            reg.periodicSync.register('slayit-daily-reminder', {
              minInterval: 12 * 60 * 60 * 1000, // every 12 hours
            }).catch(() => {});
          }
        })
        .catch(() => {
          // Fail silently — app works without SW
        });
    });
  }
}
