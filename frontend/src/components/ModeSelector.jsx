import { useState } from 'react';
import { getMode, setMode } from '../utils/feedbackMessages';

const MODES = [
  { value: 'soft', label: 'Soft', desc: 'Gentle and supportive' },
  { value: 'discipline', label: 'Discipline', desc: 'Honest and direct (default)' },
  { value: 'savage', label: 'Savage', desc: 'Zero mercy, maximum sarcasm' },
];

/**
 * Mode selector — only affects new feedback messages.
 * Existing UI text is untouched.
 */
export default function ModeSelector() {
  const [current, setCurrent] = useState(getMode);

  const handleChange = (val) => {
    setMode(val);
    setCurrent(val);
  };

  return (
    <div className="mode-selector">
      <p className="mode-selector-label">Feedback Mode</p>
      <div className="mode-options">
        {MODES.map((m) => (
          <button
            key={m.value}
            className={`mode-btn ${current === m.value ? 'mode-btn-active' : ''}`}
            onClick={() => handleChange(m.value)}
            title={m.desc}
          >
            {m.label}
          </button>
        ))}
      </div>
      <p className="mode-desc">{MODES.find((m) => m.value === current)?.desc}</p>
    </div>
  );
}
