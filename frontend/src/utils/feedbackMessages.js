// ── Personality-Driven Feedback System ──
// Reads all user preferences to generate contextual messages.
// Tone × MotivationStyle × PainTrigger all influence output.

import { loadPrefs } from './userPrefs';

const MODE_KEY = 'slayit_mode';

export function getMode() {
  return localStorage.getItem(MODE_KEY) || 'discipline';
}

export function setMode(mode) {
  localStorage.setItem(MODE_KEY, mode);
}

// Load full prefs — email stored separately so we can read without passing it
function getPrefs() {
  // Try to find the active user's email from stored user object
  try {
    const raw = localStorage.getItem('slayit_user');
    const user = raw ? JSON.parse(raw) : null;
    return loadPrefs(user?.email);
  } catch {
    return { toneMode: getMode(), motivationStyle: 'accountable', painTrigger: ['streak'], mainGoal: ['fitness'] };
  }
}

function pick(arr) {
  if (!arr || arr.length === 0) return '';
  return arr[Math.floor(Math.random() * arr.length)];
}

// ── MISSED messages ──
// Varies by tone + motivationStyle
const MISSED = {
  soft: {
    gentle: [
      "It's okay. Tomorrow is a fresh start.",
      "Missing one day doesn't erase your progress.",
      "Rest is part of the process. Get back tomorrow.",
      "You're human. Try again.",
    ],
    accountable: [
      "Missed today. That's fine — but don't make it a habit.",
      "One miss. You can recover. Just don't skip tomorrow too.",
      "Logged as missed. Tomorrow is your chance to fix it.",
    ],
    brutal: [
      "You missed it. That's on you. Be honest about why.",
      "Missed. No excuses. Just do better tomorrow.",
      "Skipped. You know you could have done it.",
    ],
  },
  discipline: {
    gentle: [
      "Missed it. Your future self is unimpressed.",
      "Logged as missed. Bold strategy.",
      "Skipped. The streak noticed.",
    ],
    accountable: [
      "Missed. The streak is watching.",
      "Another miss. Interesting pattern.",
      "Logged as missed. Don't let it become a trend.",
      "Skipped. The habit didn't skip you though.",
    ],
    brutal: [
      "Missed. Shocking. Truly shocking.",
      "Another day, another excuse. Classic.",
      "The habit didn't miss you though.",
      "Zero effort. Impressive in its own way.",
    ],
  },
  savage: {
    gentle: [
      "Missed. Even on your easy days, huh.",
      "Skipped again. Interesting life choice.",
      "The habit is still here. You weren't.",
    ],
    accountable: [
      "Your streak called. It's crying.",
      "Missed. The consistency report is not going to be pretty.",
      "Logged as missed. The data doesn't lie.",
    ],
    brutal: [
      "Missed. Shocking. Truly shocking.",
      "Another day, another excuse. Classic.",
      "Zero effort. Impressive in its own way.",
      "Your streak called. It's crying.",
      "The habit didn't miss you though.",
    ],
  },
};

// ── DONE messages ──
// Varies by tone + motivationStyle
const DONE = {
  soft: {
    gentle: [
      "Great job! You showed up today.",
      "Done. You're building something real.",
      "One more day closer to your goal.",
      "Proud of you. Keep it going.",
    ],
    accountable: [
      "Done. That's what consistency looks like.",
      "Logged. You're holding yourself accountable.",
      "Marked done. One step closer.",
    ],
    brutal: [
      "Done. Good. Now do it again tomorrow.",
      "Logged. Don't stop here.",
      "Completed. The work continues.",
    ],
  },
  discipline: {
    gentle: [
      "Done. Bare minimum, but still done.",
      "Logged. Your future self is mildly impressed.",
      "Marked done. The bar was low. You cleared it.",
    ],
    accountable: [
      "Okay fine, you did it.",
      "Done. That's what showing up looks like.",
      "Logged. Consistency is building.",
      "Marked done. Keep the streak alive.",
    ],
    brutal: [
      "Done. Finally.",
      "Logged. Don't expect applause.",
      "You did the thing. Barely counts, but it counts.",
    ],
  },
  savage: {
    gentle: [
      "Done? Nice. Bare minimum, but still nice.",
      "Logged. Try doing it again tomorrow.",
      "Okay fine, you did it.",
    ],
    accountable: [
      "Done. The streak lives another day.",
      "Logged. Don't ruin it tomorrow.",
      "Marked done. The data is watching.",
    ],
    brutal: [
      "Done? Took you long enough.",
      "Logged. Don't expect a parade.",
      "Fine. You showed up. Don't make it weird.",
    ],
  },
};

// ── STREAK BROKEN messages ──
// Varies by tone + painTrigger
const STREAK_BROKEN = {
  soft: {
    streak: [
      "Streak reset. That's okay — start fresh.",
      "Every expert was once a beginner. Reset and go.",
      "The streak broke. The habit doesn't have to.",
    ],
    goals: [
      "Streak gone, but your goal is still there.",
      "One reset doesn't erase your progress toward your goal.",
      "The goal remains. Start the streak again.",
    ],
    time: [
      "Time lost, but not wasted if you learn from it.",
      "Streak reset. Use this moment to refocus.",
      "It's okay. Every day is a new chance.",
    ],
    consistency: [
      "Consistency dipped. It happens. Rebuild.",
      "The streak broke. Your consistency report will recover.",
      "Reset. Consistency is built over time, not one streak.",
    ],
  },
  discipline: {
    streak: [
      "Streak gone. Back to zero. That's on you.",
      "The streak is dead. Long live the next streak.",
      "Reset. Painful, but fixable.",
    ],
    goals: [
      "Streak broken. Your goal just got harder.",
      "Reset. The goal doesn't move. You have to.",
      "Streak gone. Refocus on what you're actually trying to achieve.",
    ],
    time: [
      "Time wasted. The streak is gone. Don't waste more.",
      "Reset. Every missed day is time you don't get back.",
      "Streak broken. The clock doesn't stop.",
    ],
    consistency: [
      "Consistency broken. The report will show it.",
      "Streak gone. Your consistency score just took a hit.",
      "Reset. Inconsistency is a pattern. Break it.",
    ],
  },
  savage: {
    streak: [
      "Streak obliterated. Congrats on that.",
      "Days of work, gone. Hope it was worth it.",
      "Zero. You had it. You lost it. Classic.",
      "The streak is dead. You killed it.",
    ],
    goals: [
      "Streak gone. Your goal is laughing at you.",
      "Reset. The goal didn't move. You did — backwards.",
      "Streak dead. The goal is still waiting. Patiently.",
    ],
    time: [
      "Time wasted. Streak gone. Impressive combo.",
      "Reset. That's time you're not getting back.",
      "Streak obliterated. The clock noticed.",
    ],
    consistency: [
      "Consistency report incoming. It's not good.",
      "Streak gone. Your consistency score is having a crisis.",
      "Reset. The data is brutal. So is the truth.",
    ],
  },
};

// ── INACTIVITY messages ──
// Varies by tone + goal
const INACTIVITY = {
  soft: [
    "Hey, we miss you. Come back when you're ready.",
    "It's been a while. No judgment — just check in.",
    "Your habits are waiting. No pressure.",
  ],
  discipline: [
    "Two days gone. The habits are still here. Are you?",
    "Inactivity detected. Suspicious.",
    "You've been quiet. The streak hasn't forgotten.",
  ],
  savage: [
    "Two days of nothing. Truly inspiring.",
    "Ghost mode activated. The habits noticed.",
    "Missing in action. The habits filed a report.",
  ],
};

// ── STREAK MILESTONE messages ──
// Varies by tone
const MILESTONE = {
  3: {
    soft:       ["3 days in a row! You're building momentum.", "Three days done. Keep going!", "3-day streak. You're on your way."],
    discipline: ["3-day streak. Now this is real.", "Three days. Okay, you're not quitting.", "3 in a row. Suspicious."],
    savage:     ["3 days. Don't ruin it now.", "Three days straight. Barely impressive, but impressive.", "3-day streak. Try not to blow it."],
  },
  7: {
    soft:       ["A full week! You're doing amazing.", "7 days straight. That's real dedication.", "One week done. You should be proud."],
    discipline: ["7-day streak. Suspiciously disciplined.", "A full week. Who are you?", "Seven days straight. Respect."],
    savage:     ["7 days. Okay fine, that's actually something.", "A week straight. Calm down.", "Seven days. Who even are you?"],
  },
  10: {
    soft:       ["10 days! You're building a real habit now.", "Double digits. You're doing this.", "10-day streak. Incredible consistency."],
    discipline: ["10-day streak. Impressive.", "Double digits. Calm down.", "10 days. You're actually doing this."],
    savage:     ["10 days. Annoyingly consistent.", "Double digits. Show-off.", "10-day streak. Fine. You're built different."],
  },
};

// ── Public API ──

export function getMissedMessage() {
  const prefs = getPrefs();
  const tone = prefs.toneMode || 'discipline';
  const style = prefs.motivationStyle || 'accountable';
  return pick(MISSED[tone]?.[style] || MISSED.discipline.accountable);
}

export function getDoneMessage() {
  const prefs = getPrefs();
  const tone = prefs.toneMode || 'discipline';
  const style = prefs.motivationStyle || 'accountable';
  return pick(DONE[tone]?.[style] || DONE.discipline.accountable);
}

export function getStreakBrokenMessage() {
  const prefs = getPrefs();
  const tone = prefs.toneMode || 'discipline';
  // Pick the first pain trigger if multiple selected
  const triggers = Array.isArray(prefs.painTrigger) ? prefs.painTrigger : [prefs.painTrigger || 'streak'];
  const trigger = triggers[0] || 'streak';
  return pick(STREAK_BROKEN[tone]?.[trigger] || STREAK_BROKEN.discipline.streak);
}

export function getInactivityMessage() {
  const prefs = getPrefs();
  const tone = prefs.toneMode || 'discipline';
  return pick(INACTIVITY[tone] || INACTIVITY.discipline);
}

export function getMilestoneMessage(days) {
  const prefs = getPrefs();
  const tone = prefs.toneMode || 'discipline';
  const msgs = MILESTONE[days]?.[tone] || MILESTONE[days]?.discipline;
  return msgs ? pick(msgs) : null;
}
