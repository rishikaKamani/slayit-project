import { Link } from 'react-router-dom';
import '../styles/WelcomePage.css';

export default function WelcomePage() {
  return (
    <div className="welcome-page-minimal">
      <div className="welcome-card">
        <div className="sarcasm-bubble">
          Huh. Let’s see how consistent you really are.
        </div>

        <p className="welcome-tag">WELCOME TO</p>
        <h1 className="welcome-title">Slayit</h1>

        <p className="welcome-subtext">
          Track your habits, protect your streaks, and try not to embarrass yourself tomorrow.
        </p>

        <div className="welcome-actions">
          <Link to="/signup" className="bubble-btn primary-bubble">
            Create Account
          </Link>

          <Link to="/login" className="bubble-btn secondary-bubble">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}