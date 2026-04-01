import { useEffect, useState } from 'react';
import { loadPrefs, savePrefs } from '../utils/userPrefs';
import { loadAvatar, saveAvatar, getAvatarGradientStyle, getEmojiById } from '../utils/avatarConfig';
import { applyTheme, getSavedTheme } from '../utils/themeConfig';
import { useAuth } from '../context/AuthContext';
import ThemePicker from './ThemePicker';
import AvatarPicker from './AvatarPicker';

function PillGroup({ options, value, onChange }) {
  return (
    <div className="pill-group">
      {options.map((opt) => (
        <button key={opt.value} type="button"
          className={`pill-btn ${value === opt.value ? 'pill-active' : ''}`}
          onClick={() => onChange(opt.value)}>
          {opt.emoji && <span className="pill-emoji">{opt.emoji}</span>}
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function MultiPillGroup({ options, value = [], onChange }) {
  const arr = Array.isArray(value) ? value : [value];
  const toggle = (v) => onChange(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
  return (
    <div className="pill-group">
      {options.map((opt) => (
        <button key={opt.value} type="button"
          className={`pill-btn ${arr.includes(opt.value) ? 'pill-active' : ''}`}
          onClick={() => toggle(opt.value)}>
          {opt.emoji && <span className="pill-emoji">{opt.emoji}</span>}
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function Toggle({ checked, onChange, label }) {
  return (
    <label className="pref-toggle">
      <span className="pref-toggle-label">{label}</span>
      <div className={`toggle-track ${checked ? 'toggle-on' : ''}`}
        onClick={() => onChange(!checked)}
        role="switch" aria-checked={checked} tabIndex={0}
        onKeyDown={(e) => e.key === ' ' && onChange(!checked)}>
        <div className="toggle-thumb" />
      </div>
    </label>
  );
}

function Section({ title, children }) {
  return (
    <div className="pref-section">
      <p className="pref-section-title">{title}</p>
      {children}
    </div>
  );
}

function CollapseSection({ title, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="collapse-section">
      <button type="button" className="collapse-header" onClick={() => setOpen((o) => !o)}>
        <span>{title}</span>
        <span className={`collapse-arrow ${open ? 'collapse-open' : ''}`}>›</span>
      </button>
      {open && <div className="collapse-body">{children}</div>}
    </div>
  );
}

export default function ProfileModal({ onClose }) {
  const { user } = useAuth();
  const email = user?.email;
  const firstName = user?.name?.split(' ')[0] || 'User';
  const initial = firstName.charAt(0).toUpperCase();

  const [prefs, setPrefs] = useState(() => loadPrefs(email));
  const [avatar, setAvatar] = useState(() => loadAvatar(email));
  const [theme, setTheme] = useState(() => getSavedTheme());
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  const set = (key, val) => setPrefs((p) => ({ ...p, [key]: val }));

  const handleThemeChange = (val) => {
    setTheme(val);
    applyTheme(val);
  };

  const handleSave = () => {
    savePrefs(email, { ...prefs, theme });
    saveAvatar(email, avatar);
    applyTheme(theme);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    window.dispatchEvent(new Event('slayit-prefs-saved'));
  };

  const avatarGrad = getAvatarGradientStyle(avatar.gradient);
  const avatarEmoji = getEmojiById(avatar.emoji);
  const hasCustomGoal = (Array.isArray(prefs.mainGoal) ? prefs.mainGoal : [prefs.mainGoal]).includes('custom');

  // Overlay: fixed, covers screen, click outside to close
  // Modal: fixed height, flex column, right-aligned on desktop
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(0,0,0,0.45)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
        padding: '16px',
      }}
    >
      {/* Modal panel — fixed height, flex column */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '460px',
          height: 'calc(100vh - 32px)',
          borderRadius: '28px',
          background: 'var(--surface-strong)',
          border: '1px solid var(--glass-border)',
          boxShadow: '0 32px 80px var(--shadow)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* HEADER — fixed, never scrolls */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          padding: '20px 20px 16px',
          borderBottom: '1px solid var(--panel-border)',
          flexShrink: 0,
          background: 'var(--surface-strong)',
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            display: 'grid', placeItems: 'center',
            fontWeight: 800, fontSize: '1.2rem', color: '#fff',
            background: avatarGrad, flexShrink: 0,
          }}>
            {avatar.type === 'emoji' ? <span>{avatarEmoji}</span> : initial}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontWeight: 800, fontSize: '1rem', color: 'var(--text)' }}>
              {prefs.nickname || firstName}
            </p>
            <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: 'var(--text-soft)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {email}
            </p>
          </div>
          <button onClick={onClose} aria-label="Close" style={{
            width: 34, height: 34, border: 'none', borderRadius: '10px',
            background: 'var(--surface-soft)', color: 'var(--text-muted)',
            fontSize: '1rem', cursor: 'pointer', display: 'grid', placeItems: 'center', flexShrink: 0,
          }}>✕</button>
        </div>

        {/* SCROLLABLE CONTENT — takes all remaining height */}
        <div style={{
          flex: '1 1 0px',
          minHeight: 0,
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          padding: '16px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}>

          <CollapseSection title="🎨  Appearance" defaultOpen={true}>
            <Section title="Theme">
              <ThemePicker current={theme} onChange={handleThemeChange} />
            </Section>
            <Section title="Avatar">
              <AvatarPicker value={avatar} onChange={setAvatar} initial={initial} />
            </Section>
          </CollapseSection>

          <CollapseSection title="👤  Identity" defaultOpen={false}>
            <Section title="Display name">
              <input className="pref-input"
                placeholder={`e.g. ${firstName}, champ, boss...`}
                value={prefs.nickname}
                onChange={(e) => set('nickname', e.target.value)}
                maxLength={24} />
            </Section>
            <Section title="How should SlayIt greet you?">
              <PillGroup value={prefs.greetingStyle} onChange={(v) => set('greetingStyle', v)}
                options={[
                  { value: 'casual',       label: 'Casual',     emoji: '👋' },
                  { value: 'motivational', label: 'Hype me up', emoji: '🔥' },
                  { value: 'sarcastic',    label: 'Sarcastic',  emoji: '😏' },
                ]} />
            </Section>
          </CollapseSection>

          <CollapseSection title="💬  Feedback & Motivation" defaultOpen={false}>
            <Section title="Tone">
              <PillGroup value={prefs.toneMode} onChange={(v) => set('toneMode', v)}
                options={[
                  { value: 'soft',       label: 'Soft',       emoji: '🌸' },
                  { value: 'discipline', label: 'Discipline', emoji: '💼' },
                  { value: 'savage',     label: 'Savage',     emoji: '💀' },
                ]} />
              <p className="pref-hint">
                {prefs.toneMode === 'soft' && 'Gentle, supportive messages.'}
                {prefs.toneMode === 'discipline' && 'Direct, honest, no fluff.'}
                {prefs.toneMode === 'savage' && 'Zero mercy. Maximum sarcasm.'}
              </p>
            </Section>
            <Section title="Motivation style">
              <PillGroup value={prefs.motivationStyle} onChange={(v) => set('motivationStyle', v)}
                options={[
                  { value: 'gentle',      label: 'Encourage me gently', emoji: '🤗' },
                  { value: 'accountable', label: 'Keep me accountable',  emoji: '📋' },
                  { value: 'brutal',      label: 'Be brutally honest',   emoji: '🔨' },
                ]} />
            </Section>
          </CollapseSection>

          <CollapseSection title="🎯  Goals & Accountability" defaultOpen={false}>
            <Section title="What are you mainly trying to improve?">
              <MultiPillGroup value={prefs.mainGoal} onChange={(v) => set('mainGoal', v)}
                options={[
                  { value: 'fitness',      label: 'Fitness',      emoji: '🏋️' },
                  { value: 'studies',      label: 'Studies',      emoji: '📚' },
                  { value: 'health',       label: 'Health',       emoji: '🥗' },
                  { value: 'sleep',        label: 'Sleep',        emoji: '😴' },
                  { value: 'productivity', label: 'Productivity', emoji: '⚡' },
                  { value: 'custom',       label: 'Custom',       emoji: '✏️' },
                ]} />
              {hasCustomGoal && (
                <input className="pref-input" placeholder="Describe your goal..."
                  value={prefs.customGoal}
                  onChange={(e) => set('customGoal', e.target.value)}
                  maxLength={60} style={{ marginTop: '10px' }} />
              )}
            </Section>
            <Section title="What hits you harder?">
              <MultiPillGroup value={prefs.painTrigger} onChange={(v) => set('painTrigger', v)}
                options={[
                  { value: 'streak',      label: 'Losing streaks',         emoji: '💔' },
                  { value: 'goals',       label: 'Missing goals',          emoji: '🎯' },
                  { value: 'time',        label: 'Wasting time',           emoji: '⏰' },
                  { value: 'consistency', label: 'Bad consistency reports', emoji: '📉' },
                ]} />
            </Section>
          </CollapseSection>

          <CollapseSection title="🔔  Reminders" defaultOpen={false}>
            <Section title="Reminders">
              <Toggle checked={prefs.reminderEnabled}
                onChange={(v) => set('reminderEnabled', v)}
                label="Enable reminders" />
              {prefs.reminderEnabled && (
                <div style={{ marginTop: '12px' }}>
                  <p className="pref-sub-label">When?</p>
                  <MultiPillGroup value={prefs.reminderTiming} onChange={(v) => set('reminderTiming', v)}
                    options={[
                      { value: 'morning', label: 'Morning', emoji: '🌅' },
                      { value: 'evening', label: 'Evening', emoji: '🌙' },
                      { value: 'both',    label: 'Both',    emoji: '🔔' },
                      { value: 'smart',   label: 'Smart',   emoji: '🧠' },
                    ]} />
                </div>
              )}
            </Section>
            <Section title="Weekly review">
              <Toggle checked={prefs.weeklyReview}
                onChange={(v) => set('weeklyReview', v)}
                label="Send me a weekly performance summary" />
            </Section>
          </CollapseSection>

          {/* Save button at bottom of scroll area */}
          <div style={{ paddingTop: '4px', paddingBottom: '8px' }}>
            {saved && (
              <p className="pref-saved-msg" style={{ marginBottom: '12px' }}>
                ✓ Preferences saved.
              </p>
            )}
            <button
              onClick={handleSave}
              style={{
                width: '100%',
                padding: '15px',
                border: 'none',
                borderRadius: '18px',
                fontWeight: 800,
                fontSize: '1rem',
                color: '#fff',
                background: 'var(--accent-grad)',
                boxShadow: '0 14px 28px var(--accent-shadow)',
                cursor: 'pointer',
              }}
            >
              Save Preferences
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
