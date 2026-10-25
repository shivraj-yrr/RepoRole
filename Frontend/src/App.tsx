import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Vision from './components/Vision';
import SupportUs from './components/SupportUs';
import SignUpModal from './components/SignUpModal';
import DashboardPage from './pages/DashboardPage';
import AnalysisPage from './pages/AnalysisPage';
import { apiUrl, logout } from './api/client';
import { RepoAnalysisData } from './types/analysis';
import { Analytics } from '@vercel/analytics/react';

function MainApp() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<RepoAnalysisData | null>(null);
  const [analysisRepo, setAnalysisRepo] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const authCheckStarted = useRef(false);
  const { isDark } = useTheme();

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((path: string) => {
    if (window.location.pathname !== path) {
      window.history.pushState(null, '', path);
    }
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (authCheckStarted.current) return;
    authCheckStarted.current = true;

    const checkAuthentication = async () => {
      try {
        const response = await fetch(apiUrl('auth/me'), {
          method: 'GET',
          credentials: 'include',
          headers: {
            Accept: 'application/json',
          },
        });

        setIsAuthenticated(response.status === 200);
      } catch (error: unknown) {
        setIsAuthenticated(false);
        console.warn('Unable to check authentication status:', error);
      }
    };

    checkAuthentication();

  }, []);

  const handleSignUpClick = () => {
    setIsSignUpModalOpen(true);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsAuthenticated(false);
      setIsSignUpModalOpen(false);
      navigate('/');
    } catch (error: unknown) {
      setNotification(error instanceof Error ? error.message : 'Logout failed.');
    }
  };

  const handleAnalyzeRepo = (url: string) => {
    setAnalysisData(null);
    setAnalysisRepo(url);
    navigate('/analysis');
  };

  // Route: /analysis
  if (currentPath === '/analysis') {
    return (
      <AnalysisPage
        onNavigateHome={() => navigate('/')}
        onNavigateDashboard={() => navigate('/dashboard')}
        initialData={analysisData}
        repoUrl={analysisRepo || undefined}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
      />
    );
  }

  // Route: /dashboard
  if (currentPath === '/dashboard') {
    return (
      <DashboardPage
        onNavigateHome={() => navigate('/')}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
        onNavigateAnalysis={(repoUrl) => {
          setAnalysisData(null);
          setAnalysisRepo(repoUrl || null);
          navigate('/analysis');
        }}
      />
    );
  }

  // Route: / (Landing Page)
  return (
    <div
      className={`min-h-screen flex flex-col font-sans selection:bg-[#F2C14E] selection:text-[#2A2F35] transition-colors duration-200 ${
        isDark
          ? 'bg-[#2A2F35] text-[#FFF4D6]'
          : 'bg-[#FFF4D6] text-[#2A2F35]'
      }`}
    >
     
      {/* Reusable Navigation Bar Component with Theme Toggle and client-side routing */}
      <Navbar
        currentPath={currentPath}
        onNavigate={navigate}
        onSignUpClick={handleSignUpClick}
        showDashboardLink={isAuthenticated}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
      />

      {/* Hero Section */}
      <Hero onAnalyze={handleAnalyzeRepo} />

      {/* Features Section */}
      <Features />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Our Vision Section */}
      <Vision />

      {/* Support Us Section */}
      <SupportUs />

      {/* Sign Up Modal Dialog */}
      <SignUpModal
        isOpen={isSignUpModalOpen}
        onClose={() => setIsSignUpModalOpen(false)}
      />

      {/* Notification toast container */}
      {notification && (
        <div
          id="signup-notification"
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-[#F2C14E] text-[#2A2F35] font-semibold text-center shadow-xl animate-in fade-in"
        >
          {notification}
        </div>
      )}
      <Analytics />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}
