// ── Analytics Enhancement ──
// Computes advanced insights from habit data — read-only, no state mutation

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * Given a habit's days array and createdDate, compute advanced analytics.
 * Returns: { bestDay, worstDay, consistencyScore, weeklyInsight }
 */
export function computeHabitAnalytics(days, createdDate) {
  if (!days || days.length === 0) {
    return { bestDay: null, worstDay: null, consistencyScore: 0, weeklyInsight: 'No data yet.' };
  }

  // Map each day to its day-of-week
  const dayOfWeekStats = {}; // { 0: { done: 0, total: 0 }, ... }
  for (let i = 0; i < 7; i++) dayOfWeekStats[i] = { done: 0, total: 0 };

  let start = null;
  if (createdDate) {
    const parts = String(createdDate).split('T')[0].split('-');
    start = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  }

  days.forEach((day, index) => {
    const status = (day.status || 'pending').toLowerCase();
    if (status === 'pending') return;

    let dow = null;
    if (start) {
      const d = new Date(start);
      d.setDate(d.getDate() + index);
      dow = d.getDay();
    }

    if (dow !== null) {
      dayOfWeekStats[dow].total++;
      if (status === 'done') dayOfWeekStats[dow].done++;
    }
  });

  // Best and worst day (only among days with at least 1 log)
  let bestDay = null, worstDay = null;
  let bestRate = -1, worstRate = 2;

  for (let i = 0; i < 7; i++) {
    const { done, total } = dayOfWeekStats[i];
    if (total === 0) continue;
    const rate = done / total;
    if (rate > bestRate) { bestRate = rate; bestDay = DAY_NAMES[i]; }
    if (rate < worstRate) { worstRate = rate; worstDay = DAY_NAMES[i]; }
  }

  // Consistency score: % of logged days that are done (out of all non-pending)
  const logged = days.filter((d) => {
    const s = (d.status || '').toLowerCase();
    return s === 'done' || s === 'missed';
  });
  const done = logged.filter((d) => d.status.toLowerCase() === 'done').length;
  const consistencyScore = logged.length > 0 ? Math.round((done / logged.length) * 100) : 0;

  // Weekly insight text
  const weeklyInsight = generateWeeklyInsight(consistencyScore, bestDay, worstDay, done, logged.length);

  return { bestDay, worstDay, consistencyScore, weeklyInsight };
}

function generateWeeklyInsight(score, bestDay, worstDay, done, total) {
  if (total === 0) return 'Start logging to see insights.';
  if (score >= 90) return `${score}% consistency. Annoyingly disciplined.`;
  if (score >= 70) return `${score}% done. Solid. ${bestDay ? `You crush it on ${bestDay}s.` : ''}`;
  if (score >= 50) return `${score}% consistency. Room to grow. ${worstDay ? `Watch out for ${worstDay}s.` : ''}`;
  if (score >= 30) return `${score}% done. The struggle is visible. ${worstDay ? `${worstDay}s are rough for you.` : ''}`;
  return `${score}% consistency. The data is not flattering.`;
}

/**
 * Aggregate analytics across all habits.
 */
export function computeOverallAnalytics(habits) {
  if (!habits || habits.length === 0) {
    return { bestDay: null, worstDay: null, consistencyScore: 0, weeklyInsight: 'No habits tracked yet.' };
  }

  const dayOfWeekStats = {};
  for (let i = 0; i < 7; i++) dayOfWeekStats[i] = { done: 0, total: 0 };

  habits.forEach((habit) => {
    const days = habit.days || [];
    const createdDate = habit.createdDate;
    let start = null;
    if (createdDate) {
      const parts = String(createdDate).split('T')[0].split('-');
      start = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    }

    days.forEach((day, index) => {
      const status = (day.status || 'pending').toLowerCase();
      if (status === 'pending') return;
      if (!start) return;
      const d = new Date(start);
      d.setDate(d.getDate() + index);
      const dow = d.getDay();
      dayOfWeekStats[dow].total++;
      if (status === 'done') dayOfWeekStats[dow].done++;
    });
  });

  let bestDay = null, worstDay = null;
  let bestRate = -1, worstRate = 2;

  for (let i = 0; i < 7; i++) {
    const { done, total } = dayOfWeekStats[i];
    if (total === 0) continue;
    const rate = done / total;
    if (rate > bestRate) { bestRate = rate; bestDay = DAY_NAMES[i]; }
    if (rate < worstRate) { worstRate = rate; worstDay = DAY_NAMES[i]; }
  }

  const totalLogged = Object.values(dayOfWeekStats).reduce((a, b) => a + b.total, 0);
  const totalDone = Object.values(dayOfWeekStats).reduce((a, b) => a + b.done, 0);
  const consistencyScore = totalLogged > 0 ? Math.round((totalDone / totalLogged) * 100) : 0;
  const weeklyInsight = generateWeeklyInsight(consistencyScore, bestDay, worstDay, totalDone, totalLogged);

  return { bestDay, worstDay, consistencyScore, weeklyInsight };
}
