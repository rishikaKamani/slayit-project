// Generates a shareable streak card as a PNG using Canvas

const BG_THEMES = [
  { from: '#f9e4f5', to: '#e8d4fb', bar0: '#f08ac0', bar1: '#d784f7', pill: 'rgba(240,138,192,0.18)', pillText: '#c060a0' },
  { from: '#d4f0fb', to: '#d4e8fb', bar0: '#38bdf8', bar1: '#818cf8', pill: 'rgba(56,189,248,0.18)', pillText: '#0369a1' },
  { from: '#d4fbe8', to: '#d4fbf0', bar0: '#34d399', bar1: '#10b981', pill: 'rgba(52,211,153,0.18)', pillText: '#065f46' },
  { from: '#fef3c7', to: '#fde68a', bar0: '#fbbf24', bar1: '#f59e0b', pill: 'rgba(251,191,36,0.18)', pillText: '#92400e' },
  { from: '#ffe4e6', to: '#fecdd3', bar0: '#fb7185', bar1: '#f43f5e', pill: 'rgba(251,113,133,0.18)', pillText: '#9f1239' },
];

const VIBE_EMOJIS = [
  ['🔥','💀','👑','💅','🫡'],
  ['⚡','🧠','💪','🎯','🏆'],
  ['✨','🌟','💫','🎉','🥳'],
  ['😤','😈','🤌','💯','🫶'],
  ['🚀','🌈','🦋','🎪','🎭'],
];

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

export function generateShareCard({ habitName, streak, completed, total, category }) {
  const W = 600, H = 360;
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const c = canvas.getContext('2d');

  // Pick random theme and emoji set
  const theme = pick(BG_THEMES);
  const emojis = pick(VIBE_EMOJIS);

  // Background gradient
  const bg = c.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, theme.from);
  bg.addColorStop(1, theme.to);
  c.fillStyle = bg;
  c.roundRect(0, 0, W, H, 28);
  c.fill();

  // Accent bar top
  const bar = c.createLinearGradient(0, 0, W, 0);
  bar.addColorStop(0, theme.bar0);
  bar.addColorStop(1, theme.bar1);
  c.fillStyle = bar;
  c.roundRect(0, 0, W, 8, [28, 28, 0, 0]);
  c.fill();

  // Scattered background emojis (faint)
  c.globalAlpha = 0.07;
  c.font = '48px serif';
  [[60,80],[180,260],[420,60],[500,200],[300,310],[140,140],[480,310]].forEach(([x,y], i) => {
    c.fillText(emojis[i % emojis.length], x, y);
  });
  c.globalAlpha = 1;

  // Category pill
  c.fillStyle = theme.pill;
  c.roundRect(32, 28, 120, 30, 999);
  c.fill();
  c.fillStyle = theme.pillText;
  c.font = 'bold 12px Inter, sans-serif';
  c.textAlign = 'center';
  c.fillText((category || 'HABIT').toUpperCase(), 92, 48);

  // Habit name
  c.fillStyle = '#1e1428';
  c.font = 'bold 34px Inter, sans-serif';
  c.textAlign = 'left';
  const name = habitName.length > 24 ? habitName.slice(0, 24) + '…' : habitName;
  c.fillText(name, 32, 108);

  // Big streak number
  const streakGrad = c.createLinearGradient(32, 130, 220, 240);
  streakGrad.addColorStop(0, theme.bar0);
  streakGrad.addColorStop(1, theme.bar1);
  c.fillStyle = streakGrad;
  c.font = 'bold 100px Inter, sans-serif';
  c.fillText(streak, 32, 240);

  // "day streak" label
  c.fillStyle = '#6b5878';
  c.font = 'bold 20px Inter, sans-serif';
  c.fillText('day streak', 32, 270);

  // Big main emoji top right
  c.font = '72px serif';
  c.textAlign = 'right';
  const mainEmoji = streak >= 10 ? '👑' : streak >= 7 ? '🔥' : streak >= 3 ? '💪' : streak >= 1 ? '😤' : '💀';
  c.fillText(mainEmoji, W - 28, 200);

  // Random side emojis
  c.font = '32px serif';
  c.fillText(emojis[1], W - 80, 240);
  c.fillText(emojis[2], W - 130, 270);

  // Progress bar
  const barX = 32, barY = 300, barW = W - 64, barH = 16;
  c.fillStyle = 'rgba(180,160,200,0.25)';
  c.roundRect(barX, barY, barW, barH, 999);
  c.fill();
  const pct = total > 0 ? Math.min(completed / total, 1) : 0;
  const fillGrad = c.createLinearGradient(barX, 0, barX + barW, 0);
  fillGrad.addColorStop(0, theme.bar0);
  fillGrad.addColorStop(1, theme.bar1);
  c.fillStyle = fillGrad;
  if (pct > 0) {
    c.roundRect(barX, barY, barW * pct, barH, 999);
    c.fill();
  }

  // Progress label
  c.fillStyle = '#6b5878';
  c.font = 'bold 13px Inter, sans-serif';
  c.textAlign = 'right';
  c.fillText(`${completed}/${total} days done`, W - 32, barY - 6);

  // Branding bottom left
  c.fillStyle = 'rgba(100,80,120,0.45)';
  c.font = 'bold 13px Inter, sans-serif';
  c.textAlign = 'left';
  c.fillText('slayit.vercel.app', 32, H - 14);

  return canvas.toDataURL('image/png');
}

export function downloadShareCard(dataUrl, habitName) {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = `slayit-${habitName.replace(/\s+/g, '-').toLowerCase()}-streak.png`;
  a.click();
}

export async function shareCard(dataUrl, habitName, streak) {
  // Try Web Share API with file first (mobile)
  if (navigator.canShare) {
    try {
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], `slayit-${habitName}-streak.png`, { type: 'image/png' });
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `${habitName} — ${streak} day streak 🔥`,
          text: `I'm on a ${streak}-day streak for "${habitName}" on Slayit. Can you keep up?`,
          files: [file],
        });
        return 'shared';
      }
    } catch (_) {}
  }
  // Fallback: copy link to clipboard
  try {
    const text = `I'm on a ${streak}-day streak for "${habitName}" on Slayit 🔥\nTrack your habits: https://slayit-project.vercel.app`;
    await navigator.clipboard.writeText(text);
    return 'copied';
  } catch (_) {}
  return 'fallback';
}
