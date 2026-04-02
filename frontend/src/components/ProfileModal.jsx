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

// Plain section — no accordion, always visible
function Section({ heading, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <p style={{
        margin: 0, fontSize: '0.72rem', fontWeight: 800,
        letterSpacing: '0.12em', textTransform: 'uppercase',
        color: 'var(--text-soft)',
      }}>{heading}</p>
      {children}
    </div>
  );
}

function Divider() {
  return <div style={{ height: '1px', background: 'var(--panel-border)', margin: '4px 0' }} />;
}

function FieldLabel({ children }) {
  return (
    <p style={{ margin: '0 0 6px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>
      {children}
    </p>
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

  const handleThemeChange = (val) => { setTheme(val); applyTheme(val); };

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

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.45)',
        backdropFilter: 'blur(5px)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end',
        padding: '16px', overflow: 'hidden',
      }}
    >
      {/* Modal panel */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: '460px',
          height: 'calc(100vh - 32px)',
          borderRadius: '28px',
          background: 'var(--surface-strong)',
          border: '1px solid var(--glass-border)',
          boxShadow: '0 32px 80px var(--shadow)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header — sticky */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '16px 18px 14px',
          borderBottom: '1px solid var(--panel-border)',
          flexShrink: 0, background: 'var(--surface-strong)',
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%',
            display: 'grid', placeItems: 'center',
            fontWeight: 800, fontSize: '1.1rem', color: '#fff',
            background: avatarGrad, flexShrink: 0,
          }}>
            {avatar.type === 'emoji' ? avatarEmoji : initial}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontWeight: 800, fontSize: '0.97rem', color: 'var(--text)' }}>
              {prefs.nickname || firstName}
            </p>
            <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: 'var(--text-soft)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {email}
            </p>
          </div>
          <button onClick={onClose} style={{
            width: 32, height: 32, border: 'none', borderRadius: '8px',
            background: 'var(--surface-soft)', color: 'var(--text-muted)',
            fontSize: '1rem', cursor: 'pointer', display: 'grid', placeItems: 'center', flexShrink: 0,
          }}>X</button>
        </div>

        {/* ONE scrollable area — all content visible, no accordions */}
        <div style={{
          flex: '1 1 auto', minHeight: 0,
          overflowY: 'scroll',
          WebkitOverflowScrolling: 'touch',
          padding: '18px 18px 24px',
          display: 'flex', flexDirection: 'column', gap: '20px',
        }}>

          {/* APPEARANCE */}
          <Section heading="Appearance">
            <FieldLabel>Theme</FieldLabel>
            <ThemePicker current={theme} onChange={handleThemeChange} />
            <FieldLabel>Avatar</FieldLabel>
            <AvatarPicker value={avatar} onChange={setAvatar} initial={initial} />
          </Section>

          <Divider />

          {/* IDENTITY */}
          <Section heading="Identity">
            <FieldLabel>Display name</FieldLabel>
            <input className="pref-input"
              placeholder={`e.g. ${firstName}, champ, boss...`}
              value={prefs.nickname}
              onChange={(e) => set('nickname', e.target.value)}
              maxLength={24} />
            <FieldLabel>How should SlayIt greet you?</FieldLabel>
            <PillGroup value={prefs.greetingStyle} onChange={(v) => set('greetingStyle', v)}
              options={[
                { value: 'casual',       label: 'Casual' },
                { value: 'motivational', label: 'Hype me up' },
                { value: 'sarcastic',    label: 'Sarcastic' },
              ]} />
          </Section>

          <Divider />

          {/* FEEDBACK */}
          <Section heading="Feedback and Motivation">
            <FieldLabel>Tone</FieldLabel>
            <PillGroup value={prefs.toneMode} onChange={(v) => set('toneMode', v)}
              options={[
                { value: 'soft',       label: 'Soft' },
                { value: 'discipline', label: 'Discipline' },
                { value: 'savage',     label: 'Savage' },
              ]} />
            <p className="pref-hint" style={{ margin: 0 }}>
              {prefs.toneMode === 'soft' && 'Gentle, supportive messages.'}
              {prefs.toneMode === 'discipline' && 'Direct, honest, no fluff.'}
              {prefs.toneMode === 'savage' && 'Zero mercy. Maximum sarcasm.'}
            </p>
            <FieldLabel>Motivation style</FieldLabel>
            <PillGroup value={prefs.motivationStyle} onChange={(v) => set('motivationStyle', v)}
              options={[
                { value: 'gentle',      label: 'Encourage me gently' },
                { value: 'accountable', label: 'Keep me accountable' },
                { value: 'brutal',      label: 'Be brutally honest' },
              ]} />
          </Section>

          <Divider />

          {/* GOALS */}
          <Section heading="Goals and Accountability">
            <FieldLabel>What are you mainly trying to improve?</FieldLabel>
            <MultiPillGroup value={prefs.mainGoal} onChange={(v) => set('mainGoal', v)}
              options={[
                { value: 'fitness',      label: 'Fitness' },
                { value: 'studies',      label: 'Studies' },
                { value: 'health',       label: 'Health' },
                { value: 'sleep',        label: 'Sleep' },
                { value: 'productivity', label: 'Productivity' },
                { value: 'custom',       label: 'Custom' },
              ]} />
            {hasCustomGoal && (
              <input className="pref-input" placeholder="Describe your goal..."
                value={prefs.customGoal}
                onChange={(e) => set('customGoal', e.target.value)}
                maxLength={60} />
            )}
            <FieldLabel>What hits you harder?</FieldLabel>
            <MultiPillGroup value={prefs.painTrigger} onChange={(v) => set('painTrigger', v)}
              options={[
                { value: 'streak',      label: 'Losing streaks' },
                { value: 'goals',       label: 'Missing goals' },
                { value: 'time',        label: 'Wasting time' },
                { value: 'consistency', label: 'Bad consistency' },
              ]} />
          </Section>

          <Divider />

          {/* REMINDERS */}
          <Section heading="Reminders">
            <Toggle checked={prefs.reminderEnabled}
              onChange={(v) => set('reminderEnabled', v)}
              label="Enable reminders" />
            {prefs.reminderEnabled && (
              <>
                <FieldLabel>When?</FieldLabel>
                <MultiPillGroup value={prefs.reminderTiming} onChange={(v) => set('reminderTiming', v)}
                  options={[
                    { value: 'morning', label: 'Morning' },
                    { value: 'evening', label: 'Evening' },
                    { value: 'both',    label: 'Both' },
                    { value: 'smart',   label: 'Smart' },
                  ]} />
              </>
            )}
            <Toggle checked={prefs.weeklyReview}
              onChange={(v) => set('weeklyReview', v)}
              label="Weekly performance summary" />
          </Section>

          <Divider />

          {/* SAVE */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {saved && (
              <p style={{
                margin: 0, textAlign: 'center', fontSize: '0.88rem', fontWeight: 700,
                color: 'var(--bubble-done-text)', background: 'var(--bubble-done-bg)',
                padding: '10px 14px', borderRadius: '12px',
              }}>
                Preferences saved.
              </p>
            )}
            <button onClick={handleSave} style={{
              width: '100%', padding: '15px', border: 'none', borderRadius: '18px',
              fontWeight: 800, fontSize: '1rem', color: '#fff',
              background: 'var(--accent-grad)',
              boxShadow: '0 14px 28px var(--accent-shadow)', cursor: 'pointer',
            }}>
              Save Preferences
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
