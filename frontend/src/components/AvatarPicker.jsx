import { useState } from 'react';
import {
  AVATAR_TYPES, AVATAR_GRADIENTS, EMOJI_AVATARS,
  getAvatarGradientStyle, getEmojiById,
} from '../utils/avatarConfig';

/**
 * Avatar customization picker.
 * Props: value (avatar config object), onChange, initial (user's letter)
 */
export default function AvatarPicker({ value, onChange, initial = '?' }) {
  const [tab, setTab] = useState(value.type || 'initial');

  const set = (patch) => {
    const updated = { ...value, ...patch };
    onChange(updated);
  };

  const previewGrad = getAvatarGradientStyle(value.gradient);
  const previewEmoji = getEmojiById(value.emoji);

  return (
    <div className="avatar-picker">
      {/* Live preview */}
      <div className="avatar-picker-preview">
        <div
          className="avatar-circle avatar-circle-lg avatar-custom"
          style={{ background: previewGrad }}
        >
          {tab === 'emoji'
            ? <span className="avatar-emoji">{previewEmoji}</span>
            : initial
          }
        </div>
        <p className="avatar-picker-preview-label">Preview</p>
      </div>

      {/* Type tabs */}
      <div className="avatar-type-tabs">
        {AVATAR_TYPES.map((t) => (
          <button
            key={t.value}
            type="button"
            className={`avatar-type-tab ${tab === t.value ? 'avatar-tab-active' : ''}`}
            onClick={() => { setTab(t.value); set({ type: t.value }); }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Emoji grid */}
      {tab === 'emoji' && (
        <div className="avatar-emoji-grid">
          {EMOJI_AVATARS.map((e) => (
            <button
              key={e.id}
              type="button"
              className={`avatar-emoji-btn ${value.emoji === e.id ? 'avatar-emoji-active' : ''}`}
              onClick={() => set({ emoji: e.id, type: 'emoji' })}
              aria-label={e.emoji}
            >
              {e.emoji}
            </button>
          ))}
        </div>
      )}

      {/* Gradient picker — shown for both types */}
      <p className="avatar-grad-label">Background</p>
      <div className="avatar-grad-grid">
        {AVATAR_GRADIENTS.map((g) => (
          <button
            key={g.id}
            type="button"
            className={`avatar-grad-btn ${value.gradient === g.id ? 'avatar-grad-active' : ''}`}
            style={{ background: g.style }}
            onClick={() => set({ gradient: g.id })}
            aria-label={g.label}
            title={g.label}
          >
            {value.gradient === g.id && <span className="avatar-grad-check">✓</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
