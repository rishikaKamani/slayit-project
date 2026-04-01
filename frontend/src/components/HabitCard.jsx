import { useEffect, useRef, useState } from "react";
import api from "../api/client";
import DayBubbleRow from "./DayBubbleRow";
import { calculateStreak, countCompletedDays, getCurrentDayIndex, isFullyCompleted } from "../utils/streak";
import { playDone, playMiss, playMilestone, playSlay } from "../utils/sounds";
import { generateShareCard, downloadShareCard, shareCard } from "../utils/shareCard";
import "./streak-polish.css";

const MILESTONES = [3, 7, 10];
const EMOJI = { crown: "??", fire: "??", muscle: "??", smile: "??", grimace: "??", skull: "??" };

const STREAK_MSGS = {
  high: ["Unstoppable. Annoyingly so.", "You're showing off now.", "Okay fine, you're built different.", "This is getting suspicious.", "Double digits. Calm down."],
  good: ["Serious consistency. Gross.", "You're actually doing it.", "Seven days. Who even are you?", "Respect. Reluctantly.", "This is real now."],
  mid:  ["Building momentum. Don't ruin it.", "Three days in. Don't get cocky.", "Okay, you're trying.", "Momentum rising. Barely.", "Keep going before you forget."],
  low:  ["Started. Try not to stop.", "One day. Let's not celebrate yet.", "A start. Suspicious, but a start.", "Day one. Classic.", "Fine. You showed up."],
  zero: ["No momentum yet. Shocking.", "Zero streak. A bold choice.", "Nothing. Truly nothing.", "The streak is a myth right now.", "You could start. You won't. But you could."],
};
const DONE_MSGS = ["Done? Nice. Bare minimum, but still nice.", "Saved. Your future self is mildly impressed.", "Logged. Don't expect applause.", "Done. One day at a time, apparently.", "Marked done. The bar was low. You cleared it.", "Okay fine, you did it.", "Logged. Try doing it again tomorrow."];
const MISSED_MSGS = ["Missed it. Your future self is unimpressed.", "Logged as missed. Bold strategy.", "Skipped. The streak noticed.", "Missed. The habit didn't miss you though.", "Another miss. Interesting pattern.", "Noted. Not great, not great at all."];
const MILESTONE_MSGS = {
  3:  ["3-day streak. Now this is real.", "Three days. Okay, you're not quitting.", "3 in a row. Suspicious."],
  7:  ["7-day streak. Suspiciously disciplined.", "A full week. Who are you?", "Seven days straight. Respect."],
  10: ["10-day streak. Impressive.", "Double digits. Calm down.", "10 days. You're actually doing this."],
};

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function getStreakMsg(streak) {
  if (streak >= 10) return pick(STREAK_MSGS.high);
  if (streak >= 7)  return pick(STREAK_MSGS.good);
  if (streak >= 3)  return pick(STREAK_MSGS.mid);
  if (streak >= 1)  return pick(STREAK_MSGS.low);
  return pick(STREAK_MSGS.zero);
}
function parseDate(raw) {
  if (!raw) return null;
  if (Array.isArray(raw)) return new Date(raw[0], raw[1] - 1, raw[2]);
  const s = String(raw).split("T")[0];
  const p = s.split("-");
  if (p.length === 3) return new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
  return null;
}
function isPeriodOver(createdDate, durationDays) {
  const start = parseDate(createdDate);
  if (!start) return false;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return Math.floor((today - start) / 86400000) >= Number(durationDays);
}

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
  const [currentStreakMsg, setCurrentStreakMsg] = useState(() => getStreakMsg(calculateStreak(buildDays(habit))));
  const [sharePreview, setSharePreview] = useState(null);
  const [shareCopied, setShareCopied] = useState(false);
  const previousStreakRef = useRef(calculateStreak(buildDays(habit)));
  const removedRef = useRef(false);

  useEffect(() => {
    if (removedRef.current) return;
    if (isPeriodOver(habit.createdDate, duration) || isFullyCompleted(buildDays(habit))) {
      removedRef.current = true;
      onHideCompleted(habit.id);
    }
  }, []);

  const currentDayIndex = getCurrentDayIndex(days);
  const completedCount = countCompletedDays(days);
  const streak = calculateStreak(days);
  const progress = Math.round((completedCount / duration) * 100);
  const fullyDone = isFullyCompleted(days);
  const daysLeft = Math.max(duration - completedCount, 0);

  const emojiKey = streak >= 10 ? "crown" : streak >= 7 ? "fire" : streak >= 3 ? "muscle" : streak >= 1 ? "smile" : completedCount > 0 ? "grimace" : "skull";
  const emojiText = streak >= 10 ? "Discipline mode" : streak >= 7 ? "On fire" : streak >= 3 ? "Momentum rising" : streak >= 1 ? "Getting started" : "No consistency";

  const todayStatus = (() => {
    if (fullyDone) return "Completed";
    if (currentDayIndex === -1) return "Over";
    const s = days[currentDayIndex] ? days[currentDayIndex].status : "";
    if (s === "done") return "Done";
    if (s === "missed") return "Missed";
    return "Pending";
  })();

  const handleCelebration = (newStreak) => {
    if (!MILESTONES.includes(newStreak)) return;
    playMilestone();
    const milestoneMsg = getMilestoneMessage(newStreak);
    const fallback = MILESTONE_MSGS[newStreak] || [];
    const msg = milestoneMsg || (fallback.length ? pick(fallback) : (newStreak + "-day streak!"));
    setCelebrationText(msg); setShowConfetti(true); setAnimateEmoji(true);
    setTimeout(() => setShowConfetti(false), 2200);
    setTimeout(() => setAnimateEmoji(false), 900);
  };

  const handleMark = async (status) => {
    if (saving || currentDayIndex === -1) return;
    setSaving(true);
    try {
      await api.post("/habits/" + habit.id + "/log", { status: status.toUpperCase(), dayNumber: currentDayIndex + 1 });
      const updated = days.map((d, i) => i === currentDayIndex ? { ...d, status: status.toLowerCase() } : d);
      const newStreak = calculateStreak(updated);
      setDays(updated);
      setFeedback(status === "DONE" ? pick(DONE_MSGS) : pick(MISSED_MSGS));
      setCurrentStreakMsg(getStreakMsg(newStreak));
      if (status === "DONE") {
        if (newStreak > previousStreakRef.current) handleCelebration(newStreak);
        else playDone();
      } else {
        playMiss();
      }
      previousStreakRef.current = newStreak;
      if (isFullyCompleted(updated)) {
        removedRef.current = true;
        playSlay();
        setShowConfetti(true);
        setCompletionNotice("You did it. Every single day. That's rare.");
        setIsHiding(true);
        setTimeout(() => onHideCompleted(habit.id), 1200);
      }
    } catch (err) {
      setFeedback((err.response && err.response.data && err.response.data.message) || "Could not save.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) { setConfirmDelete(true); setTimeout(() => setConfirmDelete(false), 3000); return; }
    try {
      await api.delete("/habits/" + habit.id);
      setIsHiding(true);
      setTimeout(() => onDelete(habit.id), 350);
    } catch (err) { setFeedback("Could not delete."); }
  };

  const handleShare = () => {
    const dataUrl = generateShareCard({ habitName: habit.name, streak, completed: completedCount, total: duration, category: habit.category });
    setSharePreview(dataUrl);
  };

  const handleShareLink = async () => {
    const result = await shareCard(sharePreview, habit.name, streak);
    if (result === "copied" || result === "shared") {
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2500);
    }
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

      {sharePreview && (
        <div className="share-modal-overlay" onClick={() => setSharePreview(null)}>
          <div className="share-modal" onClick={(e) => e.stopPropagation()}>
            <div className="share-modal-header">
              <p className="share-modal-title">Your streak card ??</p>
              <button className="share-x-btn" onClick={() => setSharePreview(null)}>x</button>
            </div>
            <img src={sharePreview} alt="streak card" className="share-preview-img" />
            <p className="share-modal-hint">Flex this. You earned it.</p>
            <div className="share-modal-actions">
              <button className="share-download-btn" onClick={() => downloadShareCard(sharePreview, habit.name)}>Download</button>
              <button className="share-link-btn" onClick={handleShareLink}>
                {shareCopied ? "Copied!" : "Share Link"}
              </button>
            </div>
          </div>
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
              <button className="share-streak-btn" onClick={handleShare}>Share</button>
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
        <p className="habit-message">{completionNotice || feedback || currentStreakMsg}</p>
      </div>
      <div className="streak-side-box">
        <div className="streak-pill">{streak} day streak</div>
        <div className={"big-emoji-box" + (animateEmoji ? " emoji-bounce" : "")}>
          <div className="big-emoji">{EMOJI[emojiKey]}</div>
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
        <div className="streak-roast-box">{currentStreakMsg}</div>
      </div>
    </div>
  );
}
