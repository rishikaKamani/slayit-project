// ── User Personalization Preferences ──
// Persisted in localStorage. Keyed per user email so prefs survive logout/login.

const KEY = (email) => `slayit_prefs_${email || 'guest'}`;

export const DEFAULT_PREFS = {
  toneMode: 'discipline',       // 'soft' | 'discipline' | 'savage'
  motivationStyle: 'accountable', // 'gentle' | 'accountable' | 'brutal'
  reminderEnabled: true,
  reminderTiming: 'both',       // 'morning' | 'evening' | 'both' | 'smart'
  mainGoal: 'fitness',          // 'fitness' | 'studies' | 'health' | 'sleep' | 'productivity' | 'custom'
  customGoal: '',
  painTrigger: 'streak',        // 'streak' | 'goals' | 'time' | 'consistency'
  weeklyReview: true,
  nickname: '',
  greetingStyle: 'casual',      // 'casual' | 'motivational' | 'sarcastic'
};

export function loadPrefs(email) {
  try {
    const raw = localStorage.getItem(KEY(email));
    if (!raw) return { ...DEFAULT_PREFS };
    return { ...DEFAULT_PREFS, ...JSON.parse(raw) };
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
