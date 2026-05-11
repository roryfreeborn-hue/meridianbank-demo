import { AuthProvider, useSession, useDescope } from '@descope/react-sdk';
import LoginPage from './components/LoginPage';
import DashboardPage from './components/DashboardPage';

const PROJECT_ID = 'Peuc12rgnJXkhXOfCAUaYjYr5g3CkfAH';

function AppContent() {
  const { isAuthenticated, isSessionLoading } = useSession();
  const sdk = useDescope();

  const handleAuthSuccess = () => {
    // Force the AuthProvider to re-check the session after the flow completes
    sdk.refresh().catch(() => {});
  };

  if (isSessionLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-logo">U</div>
        <div className="loading-dots">
          <span /><span /><span />
        </div>
      </div>
    );
  }

  return isAuthenticated ? <DashboardPage /> : <LoginPage onAuthSuccess={handleAuthSuccess} />;
}

export default function App() {
  return (
    <AuthProvider projectId={PROJECT_ID}>
      <AppContent />
    </AuthProvider>
  );
}
