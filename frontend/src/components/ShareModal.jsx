import { useState } from 'react';
import { generateShareCard, downloadShareCard, shareCard } from '../utils/shareCard';

/**
 * Enhanced share modal with optional caption and stats overlay.
 * Wraps existing share functionality — does NOT modify shareCard.js.
 */
export default function ShareModal({ habit, streak, completedCount, duration, onClose }) {
  const [caption, setCaption] = useState('');
  const [showStats, setShowStats] = useState(true);
  const [copied, setCopied] = useState(false);

  // Generate card with current options
  const getDataUrl = () =>
    generateShareCard({
      habitName: habit.name,
      streak,
      completed: showStats ? completedCount : 0,
      total: showStats ? duration : 0,
      category: habit.category,
    });

  const [preview] = useState(() => getDataUrl());

  const handleDownload = () => {
    downloadShareCard(preview, habit.name);
  };

  const handleShare = async () => {
    const result = await shareCard(preview, habit.name, streak);
    if (result === 'copied' || result === 'shared') {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="share-modal-overlay" onClick={onClose}>
      <div className="share-modal" onClick={(e) => e.stopPropagation()}>
        <div className="share-modal-header">
          <p className="share-modal-title">Your streak card 🔥</p>
          <button className="share-x-btn" onClick={onClose}>x</button>
        </div>

        <img src={preview} alt="streak card" className="share-preview-img" />

        {/* Optional caption */}
        <div className="share-caption-row">
          <input
            className="share-caption-input"
            placeholder="Add a caption (optional)..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            maxLength={80}
          />
        </div>

        {/* Stats overlay toggle */}
        <label className="share-stats-toggle">
          <input
            type="checkbox"
            checked={showStats}
            onChange={(e) => setShowStats(e.target.checked)}
          />
          <span>Show progress stats on card</span>
        </label>

        <p className="share-modal-hint">
          {caption ? `"${caption}"` : 'Flex this. You earned it.'}
        </p>

        <div className="share-modal-actions">
          <button className="share-download-btn" onClick={handleDownload}>Download</button>
          <button className="share-link-btn" onClick={handleShare}>
            {copied ? 'Copied!' : 'Share Link'}
          </button>
        </div>
      </div>
    </div>
  );
}
