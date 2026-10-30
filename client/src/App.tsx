import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ApiKeyModal } from './components/ApiKeyModal';
import { AuthModal } from './components/AuthModal';
import { ProfileModal } from './components/ProfileModal';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { SetupPage } from './pages/SetupPage';
import { InterviewPage } from './pages/InterviewPage';
import { ReportPage } from './pages/ReportPage';
import { HistoryPage } from './pages/HistoryPage';
import { TopicsPage } from './pages/TopicsPage';
import { 
  fetchAiStatus, 
  getInterviewReport, 
  getInterviewSession, 
  apiGetCurrentUser 
} from './services/api';
import type { 
  AiStatusResponse, 
  FinalInterviewReport, 
  InterviewSession, 
  UserProfile, 
  UserStatistics 
} from './types';

export function App() {
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [aiStatus, setAiStatus] = useState<AiStatusResponse | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [userStats, setUserStats] = useState<UserStatistics | null>(null);
  const [setupInitialTopicId, setSetupInitialTopicId] = useState<string>('all');
  const [activeSession, setActiveSession] = useState<InterviewSession | null>(null);
  const [activeReport, setActiveReport] = useState<FinalInterviewReport | null>(null);

  // Load AI status and restore current user on mount
  useEffect(() => {
    async function init() {
      try {
        const res = await fetchAiStatus();
        setAiStatus(res);
      } catch (err) {
        console.warn('Could not fetch AI status:', err);
      }

      try {
        const authRes = await apiGetCurrentUser();
        if (authRes.success && authRes.user) {
          setUser(authRes.user);
          if (authRes.stats) setUserStats(authRes.stats);
        }
      } catch (err) {
        console.warn('No active user session:', err);
      }
    }
    init();
  }, []);

  // Handle URL query parameters or localStorage for session recovery
  useEffect(() => {
    async function restoreSessionIfNeeded() {
      const urlParams = new URLSearchParams(window.location.search);
      const urlSessionId = urlParams.get('session') || localStorage.getItem('nexora_active_session_id');

      if (urlSessionId) {
        try {
          const res = await getInterviewSession(urlSessionId);
          if (res.success && res.session) {
            if (res.session.status === 'completed') {
              const rep = await getInterviewReport(urlSessionId);
              if (rep.success && rep.report) {
                setActiveReport(rep.report);
                setCurrentTab('report');
                return;
              }
            } else {
              setActiveSession(res.session);
              setCurrentTab('interview');
              return;
            }
          }
        } catch (e) {
          console.warn('Could not restore session:', e);
        }
      }
    }
    restoreSessionIfNeeded();
  }, []);

  const handleStartInterviewWithTopic = (topicId = 'all') => {
    setSetupInitialTopicId(topicId);
    setCurrentTab('setup');
  };

  const handleSessionStarted = (session: InterviewSession) => {
    setActiveSession(session);
    setActiveReport(null);
    localStorage.setItem('nexora_active_session_id', session.id);
    window.history.replaceState(null, '', `?session=${session.id}`);
    setCurrentTab('interview');
  };

  const handleFinishInterview = (report: FinalInterviewReport) => {
    setActiveReport(report);
    setCurrentTab('report');
    localStorage.removeItem('nexora_active_session_id');
    window.history.replaceState(null, '', window.location.pathname);
  };

  const handleOpenPastReport = async (sessionId: string) => {
    try {
      const res = await getInterviewReport(sessionId);
      if (res.success && res.report) {
        setActiveReport(res.report);
        setCurrentTab('report');
      }
    } catch (e) {
      console.error('Error opening report:', e);
    }
  };

  const handleAuthSuccess = (authenticatedUser: UserProfile, stats?: UserStatistics) => {
    setUser(authenticatedUser);
    if (stats) setUserStats(stats);
  };

  const handleUserUpdated = (updatedUser: UserProfile) => {
    setUser(updatedUser);
  };

  const handleLogout = () => {
    setUser(null);
    setUserStats(null);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* Background radial gradient */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(56,189,248,0.1),rgba(255,255,255,0))] pointer-events-none" />

      {/* Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        aiStatus={aiStatus}
        user={user}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 relative z-10">
        {currentTab === 'landing' && (
          <LandingPage
            onStartInterview={() => handleStartInterviewWithTopic('all')}
            onExploreTopics={() => setCurrentTab('topics')}
            onGoToDashboard={() => setCurrentTab('dashboard')}
            isAiConfigured={Boolean(aiStatus?.isConfigured)}
          />
        )}

        {currentTab === 'dashboard' && (
          <DashboardPage
            onStartNewInterview={handleStartInterviewWithTopic}
            onExploreTopics={() => setCurrentTab('topics')}
            onViewHistory={() => setCurrentTab('history')}
            onOpenReport={handleOpenPastReport}
            user={user}
            onOpenAuth={() => setIsAuthOpen(true)}
            onOpenProfile={() => setIsProfileOpen(true)}
          />
        )}

        {currentTab === 'setup' && (
          <SetupPage
            initialTopicId={setupInitialTopicId}
            onSessionStarted={handleSessionStarted}
            onCancel={() => setCurrentTab('dashboard')}
          />
        )}

        {currentTab === 'interview' && activeSession && (
          <InterviewPage
            initialSession={activeSession}
            onFinishInterview={handleFinishInterview}
            onExit={() => setCurrentTab('dashboard')}
          />
        )}

        {currentTab === 'report' && activeReport && (
          <ReportPage
            report={activeReport}
            onStartAnother={() => handleStartInterviewWithTopic('all')}
            onReturnDashboard={() => setCurrentTab('dashboard')}
            onViewHistory={() => setCurrentTab('history')}
          />
        )}

        {currentTab === 'history' && (
          <HistoryPage
            onOpenReport={handleOpenPastReport}
            onStartNewInterview={handleStartInterviewWithTopic}
            user={user}
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        )}

        {currentTab === 'topics' && (
          <TopicsPage
            onSelectTopicForInterview={handleStartInterviewWithTopic}
          />
        )}
      </main>

      {/* Footer (hidden on active interview screen for clean fullscreen focus) */}
      {currentTab !== 'interview' && (
        <Footer setCurrentTab={setCurrentTab} />
      )}

      {/* AI Key / Engine Modal */}
      <ApiKeyModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        aiStatus={aiStatus}
        onStatusUpdated={(newStatus) => setAiStatus(newStatus)}
      />

      {/* Auth Modal (Sign In / Register) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Candidate Profile & Stats Modal */}
      {user && (
        <ProfileModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          user={user}
          onUserUpdated={handleUserUpdated}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}

export default App;
