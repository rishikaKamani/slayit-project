import { THEMES, applyTheme } from '../utils/themeConfig';

// Mini app preview rendered as SVG for each theme
function ThemePreviewSVG({ theme }) {
  const { preview, value } = theme;
  const [c1, c2] = preview;

  // Theme-specific accent/card colors
  const configs = {
    blush:    { card: 'rgba(255,255,255,0.85)', accent: '#f08ac0', text: '#2f2433', bar: '#d784f7', nav: 'rgba(255,255,255,0.9)' },
    midnight: { card: 'rgba(37,29,46,0.95)',   accent: '#8c6bff', text: '#f4edf7', bar: '#e27bd1', nav: 'rgba(31,25,39,0.9)' },
    matcha:   { card: 'rgba(252,255,248,0.9)', accent: '#7fae6d', text: '#263126', bar: '#cfa85c', nav: 'rgba(249,253,242,0.9)' },
    sunset:   { card: 'rgba(255,247,237,0.9)', accent: '#fb923c', text: '#2d1a0e', bar: '#f43f5e', nav: 'rgba(255,248,240,0.9)' },
    ocean:    { card: 'rgba(240,248,255,0.9)', accent: '#38bdf8', text: '#0c1a2e', bar: '#6366f1', nav: 'rgba(245,251,255,0.9)' },
    lavender: { card: 'rgba(248,245,255,0.9)', accent: '#c084fc', text: '#1e1030', bar: '#a855f7', nav: 'rgba(252,250,255,0.9)' },
    darkpro:  { card: 'rgba(12,12,12,0.98)',   accent: '#00ff88', text: '#e2e8f0', bar: '#00d4ff', nav: 'rgba(10,10,10,0.95)' },
    peach:    { card: 'rgba(255,252,248,0.9)', accent: '#fdba74', text: '#2d1a0e', bar: '#fb7185', nav: 'rgba(255,254,250,0.9)' },
    royal:    { card: 'rgba(30,10,60,0.9)',    accent: '#a855f7', text: '#f5f0ff', bar: '#fbbf24', nav: 'rgba(38,14,72,0.95)' },
    minimal:  { card: 'rgba(255,255,255,0.98)', accent: '#64748b', text: '#0f172a', bar: '#94a3b8', nav: 'rgba(255,255,255,0.98)' },
  };

  const c = configs[value] || configs.blush;
  const W = 80, H = 64;

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`bg-${value}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={c1} />
          <stop offset="100%" stopColor={c2} />
        </linearGradient>
        <linearGradient id={`bar-${value}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={c.accent} />
          <stop offset="100%" stopColor={c.bar} />
        </linearGradient>
        <clipPath id={`clip-${value}`}>
          <rect width={W} height={H} rx="10" />
        </clipPath>
      </defs>

      {/* Background */}
      <rect width={W} height={H} rx="10" fill={`url(#bg-${value})`} />

      {/* Navbar bar */}
      <rect x="0" y="0" width={W} height="14" fill={c.nav} opacity="0.95" clipPath={`url(#clip-${value})`} />
      {/* Nav dot */}
      <circle cx="8" cy="7" r="3" fill={c.accent} />
      {/* Nav lines */}
      <rect x="16" y="5" width="14" height="2" rx="1" fill={c.text} opacity="0.4" />
      <rect x="34" y="5" width="10" height="2" rx="1" fill={c.text} opacity="0.25" />
      <rect x="48" y="5" width="10" height="2" rx="1" fill={c.text} opacity="0.25" />
      {/* Avatar dot */}
      <circle cx="73" cy="7" r="4" fill={c.accent} opacity="0.9" />

      {/* Card 1 */}
      <rect x="6" y="19" width="44" height="22" rx="5" fill={c.card} opacity="0.95" />
      <rect x="10" y="23" width="20" height="2" rx="1" fill={c.text} opacity="0.5" />
      <rect x="10" y="27" width="30" height="1.5" rx="1" fill={c.text} opacity="0.2" />
      {/* Progress bar */}
      <rect x="10" y="32" width="34" height="3" rx="1.5" fill={c.text} opacity="0.12" />
      <rect x="10" y="32" width="22" height="3" rx="1.5" fill={`url(#bar-${value})`} />

      {/* Card 2 (side) */}
      <rect x="54" y="19" width="20" height="22" rx="5" fill={c.card} opacity="0.85" />
      <rect x="57" y="23" width="14" height="2" rx="1" fill={c.accent} opacity="0.7" />
      <rect x="57" y="27" width="10" height="1.5" rx="1" fill={c.text} opacity="0.25" />
      <rect x="57" y="31" width="12" height="1.5" rx="1" fill={c.text} opacity="0.2" />

      {/* Bottom accent strip */}
      <rect x="0" y={H - 4} width={W} height="4" fill={`url(#bar-${value})`} opacity="0.6" clipPath={`url(#clip-${value})`} />
    </svg>
  );
}

export default function ThemePicker({ current, onChange }) {
  const handleSelect = (value) => {
    applyTheme(value);
    onChange(value);
  };

  return (
    <div className="theme-picker">
      {THEMES.map((t) => (
        <button
          key={t.value}
          type="button"
          className={`theme-card ${current === t.value ? 'theme-card-active' : ''}`}
          onClick={() => handleSelect(t.value)}
          title={t.desc}
          aria-label={`${t.label} theme`}
          aria-pressed={current === t.value}
        >
          <div className="theme-swatch">
            <ThemePreviewSVG theme={t} />
            {current === t.value && (
              <div className="theme-check-overlay">✓</div>
            )}
          </div>
          <span className="theme-card-label">{t.label}</span>
        </button>
      ))}
    </div>
  );
}
