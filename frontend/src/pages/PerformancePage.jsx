import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/client';
import { getScoreEmoji, getScoreMessage } from '../utils/score';
import { computeOverallAnalytics } from '../utils/analytics';
import ModeSelector from '../components/ModeSelector';

export default function PerformancePage() {
  const [performance, setPerformance] = useState(null);
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const [perfRes, habitsRes] = await Promise.all([
          api.get('/dashboard/performance'),
          api.get('/habits'),
        ]);
        setPerformance(perfRes.data);
        setHabits(habitsRes.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load performance.');
      } finally {
        setLoading(false);
      }
    };
    fetchPerformance();
  }, []);

  return (
    <div className="page-shell">
      <Navbar />

      <div className="dashboard-page">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Overall Performance</h1>
            <p className="dashboard-subtitle">
              This is where your habits stop being vibes and become numbers.
            </p>
          </div>
        </div>

        {loading && <p>Loading performance...</p>}
        {!loading && error && <p className="error-text">{error}</p>}

        {!loading && !error && performance && (
          <>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '20px',
                marginBottom: '28px'
              }}
            >
              <div className="glass-card" style={{ padding: '24px', borderRadius: '24px' }}>
                <p className="eyebrow">Overall Score</p>
                <h2 style={{ fontSize: '2rem', margin: '8px 0' }}>
                  {performance.overallScore}% {getScoreEmoji(performance.overallScore)}
                </h2>
                <p className="muted">
                  {performance.totalCompletedDays}/{performance.totalTargetDays} total days completed
                </p>
                <p className="muted" style={{ marginTop: '10px', fontSize: '0.95rem' }}>
                  {getScoreMessage(performance.overallScore)}
                </p>
              </div>

              <div className="glass-card" style={{ padding: '24px', borderRadius: '24px' }}>
                <p className="eyebrow">This Week</p>
                <h2 style={{ fontSize: '2rem', margin: '8px 0' }}>
                  {performance.thisWeekScore}% {getScoreEmoji(performance.thisWeekScore)}
                </h2>
                <p className="muted">Your current weekly consistency</p>
                <p className="muted" style={{ marginTop: '10px', fontSize: '0.95rem' }}>
                  {getScoreMessage(performance.thisWeekScore)}
                </p>
              </div>

              <div className="glass-card" style={{ padding: '24px', borderRadius: '24px' }}>
                <p className="eyebrow">Last Week</p>
                <h2 style={{ fontSize: '2rem', margin: '8px 0' }}>
                  {performance.lastWeekScore}% {getScoreEmoji(performance.lastWeekScore)}
                </h2>
                <p className="muted">How you performed in the previous week</p>
                <p className="muted" style={{ marginTop: '10px', fontSize: '0.95rem' }}>
                  {getScoreMessage(performance.lastWeekScore)}
                </p>
              </div>

              <div className="glass-card" style={{ padding: '24px', borderRadius: '24px' }}>
                <p className="eyebrow">Weekly Change</p>
                <h2 style={{ fontSize: '2rem', margin: '8px 0' }}>
                  {performance.improvementPercentage > 0 ? '+' : ''}
                  {performance.improvementPercentage}%{' '}
                  {performance.improvementPercentage > 0
                    ? '📈'
                    : performance.improvementPercentage < 0
                    ? '📉'
                    : '🫥'}
                </h2>
                <p className="muted">{performance.totalHabits} habits tracked</p>
                <p className="muted" style={{ marginTop: '10px', fontSize: '0.95rem' }}>
                  {performance.improvementPercentage > 0
                    ? 'Better than last week. Finally.'
                    : performance.improvementPercentage < 0
                    ? 'Dropped from last week. Not ideal.'
                    : 'No change. Stable, but boring.'}
                </p>
              </div>
            </div>

            <div
              className="glass-card"
              style={{ padding: '24px', borderRadius: '24px', marginBottom: '24px' }}
            >
              <h3 style={{ marginBottom: '8px' }}>Performance Note</h3>
              <p className="muted" style={{ fontSize: '1rem' }}>
                {performance.performanceMessage}
              </p>
            </div>

            <div className="glass-card" style={{ padding: '24px', borderRadius: '24px' }}>
              <h3 style={{ marginBottom: '18px' }}>Habit-wise Score</h3>

            <div style={{ overflowX: 'auto' }} className="perf-table-wrap">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ textAlign: 'left' }}>
                      <th style={{ padding: '12px 10px' }}>Habit</th>
                      <th style={{ padding: '12px 10px' }}>Category</th>
                      <th style={{ padding: '12px 10px' }}>Completed</th>
                      <th style={{ padding: '12px 10px' }}>Target</th>
                      <th style={{ padding: '12px 10px' }}>Score</th>
                      <th style={{ padding: '12px 10px' }}>Mood</th>
                    </tr>
                  </thead>
                  <tbody>
                    {performance.habitScores?.map((habit) => (
                      <tr
                        key={habit.habitId}
                        style={{ borderTop: '1px solid rgba(80, 50, 90, 0.08)' }}
                      >
                        <td data-label="Habit" style={{ padding: '14px 10px', fontWeight: 600 }}>
                          {habit.habitName}
                        </td>
                        <td data-label="Category" style={{ padding: '14px 10px' }}>{habit.category}</td>
                        <td data-label="Completed" style={{ padding: '14px 10px' }}>{habit.completedDays}</td>
                        <td data-label="Target" style={{ padding: '14px 10px' }}>{habit.targetDays}</td>
                        <td data-label="Score" style={{ padding: '14px 10px', fontWeight: 700 }}>
                          {habit.scorePercentage}% {getScoreEmoji(habit.scorePercentage)}
                        </td>
                        <td data-label="Mood" style={{ padding: '14px 10px' }}>
                          {getScoreMessage(habit.scorePercentage)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ── Advanced Analytics — additional section below existing stats ── */}
            {(() => {
              const { bestDay, worstDay, consistencyScore, weeklyInsight } = computeOverallAnalytics(habits);
              return (
                <div className="glass-card analytics-section">
                  <h3 className="analytics-section-title">Advanced Insights</h3>
                  <div className="analytics-section-grid">
                    {bestDay && (
                      <div className="analytics-section-stat">
                        <span className="analytics-section-stat-label">Best Day</span>
                        <span className="analytics-section-stat-value">📈 {bestDay}</span>
                      </div>
                    )}
                    {worstDay && worstDay !== bestDay && (
                      <div className="analytics-section-stat">
                        <span className="analytics-section-stat-label">Worst Day</span>
                        <span className="analytics-section-stat-value">📉 {worstDay}</span>
                      </div>
                    )}
                    <div className="analytics-section-stat">
                      <span className="analytics-section-stat-label">Consistency Score</span>
                      <span className="analytics-section-stat-value">{consistencyScore}%</span>
                    </div>
                  </div>
                  <p className="analytics-section-insight">{weeklyInsight}</p>
                </div>
              );
            })()}

            {/* ── Mode selector — only affects new feedback messages ── */}
            <div className="glass-card" style={{ padding: '24px', borderRadius: '24px' }}>
              <h3 style={{ marginBottom: '14px' }}>Feedback Mode</h3>
              <p className="muted" style={{ marginBottom: '14px', fontSize: '0.9rem' }}>
                Controls the tone of feedback messages when you mark habits. Existing UI text is unaffected.
              </p>
              <ModeSelector />
            </div>
          </>
        )}
      </div>
    </div>
  );
}