// ── Personality-Driven Feedback System ──
// Mode: 'soft' | 'discipline' | 'savage'
// Default = 'discipline' (matches existing app tone)

const MODE_KEY = 'slayit_mode';

export function getMode() {
  return localStorage.getItem(MODE_KEY) || 'discipline';
}

export function setMode(mode) {
  localStorage.setItem(MODE_KEY, mode);
}

const MESSAGES = {
  missed: {
    soft: [
      "It's okay. Tomorrow is a fresh start.",
      "Missing one day doesn't erase your progress.",
      "Rest is part of the process. Get back tomorrow.",
      "You're human. Try again.",
    ],
    discipline: [
      "Missed it. Your future self is unimpressed.",
      "Logged as missed. Bold strategy.",
      "Skipped. The streak noticed.",
      "Another miss. Interesting pattern.",
    ],
    savage: [
      "Missed. Shocking. Truly shocking.",
      "Another day, another excuse. Classic.",
      "The habit didn't miss you though.",
      "Zero effort. Impressive in its own way.",
      "Your streak called. It's crying.",
    ],
  },
  done: {
    soft: [
      "Great job! You showed up today.",
      "Done. You're building something real.",
      "One more day closer to your goal.",
      "Proud of you. Keep it going.",
    ],
    discipline: [
      "Done. Bare minimum, but still done.",
      "Logged. Your future self is mildly impressed.",
      "Marked done. The bar was low. You cleared it.",
      "Okay fine, you did it.",
    ],
    savage: [
      "Done? Took you long enough.",
      "Logged. Don't expect a parade.",
      "You did the thing. Barely counts, but it counts.",
      "Fine. You showed up. Don't make it weird.",
    ],
  },
  streakBroken: {
    soft: [
      "Streak reset. That's okay — start fresh.",
      "Every expert was once a beginner. Reset and go.",
      "The streak broke. The habit doesn't have to.",
    ],
    discipline: [
      "Streak gone. Back to zero. That's on you.",
      "The streak is dead. Long live the next streak.",
      "Reset. Painful, but fixable.",
    ],
    savage: [
      "Streak obliterated. Congrats on that.",
      "Days of work, gone. Hope it was worth it.",
      "Zero. You had it. You lost it. Classic.",
      "The streak is dead. You killed it.",
    ],
  },
  inactivity: {
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
  },
};

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function getMissedMessage() {
  const mode = getMode();
  return pick(MESSAGES.missed[mode] || MESSAGES.missed.discipline);
}

export function getDoneMessage() {
  const mode = getMode();
  return pick(MESSAGES.done[mode] || MESSAGES.done.discipline);
}

export function getStreakBrokenMessage() {
  const mode = getMode();
  return pick(MESSAGES.streakBroken[mode] || MESSAGES.streakBroken.discipline);
}

export function getInactivityMessage() {
  const mode = getMode();
  return pick(MESSAGES.inactivity[mode] || MESSAGES.inactivity.discipline);
}
