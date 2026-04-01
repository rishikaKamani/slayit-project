/* PWA Install Button — shown on dashboard only when install is available.
 * Completely isolated: if PWA is unsupported, renders nothing.
 */
import { useEffect, useState } from 'react';
import { onInstallPromptChange, triggerInstall } from './register';

export default function InstallButton() {
  const [canInstall, setCanInstall] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // Subscribe to prompt availability
    const unsub = onInstallPromptChange((prompt) => {
      setCanInstall(!!prompt);
    });

    // Hide after install
    const onInstalled = () => { setInstalled(true); setCanInstall(false); };
    window.addEventListener('appinstalled', onInstalled);

    return () => {
      unsub();
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  if (!canInstall || installed) return null;

  const handleInstall = async () => {
    await triggerInstall();
  };

  return (
    <div className="pwa-install-card glass-card">
      <span className="pwa-install-icon">👑</span>
      <div className="pwa-install-text">
        <p className="pwa-install-title">Install Slayit App</p>
        <p className="pwa-install-sub">Add to home screen for the full experience</p>
      </div>
      <button className="primary-btn pwa-install-btn" onClick={handleInstall}>
        Install
      </button>
    </div>
  );
}
