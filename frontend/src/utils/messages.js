export function getActionMessage(status, streak = 0) {
  if (status === "done") {
    if (streak >= 10) return "Okay wow. You’re being annoyingly disciplined.";
    if (streak >= 5) return "Suspicious improvement. Keep going.";
    if (streak >= 2) return "Fine. You actually showed up again.";
    return "Done? Nice. Bare minimum, but still nice.";
  }

  if (status === "missed") {
    if (streak >= 5) return "You ruined a decent streak. Impressive.";
    return "Missed it. Your future self is unimpressed.";
  }

  return "No update yet. Quiet, but not convincing.";
}

export function getStreakRoast(streak, completed, total) {
  if (total === 0) return "No habit, no streak, no shame. Convenient.";
  if (completed === total) return "Full completion? Who even are you?";
  if (streak >= 10) return "Double digits. Don’t get arrogant.";
  if (streak >= 5) return "This is actually respectable. Annoying.";
  if (streak >= 2) return "You’ve got momentum. Try not to ruin it.";
  if (streak === 1) return "One day. Let’s not call it a comeback yet.";
  return "Zero streak. A strong start to disappointment.";
}