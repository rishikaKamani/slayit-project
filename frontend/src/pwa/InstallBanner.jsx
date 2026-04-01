/* PWA Mobile Install Banner
 * - Shows only on mobile
 * - Shows only once (localStorage flag)
 * - Dismissable
 * - Fails silently if unsupported
 */
import { useEffect, useState } from 'react';
import { onInstallPromptChange, triggerInstall } from './register';

const BANNER_KEY = 'slayit_pwa_banner_dismissed';
const isMobile = () => /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

export default function InstallBanner() {
  const [show, setShow] = useState(false);
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    if (!isMobile()) return;
    if (localStorage.getItem(BANNER_KEY)) return;

    const unsub = onInstallPromptChange((prompt) => {
      setCanInstall(!!prompt);
      if (prompt) setShow(true);
    });

    return unsub;
  }, []);

  const dismiss = () => {
    localStorage.setItem(BANNER_KEY, '1');
    setShow(false);
  };

  const install = async () => {
    await triggerInstall();
    dismiss();
  };

  if (!show || !canInstall) return null;

  return (
    <div className="pwa-banner glass-card">
      <span className="pwa-banner-icon">👑</span>
      <p className="pwa-banner-text">Install Slayit for a better experience 👑</p>
      <div className="pwa-banner-actions">
        <button className="primary-btn pwa-banner-install" onClick={install}>Install</button>
        <button className="ghost-btn pwa-banner-dismiss" onClick={dismiss}>Dismiss</button>
      </div>
    </div>
  );
}
