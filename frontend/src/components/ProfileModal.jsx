import { useEffect, useState } from 'react';
import { loadPrefs, savePrefs, DEFAULT_PREFS } from '../utils/userPrefs';
import { useAuth } from '../context/AuthContext';

// ── Pill selector — replaces boring radio buttons ──
function PillGroup({ options, value, onChange }) {
  return (
    <div className="pill-group">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={`pill-btn ${value === opt.value ? 'pill-active' : ''}`}
          onClick={() => onChange(opt.value)}
        >
          {opt.emoji && <span className="pill-emoji">{opt.emoji}</span>}
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ── Toggle switch ──
function Toggle({ checked, onChange, label }) {
  return (
    <label className="pref-toggle">
      <span className="pref-toggle-label">{label}</span>
      <div
        className={`toggle-track ${checked ? 'toggle-on' : ''}`}
        onClick={() => onChange(!checked)}
        role="switch"
        aria-checked={checked}
        tabIndex={0}
        onKeyDown={(e) => e.key === ' ' && onChange(!checked)}
      >
        <div className="toggle-thumb" />
      </div>
    </label>
  );
}

// ── Section card ──
function PrefSection({ title, children }) {
  return (
    <div className="pref-section">
      <p className="pref-section-title">{title}</p>
      {children}
    </div>
  );
}

export default function ProfileModal({ onClose }) {
  const { user } = useAuth();
  const email = user?.email;
  const firstName = user?.name?.split(' ')[0] || 'User';

  const [prefs, setPrefs] = useState(() => loadPrefs(email));
  const [saved, setSaved] = useState(false);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const set = (key, val) => setPrefs((p) => ({ ...p, [key]: val }));

  const handleSave = () => {
    savePrefs(email, prefs);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const initial = firstName.charAt(0).toUpperCase();

  return (
    <div className="profile-modal-overlay" onClick={onClose}>
      <div className="profile-modal glass-card" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="profile-modal-header">
          <div className="profile-modal-avatar">{initial}</div>
          <div className="profile-modal-identity">
            <p className="profile-modal-name">{prefs.nickname || firstName}</p>
            <p className="profile-modal-email">{email}</p>
          </div>
          <button className="profile-close-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="profile-modal-body">

          {/* Nickname */}
          <PrefSection title="Display name">
            <input
              className="pref-input"
              placeholder={`e.g. ${firstName}, champ, boss...`}
              value={prefs.nickname}
              onChange={(e) => set('nickname', e.target.value)}
              maxLength={24}
            />
          </PrefSection>

          {/* Greeting style */}
          <PrefSection title="How should SlayIt greet you?">
            <PillGroup
              value={prefs.greetingStyle}
              onChange={(v) => set('greetingStyle', v)}
              options={[
                { value: 'casual',       label: 'Casual',       emoji: '👋' },
                { value: 'motivational', label: 'Hype me up',   emoji: '🔥' },
                { value: 'sarcastic',    label: 'Sarcastic',    emoji: '😏' },
              ]}
            />
          </PrefSection>

          {/* Tone */}
          <PrefSection title="What tone do you want from SlayIt?">
            <PillGroup
              value={prefs.toneMode}
              onChange={(v) => set('toneMode', v)}
              options={[
                { value: 'soft',       label: 'Soft',       emoji: '🌸' },
                { value: 'discipline', label: 'Discipline', emoji: '💼' },
                { value: 'savage',     label: 'Savage',     emoji: '💀' },
              ]}
            />
            <p className="pref-hint">
              {prefs.toneMode === 'soft'       && 'Gentle, supportive messages.'}
              {prefs.toneMode === 'discipline' && 'Direct, honest, no fluff.'}
              {prefs.toneMode === 'savage'     && 'Zero mercy. Maximum sarcasm.'}
            </p>
          </PrefSection>

          {/* Motivation style */}
          <PrefSection title="How should SlayIt motivate you?">
            <PillGroup
              value={prefs.motivationStyle}
              onChange={(v) => set('motivationStyle', v)}
              options={[
                { value: 'gentle',      label: 'Encourage me gently', emoji: '🤗' },
                { value: 'accountable', label: 'Keep me accountable',  emoji: '📋' },
                { value: 'brutal',      label: 'Be brutally honest',   emoji: '🔨' },
              ]}
            />
          </PrefSection>

          {/* Main goal */}
          <PrefSection title="What are you mainly trying to improve?">
            <PillGroup
              value={prefs.mainGoal}
              onChange={(v) => set('mainGoal', v)}
              options={[
                { value: 'fitness',      label: 'Fitness',      emoji: '🏋️' },
                { value: 'studies',      label: 'Studies',      emoji: '📚' },
                { value: 'health',       label: 'Health',       emoji: '🥗' },
                { value: 'sleep',        label: 'Sleep',        emoji: '😴' },
                { value: 'productivity', label: 'Productivity', emoji: '⚡' },
                { value: 'custom',       label: 'Custom',       emoji: '✏️' },
              ]}
            />
            {prefs.mainGoal === 'custom' && (
              <input
                className="pref-input"
                placeholder="Describe your goal..."
                value={prefs.customGoal}
                onChange={(e) => set('customGoal', e.target.value)}
                maxLength={60}
                style={{ marginTop: '10px' }}
              />
            )}
          </PrefSection>

          {/* Pain trigger */}
          <PrefSection title="What hits you harder?">
            <PillGroup
              value={prefs.painTrigger}
              onChange={(v) => set('painTrigger', v)}
              options={[
                { value: 'streak',      label: 'Losing streaks',         emoji: '💔' },
                { value: 'goals',       label: 'Missing goals',          emoji: '🎯' },
                { value: 'time',        label: 'Wasting time',           emoji: '⏰' },
                { value: 'consistency', label: 'Bad consistency reports', emoji: '📉' },
              ]}
            />
          </PrefSection>

          {/* Reminders */}
          <PrefSection title="Reminders">
            <Toggle
              checked={prefs.reminderEnabled}
              onChange={(v) => set('reminderEnabled', v)}
              label="Enable reminders"
            />
            {prefs.reminderEnabled && (
              <div style={{ marginTop: '12px' }}>
                <p className="pref-sub-label">When should reminders come?</p>
                <PillGroup
                  value={prefs.reminderTiming}
                  onChange={(v) => set('reminderTiming', v)}
                  options={[
                    { value: 'morning', label: 'Morning', emoji: '🌅' },
                    { value: 'evening', label: 'Evening', emoji: '🌙' },
                    { value: 'both',    label: 'Both',    emoji: '🔔' },
                    { value: 'smart',   label: 'Smart',   emoji: '🧠' },
                  ]}
                />
              </div>
            )}
          </PrefSection>

          {/* Weekly review */}
          <PrefSection title="Weekly review">
            <Toggle
              checked={prefs.weeklyReview}
              onChange={(v) => set('weeklyReview', v)}
              label="Send me a weekly performance summary"
            />
          </PrefSection>

        </div>

        {/* Footer */}
        <div className="profile-modal-footer">
          {saved && <p className="pref-saved-msg">✓ SlayIt updated how it behaves toward you.</p>}
          <button className="primary-btn profile-save-btn" onClick={handleSave}>
            Save Preferences
          </button>
        </div>

      </div>
    </div>
  );
}
