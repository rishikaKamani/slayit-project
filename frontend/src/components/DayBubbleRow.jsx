export default function DayBubbleRow({ days, currentDayIndex }) {
  return (
    <div className="day-bubble-row">
      {days.map((day, index) => {
        const isCurrent = index === currentDayIndex;
        const isLocked = index !== currentDayIndex && day.status === "pending";

        return (
          <div
            key={index}
            className={`day-bubble ${day.status} ${isCurrent ? 'active-day' : ''} ${isLocked ? 'locked-day' : ''}`}
            title={`Day ${day.day}`}
          >
            <span className="day-bubble-number">{day.day}</span>
          </div>
        );
      })}
    </div>
  );
}