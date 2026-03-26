// Generates a shareable streak card as a PNG using Canvas

export function generateShareCard({ habitName, streak, completed, total, category }) {
  const W = 600, H = 340;
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const c = canvas.getContext('2d');

  // Background gradient
  const bg = c.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#fbf0f8');
  bg.addColorStop(1, '#ede4fb');
  c.fillStyle = bg;
  c.roundRect(0, 0, W, H, 28);
  c.fill();

  // Accent bar top
  const bar = c.createLinearGradient(0, 0, W, 0);
  bar.addColorStop(0, '#f08ac0');
  bar.addColorStop(1, '#d784f7');
  c.fillStyle = bar;
  c.roundRect(0, 0, W, 8, [28, 28, 0, 0]);
  c.fill();

  // Category pill
  c.fillStyle = 'rgba(240,138,192,0.18)';
  c.roundRect(32, 32, 110, 30, 999);
  c.fill();
  c.fillStyle = '#c060a0';
  c.font = 'bold 13px Inter, sans-serif';
  c.textAlign = 'center';
  c.fillText(category?.toUpperCase() || 'HABIT', 87, 52);

  // Habit name
  c.fillStyle = '#2f2433';
  c.font = 'bold 36px Inter, sans-serif';
  c.textAlign = 'left';
  const name = habitName.length > 22 ? habitName.slice(0, 22) + '…' : habitName;
  c.fillText(name, 32, 110);

  // Streak number — big
  const streakGrad = c.createLinearGradient(32, 130, 200, 220);
  streakGrad.addColorStop(0, '#f08ac0');
  streakGrad.addColorStop(1, '#d784f7');
  c.fillStyle = streakGrad;
  c.font = 'bold 96px Inter, sans-serif';
  c.fillText(streak, 32, 230);

  // "day streak" label
  c.fillStyle = '#9d7a9b';
  c.font = 'bold 22px Inter, sans-serif';
  c.fillText('day streak 🔥', 32, 265);

  // Progress bar
  const barX = 32, barY = 290, barW = W - 64, barH = 14;
  c.fillStyle = 'rgba(200,180,220,0.35)';
  c.roundRect(barX, barY, barW, barH, 999);
  c.fill();
  const pct = total > 0 ? completed / total : 0;
  const fillGrad = c.createLinearGradient(barX, 0, barX + barW, 0);
  fillGrad.addColorStop(0, '#f08ac0');
  fillGrad.addColorStop(1, '#d784f7');
  c.fillStyle = fillGrad;
  c.roundRect(barX, barY, barW * pct, barH, 999);
  c.fill();

  // Progress text
  c.fillStyle = '#9d7a9b';
  c.font = 'bold 13px Inter, sans-serif';
  c.textAlign = 'right';
  c.fillText(`${completed}/${total} days`, W - 32, barY - 6);

  // Branding
  c.fillStyle = 'rgba(157,122,155,0.5)';
  c.font = 'bold 14px Inter, sans-serif';
  c.textAlign = 'right';
  c.fillText('slayit.vercel.app', W - 32, H - 16);

  // Big emoji top right
  c.font = '64px serif';
  c.textAlign = 'right';
  c.fillText(streak >= 10 ? '👑' : streak >= 7 ? '🔥' : streak >= 3 ? '💪' : '😤', W - 32, 200);

  return canvas.toDataURL('image/png');
}

export function downloadShareCard(dataUrl, habitName) {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = `slayit-${habitName.replace(/\s+/g, '-').toLowerCase()}-streak.png`;
  a.click();
}
