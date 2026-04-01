import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { onInstallPromptChange, triggerInstall } from '../pwa/register';

const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
const isAndroid = /Android/i.test(navigator.userAgent);

export default function InstallPage() {
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

  return (
    <div className="install-page">
      <div className="install-card glass-card">

        {/* Icon */}
        <div className="install-app-icon">👑</div>

        {/* App info */}
        <h1 className="install-app-name">Slayit</h1>
        <p className="install-app-tagline">Track the work. Not the excuses.</p>

        <div className="install-divider" />

        {installed ? (
          <div className="install-done">
            <p className="install-done-text">✅ Already installed!</p>
            <Link to="/dashboard" className="primary-btn install-open-btn">Open App</Link>
          </div>
        ) : canInstall ? (
          /* Native install prompt available */
          <div className="install-actions">
            <button className="primary-btn install-main-btn" onClick={triggerInstall}>
              ⬇ Install App
            </button>
            <p className="install-hint">Tap to add Slayit to your home screen</p>
          </div>
        ) : isIOS ? (
          /* iOS instructions */
          <div className="install-steps">
            <p className="install-steps-title">Install on iPhone / iPad</p>
            <div className="install-step">
              <span className="install-step-num">1</span>
              <span>Open this page in <strong>Safari</strong></span>
            </div>
            <div className="install-step">
              <span className="install-step-num">2</span>
              <span>Tap the <strong>Share</strong> button <span className="install-icon-inline">□↑</span> at the bottom</span>
            </div>
            <div className="install-step">
              <span className="install-step-num">3</span>
              <span>Scroll down and tap <strong>"Add to Home Screen"</strong></span>
            </div>
            <div className="install-step">
              <span className="install-step-num">4</span>
              <span>Tap <strong>Add</strong> — done!</span>
            </div>
            <a
              href="https://slayit-project.vercel.app/install"
              className="install-copy-link"
              onClick={(e) => {
                e.preventDefault();
                navigator.clipboard.writeText('https://slayit-project.vercel.app/install').catch(() => {});
              }}
            >
              📋 Copy install link to share
            </a>
          </div>
        ) : isAndroid ? (
          /* Android instructions */
          <div className="install-steps">
            <p className="install-steps-title">Install on Android</p>
            <div className="install-step">
              <span className="install-step-num">1</span>
              <span>Open this page in <strong>Chrome</strong></span>
            </div>
            <div className="install-step">
              <span className="install-step-num">2</span>
              <span>Tap the <strong>menu</strong> <span className="install-icon-inline">⋮</span> in the top right</span>
            </div>
            <div className="install-step">
              <span className="install-step-num">3</span>
              <span>Tap <strong>"Add to Home Screen"</strong></span>
            </div>
            <div className="install-step">
              <span className="install-step-num">4</span>
              <span>Tap <strong>Add</strong> — done!</span>
            </div>
            <a
              href="https://slayit-project.vercel.app/install"
              className="install-copy-link"
              onClick={(e) => {
                e.preventDefault();
                navigator.clipboard.writeText('https://slayit-project.vercel.app/install').catch(() => {});
              }}
            >
              📋 Copy install link to share
            </a>
          </div>
        ) : (
          /* Desktop */
          <div className="install-steps">
            <p className="install-steps-title">Install on Desktop</p>
            <div className="install-step">
              <span className="install-step-num">1</span>
              <span>Open in <strong>Chrome</strong> or <strong>Edge</strong></span>
            </div>
            <div className="install-step">
              <span className="install-step-num">2</span>
              <span>Click the <strong>install icon</strong> <span className="install-icon-inline">⊕</span> in the address bar</span>
            </div>
            <div className="install-step">
              <span className="install-step-num">3</span>
              <span>Click <strong>Install</strong></span>
            </div>
          </div>
        )}

        <div className="install-divider" />

        <div className="install-share-row">
          <p className="install-share-label">Share this page with friends</p>
          <CopyLinkButton />
        </div>

        <Link to="/" className="install-back">← Back to Slayit</Link>
      </div>
    </div>
  );
}

function CopyLinkButton() {
  const [copied, setCopied] = useState(false);
  const link = 'https://slayit-project.vercel.app/install';

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (_) {}
  };

  return (
    <button className="install-share-btn ghost-btn" onClick={copy}>
      {copied ? '✓ Copied!' : '🔗 Copy Link'}
    </button>
  );
}
