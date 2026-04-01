/* PWA Install Button — always visible on dashboard.
 * Links to /install page for full instructions.
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { onInstallPromptChange, triggerInstall } from './register';

export default function InstallButton() {
  const [canInstall, setCanInstall] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalled(true);
    }
    const unsub = onInstallPromptChange((p) => setCanInstall(!!p));
    const onDone = () => { setInstalled(true); setCanInstall(false); };
    window.addEventListener('appinstalled', onDone);
    return () => { unsub(); window.removeEventListener('appinstalled', onDone); };
  }, []);

  if (installed) return null;

  return (
    <div className="pwa-install-card glass-card">
      <span className="pwa-install-icon">👑</span>
      <div className="pwa-install-text">
        <p className="pwa-install-title">Install Slayit App</p>
        <p className="pwa-install-sub">Add to your home screen — no app store needed</p>
      </div>
      {canInstall ? (
        <button className="primary-btn pwa-install-btn" onClick={triggerInstall}>
          Install
        </button>
      ) : (
        <Link to="/install" className="primary-btn pwa-install-btn">
          Get App
        </Link>
      )}
    </div>
  );
}
