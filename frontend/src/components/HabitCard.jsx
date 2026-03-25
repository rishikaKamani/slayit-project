import { useEffect, useMemo, useRef, useState } from "react";
import api from "../api/client";
import DayBubbleRow from "./DayBubbleRow";
import { calculateStreak, countCompletedDays, getCurrentDayIndex, isFullyCompleted, isHabitPeriodOver } from "../utils/streak";
import "./streak-polish.css";

const MILESTONES = [3, 7, 10];
const BIG_EMOJI = { crown: "\uD83D\uDC51", fire: "\uD83D\uDD25", muscle: "\uD83D\uDCAA", smile: "\uD83D\uDE42", grimace: "\uD83D\uDE2C", skull: "\uD83D\uDC80" };

export default function HabitCard({ habit, onHideCompleted, onDelete }) {
  const duration = Number(habit.durationDays || 1);
  const buildDays = (h) => {
    if (h.days && h.days.length > 0) return h.days.map((d) => ({ day: d.day, status: (d.status || "pending").toLowerCase().trim() }));
    return Array.from({ length: Number(h.durationDays || 1) }, (_, i) => ({ day: i + 1, status: "pending" }));
  };
  const [days, setDays] = useState(() => buildDays(habit));
  const [feedback, setFeedback] = useState("");
  const [saving, setSaving] = useState(false);
  const [completionNotice, setCompletionNotice] = useState("");
  const [isHiding, setIsHiding] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [celebrationText, setCelebrationText] = useState("");
  const [animateEmoji, setAnimateEmoji] = useState(false);
  const firedRef = useRef(false);
  const previousStreakRef = useRef(0);
  const onHideRef = useRef(onHideCompleted);
  useEffect(() => { onHideRef.current = onHideCompleted; });

  const triggerHide = (notice) => {
    if (firedRef.current) return;
    firedRef.current = true;
    setCompletionNotice(notice);
    setTimeout(() => setIsHiding(true), 2200);
    setTimeout(() => { if (onHideRef.current) onHideRef.current(habit.id); }, 2600);
  };

  useEffect(() => {
    if (isFullyCompleted(days)) { setShowConfetti(true); triggerHide("You did it. Every single day. That's rare."); }
  }, [days]);

  useEffect(() => {
    if (!isFullyCompleted(days) && isHabitPeriodOver(habit.createdDate, duration)) triggerHide("Habit period ended. Moving to history...");
  }, []);

  const currentDayIndex = getCurrentDayIndex(days);
  const completedCount = countCompletedDays(days);
  const streak = calculateStreak(days);
  const progress = Math.round((completedCount / duration) * 100);
  const fullyDone = isFullyCompleted(days);
  const daysLeft = Math.max(duration - completedCount, 0);

  const todayStatus = useMemo(() => {
    if (fullyDone) return "Completed";
    if (currentDayIndex === -1) return "Over";
    const s = days[currentDayIndex] ? days[currentDayIndex].status : "";
    if (s === "done") return "Done";
    if (s === "missed") return "Missed";
    return "Pending";
  }, [currentDayIndex, days, fullyDone]);

  const streakMsg = streak >= 10 ? "Unstoppable." : streak >= 7 ? "Serious consistency." : streak >= 3 ? "Building momentum." : streak >= 1 ? "Started. Keep going." : "No momentum yet.";
  const emojiKey = streak >= 10 ? "crown" : streak >= 7 ? "fire" : streak >= 3 ? "muscle" : streak >= 1 ? "smile" : completedCount > 0 ? "grimace" : "skull";
  const emojiText = streak >= 10 ? "Discipline mode" : streak >= 7 ? "On fire" : streak >= 3 ? "Momentum rising" : streak >= 1 ? "Getting started" : "No consistency";

  const handleCelebration = (newStreak) => {
    if (!MILESTONES.includes(newStreak)) return;
    const msg = newStreak === 3 ? "3-day streak! Now this is real." : newStreak === 7 ? "7-day streak. Suspiciously disciplined." : "10-day streak. Impressive.";
    setCelebrationText(msg); setShowConfetti(true); setAnimateEmoji(true);
    setTimeout(() => setShowConfetti(false), 2200);
    setTimeout(() => setAnimateEmoji(false), 900);
  };

  const handleMark = async (status) => {
    if (saving || currentDayIndex === -1) return;
    setSaving(true);
    try {
      const res = await api.post("/habits/" + habit.id + "/log", { status: status.toUpperCase(), dayNumber: currentDayIndex + 1 });
      const updated = days.map((d, i) => i === currentDayIndex ? { ...d, status: status.toLowerCase() } : d);
      const newStreak = calculateStreak(updated);
      setDays(updated);
      setFeedback((res.data && res.data.feedback) || (status === "DONE" ? "Saved." : "Missed day saved."));
      if (status === "DONE" && newStreak > previousStreakRef.current) handleCelebration(newStreak);
      previousStreakRef.current = newStreak;
    } catch (err) { setFeedback((err.response && err.response.data && err.response.data.message) || "Could not save."); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!confirmDelete) { setConfirmDelete(true); setTimeout(() => setConfirmDelete(false), 3000); return; }
    try { await api.delete("/habits/" + habit.id); setIsHiding(true); setTimeout(() => { if (onDelete) onDelete(habit.id); }, 350); }
    catch (err) { setFeedback("Could not delete."); }
  };

  const cardClass = "habit-card enhanced-habit-card" + (showConfetti ? " celebration-active" : "") + (isHiding ? " habit-card-hiding" : "");
  const badgeClass = "habit-type-badge " + (habit.timeBound ? "badge-timebound" : "badge-flexible");
  const delClass = "delete-habit-btn" + (confirmDelete ? " delete-confirm" : "");

  return (
    <div className={cardClass}>
      {showConfetti && (
        <div className="confetti-layer" aria-hidden="true">
          {Array.from({ length: 24 }).map((_, i) => (
            <span key={i} className="confetti-piece" style={{ left: (i * 4.1 % 100) + "%", animationDelay: (i % 8 * 0.08) + "s" }} />
          ))}
        </div>
      )}
      <div className="habit-card-main">
        <div className="habit-card-header">
          <div className="habit-card-heading">
            <div className="habit-topline">
              <p className="habit-category">{habit.category}</p>
              <span className={badgeClass}>{habit.timeBound ? "Time-bound" : "Flexible"}</span>
              {streak >= 10 && <span className="unlock-badge">Discipline King</span>}
              {streak >= 7 && streak < 10 && <span className="unlock-badge">7 Day Beast</span>}
              {streak >= 3 && streak < 7 && <span className="unlock-badge">Momentum Unlocked</span>}
            </div>
            <h3>{habit.name}</h3>
            {habit.description && <p className="habit-description">{habit.description}</p>}
            <div className="habit-meta-row">
              <p className="habit-duration">{duration} day goal</p>
              <p className="habit-duration">{habit.timeBound && habit.targetTime ? "Target: " + habit.targetTime : "Complete anytime"}</p>
              <button className={delClass} onClick={handleDelete}>{confirmDelete ? "Sure? Click again" : "Delete"}</button>
            </div>
          </div>
        </div>
        <DayBubbleRow days={days} currentDayIndex={currentDayIndex} />
        <div className="habit-summary-row"><span>{completedCount}/{duration} days done</span><span>{progress}% complete</span></div>
        <div className="progress-bar-shell"><div className="progress-bar-fill" style={{ width: progress + "%" }} /></div>
        <div className="current-day-panel">
          {fullyDone && <p className="current-day-text">Done. You completed the whole habit. Weirdly impressive.</p>}
          {!fullyDone && currentDayIndex === -1 && <p className="current-day-text">Habit period is over. Moving to history...</p>}
          {!fullyDone && currentDayIndex !== -1 && (
            <div>
              <p className="current-day-text">Current day: <strong>Day {currentDayIndex + 1}</strong></p>
              <div className="habit-actions">
                <button className="done-btn" onClick={() => handleMark("DONE")} disabled={saving}>{saving ? "Saving..." : "Mark Done"}</button>
                <button className="miss-btn" onClick={() => handleMark("MISSED")} disabled={saving}>{saving ? "Saving..." : "Miss Day"}</button>
              </div>
            </div>
          )}
        </div>
        <p className="habit-message">{completionNotice || feedback || streakMsg}</p>
      </div>
      <div className="streak-side-box">
        <div className="streak-pill">{streak} day streak</div>
        <div className={"big-emoji-box" + (animateEmoji ? " emoji-bounce" : "")}>
          <div className="big-emoji">{BIG_EMOJI[emojiKey]}</div>
          <div className="big-emoji-text">{emojiText}</div>
        </div>
        {celebrationText && <div className={"celebration-banner" + (showConfetti ? " show-banner" : "")}>{celebrationText}</div>}
        <div className="streak-metrics"><span>Progress</span><strong>{progress}%</strong></div>
        <div className="streak-metrics"><span>Completed</span><strong>{completedCount}/{duration}</strong></div>
        <div className="streak-metrics"><span>Today</span><strong>{todayStatus}</strong></div>
        <div className="streak-metrics"><span>Days left</span><strong>{daysLeft}</strong></div>
        <div className="pressure-box">
          <div className="pressure-title">Pressure</div>
          <div className="pressure-line">{todayStatus === "Done" || todayStatus === "Completed" ? "Completed today" : "You haven't done this today"}</div>
          <div className="streak-warning">{todayStatus === "Done" || todayStatus === "Completed" ? "Today's entry is safe." : "Miss today - streak resets to 0"}</div>
        </div>
        <div className="streak-roast-box">{streakMsg}</div>
      </div>
    </div>
  );
}