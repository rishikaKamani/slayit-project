import { Navigate, Route, Routes } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import AddHabitPage from './pages/AddHabitPage';
import PerformancePage from './pages/PerformancePage';
import HistoryPage from './pages/HistoryPage';
import CoachPage from './pages/CoachPage';
import BadgePage from './pages/BadgePage';
import InstallPage from './pages/InstallPage';
import ProtectedRoute from './components/ProtectedRoute';
import InstallBanner from './pwa/InstallBanner';

export default function App() {
  return (
    <>
      <InstallBanner />
      <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/add-habit"
        element={
          <ProtectedRoute>
            <AddHabitPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/performance"
        element={
          <ProtectedRoute>
            <PerformancePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <HistoryPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/coach"
        element={
          <ProtectedRoute>
            <CoachPage />
          </ProtectedRoute>
        }
      />

      <Route path="/badge" element={<BadgePage />} />
      <Route path="/install" element={<InstallPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}