import { THEMES, applyTheme } from '../utils/themeConfig';

/**
 * Visual theme picker — replaces the dropdown.
 * Shows color preview cards, highlights selected theme.
 */
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
          {/* Color swatch */}
          <div
            className="theme-swatch"
            style={{
              background: `linear-gradient(135deg, ${t.preview[0]} 0%, ${t.preview[1]} 100%)`,
            }}
          >
            {current === t.value && (
              <span className="theme-check">✓</span>
            )}
          </div>
          <span className="theme-card-label">{t.label}</span>
        </button>
      ))}
    </div>
  );
}
