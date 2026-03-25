export function getScoreEmoji(score) {
  const value = Number(score || 0);

  if (value >= 90) return "🏆";
  if (value >= 75) return "🔥";
  if (value >= 50) return "🙂";
  if (value >= 25) return "😐";
  if (value > 0) return "😬";
  return "💀";
}

export function getScoreMessage(score) {
  const value = Number(score || 0);

  if (value >= 90) return "Elite consistency. Calm down.";
  if (value >= 75) return "Strong work. Suspiciously disciplined.";
  if (value >= 50) return "Decent. Could be better, could be worse.";
  if (value >= 25) return "Mediocre. You're not failing beautifully either.";
  if (value > 0) return "Weak effort. The numbers are embarrassed.";
  return "Absolutely nothing. Impressive in the worst way.";
}