/* PWA Install Button — always visible on dashboard.
 * Shows native install prompt if available,
 * otherwise shows "Add to Home Screen" instructions.
 */
import { useEffect, useState } from 'react';
import { onInstallPromptChange, triggerInstall } from './register';

const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
const isAndroid = /Android/i.test(navigator.userAgent);
const isMobile = isIOS || isAndroid;

export default function InstallButton() {
  const [canInstall, setCanInstall] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    const unsub = onInstallPromptChange((prompt) => {
      setCanInstall(!!prompt);
    });

    const onInstalled = () => { setInstalled(true); setCanInstall(false); };
    window.addEventListener('appinstalled', onInstalled);

    // Check if already running as installed PWA
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalled(true);
    }

    return () => {
      unsub();
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  if (installed) return null;

  // Native install available
  if (canInstall) {
    return (
      <div className="pwa-install-card glass-card">
        <span className="pwa-install-icon">👑</span>
        <div className="pwa-install-text">
          <p className="pwa-install-title">Install Slayit App</p>
          <p className="pwa-install-sub">Add to home screen for the full experience</p>
        </div>
        <button className="primary-btn pwa-install-btn" onClick={triggerInstall}>
          Install
        </button>
      </div>
    );
  }

  // Fallback: show manual instructions
  if (showFallback) {
    const instruction = isIOS
      ? 'Tap the Share button (□↑) → "Add to Home Screen"'
      : isAndroid
      ? 'Tap the menu (⋮) → "Add to Home Screen"'
      : 'Open in Chrome → click ⋮ menu → "Install Slayit"';

    return (
      <div className="pwa-install-card glass-card">
        <span className="pwa-install-icon">👑</span>
        <div className="pwa-install-text">
          <p className="pwa-install-title">Install Slayit App</p>
          <p className="pwa-install-sub">{instruction}</p>
        </div>
        <button className="ghost-btn pwa-install-btn" onClick={() => setShowFallback(false)}>
          Got it
        </button>
      </div>
    );
  }

  // Default: show install card with "How?" button
  return (
    <div className="pwa-install-card glass-card">
      <span className="pwa-install-icon">👑</span>
      <div className="pwa-install-text">
        <p className="pwa-install-title">Install Slayit App</p>
        <p className="pwa-install-sub">Get the full app experience on your device</p>
      </div>
      <button className="primary-btn pwa-install-btn" onClick={() => setShowFallback(true)}>
        How?
      </button>
    </div>
  );
}
