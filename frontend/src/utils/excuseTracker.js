// ── Excuse Tracker ──
// Stores excuse data separately — does NOT affect habit state

const EXCUSE_KEY = 'slayit_excuses';

export const EXCUSE_OPTIONS = [
  { value: 'busy', label: 'Too busy' },
  { value: 'lazy', label: 'Just lazy' },
  { value: 'forgot', label: 'Forgot' },
  { value: 'unmotivated', label: 'Not motivated' },
];

export function saveExcuse(habitId, habitName, reason) {
  const existing = getExcuses();
  const entry = {
    habitId,
    habitName,
    reason,
    date: new Date().toLocaleDateString(),
    timestamp: Date.now(),
  };
  existing.unshift(entry);
  // Keep last 100 entries
  localStorage.setItem(EXCUSE_KEY, JSON.stringify(existing.slice(0, 100)));
}

export function getExcuses() {
  try {
    return JSON.parse(localStorage.getItem(EXCUSE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function getExcusesForHabit(habitId) {
  return getExcuses().filter((e) => String(e.habitId) === String(habitId));
}

export function getExcuseSummary() {
  const all = getExcuses();
  const counts = {};
  EXCUSE_OPTIONS.forEach((o) => { counts[o.value] = 0; });
  all.forEach((e) => {
    if (counts[e.reason] !== undefined) counts[e.reason]++;
  });
  return counts;
}
