import { useState } from 'react';
import { EXCUSE_OPTIONS, saveExcuse } from '../utils/excuseTracker';

/**
 * Non-intrusive excuse modal — shown after missing a habit.
 * User can skip at any time. Does NOT block existing UI flow.
 */
export default function ExcuseModal({ habitId, habitName, onClose }) {
  const [selected, setSelected] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!selected) return;
    saveExcuse(habitId, habitName, selected);
    setSaved(true);
    setTimeout(onClose, 900);
  };

  return (
    <div className="excuse-overlay" onClick={onClose}>
      <div className="excuse-modal glass-card" onClick={(e) => e.stopPropagation()}>
        <p className="excuse-title">What happened?</p>
        <p className="excuse-sub">Optional. We won't judge. Much.</p>
        <div className="excuse-options">
          {EXCUSE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className={`excuse-option-btn ${selected === opt.value ? 'excuse-selected' : ''}`}
              onClick={() => setSelected(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {saved ? (
          <p className="excuse-saved">Noted. 👀</p>
        ) : (
          <div className="excuse-actions">
            <button className="primary-btn excuse-submit-btn" onClick={handleSave} disabled={!selected}>
              Save
            </button>
            <button className="ghost-btn" onClick={onClose}>Skip</button>
          </div>
        )}
      </div>
    </div>
  );
}
