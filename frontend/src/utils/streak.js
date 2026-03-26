export function calculateStreak(days) {
  const markedDays = days.filter((day) => day.status !== "pending");
  let streak = 0;

  for (let i = markedDays.length - 1; i >= 0; i--) {
    if (markedDays[i].status === "done") {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

export function countCompletedDays(days) {
  return days.filter((day) => day.status === "done").length;
}

// Current day = first day that is NOT done and NOT missed (i.e. still actionable)
// Returns -1 only if every day has been logged (done or missed)
export function getCurrentDayIndex(days) {
  for (let i = 0; i < days.length; i++) {
    const s = (days[i].status || "pending").toLowerCase().trim();
    if (s !== "done" && s !== "missed") {
      return i;
    }
  }
  return -1;
}

// True only when every single day is marked done
export function isFullyCompleted(days) {
  return days.length > 0 && days.every((d) => {
    const s = (d.status || "").toLowerCase().trim();
    return s === "done";
  });
}

// True when the habit's duration window has passed (based on createdDate)
export function isHabitPeriodOver(createdDate, durationDays) {
  if (!createdDate) return false;
  let start;
  // Handle array format [2026, 3, 25] from Java LocalDate
  if (Array.isArray(createdDate)) {
    start = new Date(createdDate[0], createdDate[1] - 1, createdDate[2]);
  } else {
    const parts = String(createdDate).split('T')[0].split('-');
    start = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daysPassed = Math.floor((today - start) / (1000 * 60 * 60 * 24));
  return daysPassed >= Number(durationDays);
}
