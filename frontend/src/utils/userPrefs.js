// ── User Personalization Preferences ──
// Persisted in localStorage. Keyed per user email so prefs survive logout/login.

const KEY = (email) => `slayit_prefs_${email || 'guest'}`;

export const DEFAULT_PREFS = {
  toneMode: 'discipline',
  motivationStyle: 'accountable',
  reminderEnabled: true,
  reminderTiming: ['both'],
  mainGoal: ['fitness'],
  customGoal: '',
  painTrigger: ['streak'],
  weeklyReview: true,
  nickname: '',
  greetingStyle: 'casual',
  theme: 'blush',               // persisted here too (synced with body attr)
};

export function loadPrefs(email) {
  try {
    const raw = localStorage.getItem(KEY(email));
    if (!raw) return { ...DEFAULT_PREFS };
    const saved = JSON.parse(raw);
    const merged = { ...DEFAULT_PREFS, ...saved };
    // Migrate old single-value fields to arrays
    if (!Array.isArray(merged.mainGoal))      merged.mainGoal = [merged.mainGoal || 'fitness'];
    if (!Array.isArray(merged.painTrigger))   merged.painTrigger = [merged.painTrigger || 'streak'];
    if (!Array.isArray(merged.reminderTiming)) merged.reminderTiming = [merged.reminderTiming || 'both'];
    return merged;
  } catch {
    return { ...DEFAULT_PREFS };
  }
}

export function savePrefs(email, prefs) {
  localStorage.setItem(KEY(email), JSON.stringify(prefs));
  // Also sync toneMode into feedbackMessages key so existing system picks it up
  localStorage.setItem('slayit_mode', prefs.toneMode || 'discipline');
}

export function getGreeting(prefs, firstName) {
  const name = prefs.nickname || firstName || 'you';
  switch (prefs.greetingStyle) {
    case 'motivational': return `Let's go, ${name} 💪`;
    case 'sarcastic':    return `Oh look, ${name} showed up.`;
    default:             return `Hey, ${name}`;
  }
}
