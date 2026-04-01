import { computeHabitAnalytics } from '../utils/analytics';

/**
 * Analytics insights panel — displayed BELOW existing stats.
 * Read-only. Does not modify any existing state or props.
 */
export default function AnalyticsInsights({ days, createdDate }) {
  const { bestDay, worstDay, consistencyScore, weeklyInsight } = computeHabitAnalytics(days, createdDate);

  const logged = (days || []).filter((d) => {
    const s = (d.status || '').toLowerCase();
    return s === 'done' || s === 'missed';
  });

  if (logged.length === 0) return null;

  return (
    <div className="analytics-insights">
      <p className="analytics-title">Insights</p>
      <div className="analytics-grid">
        {bestDay && (
          <div className="analytics-stat">
            <span className="analytics-stat-label">Best Day</span>
            <span className="analytics-stat-value">📈 {bestDay}</span>
          </div>
        )}
        {worstDay && worstDay !== bestDay && (
          <div className="analytics-stat">
            <span className="analytics-stat-label">Worst Day</span>
            <span className="analytics-stat-value">📉 {worstDay}</span>
          </div>
        )}
        <div className="analytics-stat">
          <span className="analytics-stat-label">Consistency</span>
          <span className="analytics-stat-value">{consistencyScore}%</span>
        </div>
      </div>
      <p className="analytics-insight-text">{weeklyInsight}</p>
    </div>
  );
}
