import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { generateShareCard, downloadShareCard } from '../utils/shareCard';

export default function BadgePage() {
  const [params] = useSearchParams();
  const [dataUrl, setDataUrl] = useState(null);
  const [copied, setCopied] = useState(false);
  const generated = useRef(false);

  const habitName = params.get('habit') || 'My Habit';
  const streak = Number(params.get('streak') || 0);
  const completed = Number(params.get('completed') || 0);
  const total = Number(params.get('total') || 1);
  const category = params.get('category') || 'HABIT';

  useEffect(() => {
    if (generated.current) return;
    generated.current = true;
    const url = generateShareCard({ habitName, streak, completed, total, category });
    setDataUrl(url);
  }, []);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (_) {}
  };

  return (
    <div className="badge-page">
      <div className="badge-shell glass-card">
        <p className="eyebrow">Streak Badge</p>
        <h1 className="badge-title">{habitName}</h1>
        <p className="badge-sub">{streak} day streak · {completed}/{total} days done</p>

        {dataUrl ? (
          <img src={dataUrl} alt="streak badge" className="badge-img" />
        ) : (
          <div className="badge-loading">Generating badge...</div>
        )}

        <div className="badge-actions">
          <button
            className="primary-btn badge-btn"
            onClick={() => dataUrl && downloadShareCard(dataUrl, habitName)}
            disabled={!dataUrl}
          >
            ⬇ Download Badge
          </button>
          <button className="ghost-btn badge-btn" onClick={handleCopyLink}>
            {copied ? '✓ Copied!' : '🔗 Copy Link'}
          </button>
        </div>

        <p className="badge-footer">
          Made with <a href="/" className="badge-link">Slayit</a>
        </p>
      </div>
    </div>
  );
}
