// ── Theme Configuration ──
// All themes. Existing 3 kept intact, 7 new ones added.

export const THEMES = [
  // ── Original themes ──
  {
    value: 'blush',
    label: 'Blush',
    preview: ['#f08ac0', '#d784f7'],
    desc: 'Soft pink & purple',
  },
  {
    value: 'midnight',
    label: 'Midnight',
    preview: ['#1a1622', '#5e78ff'],
    desc: 'Dark & electric',
  },
  {
    value: 'matcha',
    label: 'Matcha',
    preview: ['#7fae6d', '#cfa85c'],
    desc: 'Green & earthy',
  },
  // ── New themes ──
  {
    value: 'sunset',
    label: 'Sunset',
    preview: ['#fb923c', '#f43f5e'],
    desc: 'Warm orange & pink',
  },
  {
    value: 'ocean',
    label: 'Ocean',
    preview: ['#38bdf8', '#6366f1'],
    desc: 'Cool blue & indigo',
  },
  {
    value: 'lavender',
    label: 'Lavender',
    preview: ['#c4b5fd', '#a78bfa'],
    desc: 'Soft purple dream',
  },
  {
    value: 'darkpro',
    label: 'Dark Pro',
    preview: ['#0a0a0a', '#00ff88'],
    desc: 'True black & neon',
  },
  {
    value: 'peach',
    label: 'Peach',
    preview: ['#fde68a', '#fca5a5'],
    desc: 'Light & warm',
  },
  {
    value: 'royal',
    label: 'Royal',
    preview: ['#3b0764', '#fbbf24'],
    desc: 'Deep purple & gold',
  },
  {
    value: 'minimal',
    label: 'Minimal',
    preview: ['#f8fafc', '#94a3b8'],
    desc: 'Clean white & grey',
  },
];

export function applyTheme(value) {
  document.body.setAttribute('data-theme', value);
  localStorage.setItem('slayit_theme', value);
}

export function getSavedTheme() {
  return localStorage.getItem('slayit_theme') || 'blush';
}
