export default function Logo() {
  return (
    <div className="brand-logo-bubble" aria-label="Slayit logo">
      <svg width="30" height="30" viewBox="0 0 100 100" fill="none">
        <defs>
          <linearGradient id="crownGrad" x1="50" y1="20" x2="50" y2="78" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#fef3c7" />
            <stop offset="100%" stopColor="#fde68a" />
          </linearGradient>
          <filter id="crownShadow" x="-20%" y="-20%" width="140%" height="160%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="rgba(80,20,120,0.4)" />
          </filter>
        </defs>

        {/* Crown body */}
        <path
          d="M20 78 L20 62 L22 42 L32 56 L50 22 L68 56 L78 42 L80 62 L80 78 Z"
          fill="url(#crownGrad)"
          filter="url(#crownShadow)"
          strokeLinejoin="round"
        />

        {/* Crown base line */}
        <rect x="20" y="72" width="60" height="8" rx="4"
          fill="url(#crownGrad)"
          filter="url(#crownShadow)"
        />

        {/* Gem dots */}
        <circle cx="50" cy="22" r="5" fill="#ffffff" opacity="0.95" />
        <circle cx="22" cy="43" r="4" fill="#fde68a" opacity="0.9" />
        <circle cx="78" cy="43" r="4" fill="#fde68a" opacity="0.9" />

        {/* Shine highlight */}
        <ellipse cx="38" cy="38" rx="10" ry="6" fill="white" opacity="0.12" transform="rotate(-30 38 38)" />
      </svg>
    </div>
  );
}
