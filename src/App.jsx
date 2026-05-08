import { AuthProvider, useSession } from '@descope/react-sdk';
import LoginPage from './components/LoginPage';
import DashboardPage from './components/DashboardPage';

const PROJECT_ID = 'Peuc12rgnJXkhXOfCAUaYjYr5g3CkfAH';

function AppContent() {
  const { isAuthenticated, isSessionLoading } = useSession();

  if (isSessionLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-logo">M</div>
        <div className="loading-dots">
          <span /><span /><span />
        </div>
      </div>
    );
  }

  return isAuthenticated ? <DashboardPage /> : <LoginPage />;
}

export default function App() {
  return (
    <AuthProvider projectId={PROJECT_ID}>
      <AppContent />
    </AuthProvider>
  );
}
