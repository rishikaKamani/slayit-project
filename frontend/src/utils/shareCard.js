// Streak-tier config: emoji, label, colors
const TIERS = [
  {
    min: 30,
    emoji: '🏆',
    label: '30-DAY LEGEND',
    msg: "Thirty days. You're built different.",
    bg1: '#1a0a00', bg2: '#3d1a00', accent1: '#fbbf24', accent2: '#f97316',
    sub: '#fde68a',
  },
  {
    min: 21,
    emoji: '👑',
    label: '3-WEEK KING',
    msg: "Three weeks straight. Annoyingly impressive.",
    bg1: '#0d0a1a', bg2: '#1e1040', accent1: '#a78bfa', accent2: '#7c3aed',
    sub: '#ddd6fe',
  },
  {
    min: 14,
    emoji: '🔥',
    label: '2-WEEK BEAST',
    msg: "Two weeks. The streak is real now.",
    bg1: '#1a0a00', bg2: '#3d1500', accent1: '#fb923c', accent2: '#ef4444',
    sub: '#fed7aa',
  },
  {
    min: 10,
    emoji: '⚡',
    label: '10-DAY STREAK',
    msg: "Double digits. Calm down.",
    bg1: '#0a1628', bg2: '#0f2d4a', accent1: '#38bdf8', accent2: '#818cf8',
    sub: '#bae6fd',
  },
  {
    min: 7,
    emoji: '💪',
    label: '7-DAY STREAK',
    msg: "A full week. Who even are you?",
    bg1: '#0d2818', bg2: '#0f3d22', accent1: '#34d399', accent2: '#10b981',
    sub: '#a7f3d0',
  },
  {
    min: 3,
    emoji: '🙂',
    label: '3-DAY STREAK',
    msg: "Three days in. Don't get cocky.",
    bg1: '#1a0533', bg2: '#3d0f6b', accent1: '#f08ac0', accent2: '#d784f7',
    sub: '#e0b8f5',
  },
  {
    min: 1,
    emoji: '🌱',
    label: 'GETTING STARTED',
    msg: "Day one. Let's not celebrate yet.",
    bg1: '#0d2818', bg2: '#1a3d22', accent1: '#86efac', accent2: '#4ade80',
    sub: '#bbf7d0',
  },
  {
    min: 0,
    emoji: '💀',
    label: 'NO STREAK',
    msg: "Zero streak. A bold choice.",
    bg1: '#1a1a1a', bg2: '#2d2d2d', accent1: '#9ca3af', accent2: '#6b7280',
    sub: '#d1d5db',
  },
];

function getTier(streak) {
  return TIERS.find((t) => streak >= t.min) || TIERS[TIERS.length - 1];
}

function rr(c, x, y, w, h, r) {
  c.beginPath();
  c.moveTo(x + r, y);
  c.lineTo(x + w - r, y);
  c.quadraticCurveTo(x + w, y, x + w, y + r);
  c.lineTo(x + w, y + h - r);
  c.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  c.lineTo(x + r, y + h);
  c.quadraticCurveTo(x, y + h, x, y + h - r);
  c.lineTo(x, y + r);
  c.quadraticCurveTo(x, y, x + r, y);
  c.closePath();
}

export function generateShareCard({ habitName, streak, completed, total, category }) {
  const W = 640, H = 380;
  const canvas = document.createElement('canvas');
  canvas.width = W * 2; canvas.height = H * 2;
  const c = canvas.getContext('2d');
  c.scale(2, 2);

  const tier = getTier(streak);

  // Background gradient
  const bgGrad = c.createLinearGradient(0, 0, W, H);
  bgGrad.addColorStop(0, tier.bg1);
  bgGrad.addColorStop(1, tier.bg2);
  c.fillStyle = bgGrad;
  rr(c, 0, 0, W, H, 28);
  c.fill();

  // Glow blobs
  const g1 = c.createRadialGradient(W * 0.15, H * 0.25, 0, W * 0.15, H * 0.25, 200);
  g1.addColorStop(0, tier.accent1 + '40');
  g1.addColorStop(1, 'transparent');
  c.fillStyle = g1; c.fillRect(0, 0, W, H);

  const g2 = c.createRadialGradient(W * 0.85, H * 0.75, 0, W * 0.85, H * 0.75, 180);
  g2.addColorStop(0, tier.accent2 + '40');
  g2.addColorStop(1, 'transparent');
  c.fillStyle = g2; c.fillRect(0, 0, W, H);

  // Top accent bar
  const lineGrad = c.createLinearGradient(0, 0, W, 0);
  lineGrad.addColorStop(0, tier.accent1);
  lineGrad.addColorStop(1, tier.accent2);
  c.fillStyle = lineGrad;
  rr(c, 0, 0, W, 6, 0); c.fill();

  // ── BIG EMOJI (right side, centered vertically) ──
  c.font = '130px serif';
  c.textAlign = 'center';
  c.fillText(tier.emoji, W - 110, H / 2 + 50);

  // Subtle ring behind emoji
  c.beginPath();
  c.arc(W - 110, H / 2 + 10, 90, 0, Math.PI * 2);
  c.fillStyle = 'rgba(255,255,255,0.05)';
  c.fill();

  // ── LEFT CONTENT ──

  // Category pill
  c.fillStyle = 'rgba(255,255,255,0.12)';
  rr(c, 28, 22, 110, 28, 14); c.fill();
  c.fillStyle = tier.sub;
  c.font = 'bold 11px Arial, sans-serif';
  c.textAlign = 'center';
  c.fillText((category || 'HABIT').toUpperCase(), 83, 40);

  // Slayit wordmark
  c.fillStyle = 'rgba(255,255,255,0.22)';
  c.font = 'bold 14px Arial, sans-serif';
  c.textAlign = 'right';
  c.fillText('slayit', W - 24, 40);

  // Habit name
  c.fillStyle = '#ffffff';
  c.font = 'bold 28px Arial, sans-serif';
  c.textAlign = 'left';
  const name = habitName.length > 24 ? habitName.slice(0, 24) + '…' : habitName;
  c.fillText(name, 28, 88);

  // Divider
  const divGrad = c.createLinearGradient(28, 0, 320, 0);
  divGrad.addColorStop(0, tier.accent1 + 'cc');
  divGrad.addColorStop(1, 'transparent');
  c.fillStyle = divGrad;
  c.fillRect(28, 98, 300, 2);

  // Big streak number
  const numGrad = c.createLinearGradient(28, 110, 28, 240);
  numGrad.addColorStop(0, tier.accent1);
  numGrad.addColorStop(1, tier.accent2);
  c.fillStyle = numGrad;
  c.font = 'bold 120px Arial, sans-serif';
  c.textAlign = 'left';
  c.fillText(String(streak), 18, 240);

  // "DAY STREAK" label
  c.fillStyle = tier.sub;
  c.font = 'bold 15px Arial, sans-serif';
  c.fillText('DAY STREAK', 28, 264);

  // Tier label badge
  c.fillStyle = 'rgba(255,255,255,0.1)';
  rr(c, 28, 274, 180, 26, 13); c.fill();
  c.fillStyle = tier.accent1;
  c.font = 'bold 11px Arial, sans-serif';
  c.textAlign = 'center';
  c.fillText(tier.label, 118, 291);

  // Tier message
  c.fillStyle = 'rgba(255,255,255,0.55)';
  c.font = '12px Arial, sans-serif';
  c.textAlign = 'left';
  c.fillText(tier.msg, 28, 318);

  // Progress bar
  const barX = 28, barY = 336, barW = W * 0.58, barH = 10;
  c.fillStyle = 'rgba(255,255,255,0.12)';
  rr(c, barX, barY, barW, barH, 5); c.fill();

  const pct = total > 0 ? Math.min(completed / total, 1) : 0;
  if (pct > 0) {
    const fillGrad = c.createLinearGradient(barX, 0, barX + barW, 0);
    fillGrad.addColorStop(0, tier.accent1);
    fillGrad.addColorStop(1, tier.accent2);
    c.fillStyle = fillGrad;
    rr(c, barX, barY, barW * pct, barH, 5); c.fill();
  }

  // Progress text
  c.fillStyle = tier.sub;
  c.font = 'bold 11px Arial, sans-serif';
  c.textAlign = 'left';
  c.fillText(`${completed}/${total} days  •  ${Math.round(pct * 100)}%`, barX, barY - 7);

  // Bottom branding
  c.fillStyle = 'rgba(255,255,255,0.25)';
  c.font = '10px Arial, sans-serif';
  c.fillText('slayit.vercel.app', barX, H - 10);

  return canvas.toDataURL('image/png');
}

export function downloadShareCard(dataUrl, habitName) {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = `slayit-${habitName.replace(/\s+/g, '-').toLowerCase()}-streak.png`;
  a.click();
}

export function getShareableLink({ habitName, streak, completed, total, category }) {
  const base = window.location.origin;
  const params = new URLSearchParams({
    habit: habitName,
    streak: String(streak),
    completed: String(completed),
    total: String(total),
    category: category || '',
  });
  return `${base}/badge?${params.toString()}`;
}

export async function shareCard(dataUrl, habitName, streak) {
  if (navigator.canShare) {
    try {
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], `slayit-${habitName}-streak.png`, { type: 'image/png' });
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `${habitName} — ${streak} day streak 🔥`,
          text: `I'm on a ${streak}-day streak for "${habitName}" on Slayit. Can you keep up? 👀`,
          url: 'https://slayit-project.vercel.app',
          files: [file],
        });
        return 'shared';
      }
    } catch (_) {}
  }
  try {
    const text = `🔥 ${streak}-day streak on "${habitName}"\nTracking habits on Slayit 💅\nhttps://slayit-project.vercel.app`;
    await navigator.clipboard.writeText(text);
    return 'copied';
  } catch (_) {}
  return 'fallback';
}
