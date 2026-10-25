import React, { useEffect, useState, useCallback } from 'react';
import {
  ArrowLeft,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { MeApiResponse } from '../types/dashboard';
import { UserInfoCard } from '../components/dashboard/UserInfoCard';
import { ReposSection } from '../components/dashboard/ReposSection';
import { useTheme } from '../context/ThemeContext';
import Navbar from '../components/Navbar';
import { apiUrl, requestJson } from '../api/client';

interface DashboardPageProps {
  onNavigateHome: () => void;
  onNavigateAnalysis?: (repoUrl?: string) => void;
  isAuthenticated?: boolean;
  onLogout?: () => void | Promise<void>;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigateHome,
  onNavigateAnalysis,
  isAuthenticated = false,
  onLogout,
}) => {
  const { isDark } = useTheme();

  // State for /me data
  const [meData, setMeData] = useState<MeApiResponse | null>(null);
  const [isMeLoading, setIsMeLoading] = useState<boolean>(true);
  const [meError, setMeError] = useState<string | null>(null);

  // Connection source indicator
  const [isLiveConnected, setIsLiveConnected] = useState<boolean>(false);

  // Fetch /auth/me
  const fetchMe = useCallback(async () => {
    setIsMeLoading(true);
    setMeError(null);
    try {
      const json = await requestJson<MeApiResponse>('auth/me');
      if (json && (json.user || json.success)) {
        setMeData(json);
        setIsLiveConnected(true);
      } else {
        throw new Error('Invalid /me response structure');
      }
    } catch (err: unknown) {
      console.warn('Failed to fetch /auth/me:', err);
      setMeData(null);
      setIsLiveConnected(false);
      setMeError(err instanceof Error ? err.message : 'Unable to load your profile.');
    } finally {
      setIsMeLoading(false);
    }
  }, []);

  // Initial fetch on mount
  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const handleRefreshAll = () => {
    fetchMe();
  };

  const currentUser = meData?.user;
  const currentRepos = meData?.repos || [];

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
        isDark
          ? 'bg-[#2A2F35] text-[#FFF4D6]'
          : 'bg-[#FFF4D6] text-[#2A2F35]'
      }`}
    >
      {/* Navigation Bar */}
      <Navbar
        showSignUpButton={false}
        isAuthenticated={isAuthenticated}
        onLogout={onLogout}
        currentPath="/dashboard"
        onNavigate={(path) => {
          if (path === '/') onNavigateHome();
          else if (path === '/analysis') onNavigateAnalysis?.();
        }}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* Top Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#5B6770]/20">
          <div className="flex items-center gap-3">
            <button
              type="button"
              id="back-to-home-button"
              onClick={onNavigateHome}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold border transition-colors ${
                isDark
                  ? 'bg-[#1E2328] hover:bg-[#1E2328]/80 border-[#5B6770]/50 text-[#FFF4D6]'
                  : 'bg-white hover:bg-neutral-50 border-[#5B6770]/30 text-[#2A2F35]'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </button>

            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                isLiveConnected
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isLiveConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}
              />
              {isLiveConnected ? 'Live Session Connected' : 'Session Unavailable'}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5">
            {!isLiveConnected && (
              <a
                href={`${apiUrl('auth/github')}?frontendUrl=${encodeURIComponent(window.location.origin)}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold bg-[#F2C14E] text-[#2A2F35] hover:bg-[#FFF4D6] transition-colors shadow-xs"
              >
                <span>Log In with GitHub</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            <button
              type="button"
              id="refresh-dashboard-button"
              onClick={handleRefreshAll}
              disabled={isMeLoading}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold border transition-all ${
                isDark
                  ? 'bg-[#1E2328] hover:bg-[#2A2F35] border-[#5B6770]/50 text-[#FFF4D6]'
                  : 'bg-white hover:bg-neutral-100 border-[#5B6770]/30 text-[#2A2F35]'
              }`}
              title="Refresh profile and repositories"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${
                  isMeLoading ? 'animate-spin text-[#F2C14E]' : ''
                }`}
              />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* 1. USER INFO FROM /me (DELIVERED FIRST) */}
        {isMeLoading && (
          <UserInfoCard
            user={{
              id: '',
              githubId: null,
              email: null,
              name: '',
              role: '',
              avatarUrl: '',
              githubLogin: '',
              provider: '',
              createdAt: '',
              updatedAt: '',
              analyzedAt: null,
            }}
            totalRepos={0}
            isLoading
          />
        )}
        {!isMeLoading && currentUser && (
          <UserInfoCard
            user={currentUser}
            totalRepos={currentRepos.length}
          />
        )}
        {!isMeLoading && !currentUser && (
          <div role="alert" className="rounded-2xl border border-red-500/40 bg-red-950/30 p-6 text-red-200">
            {meError || 'Unable to load your authenticated profile.'}
          </div>
        )}

        {/* Repositories returned by GET /auth/me */}
        <ReposSection
          repos={currentRepos}
          isLoading={isMeLoading}
          onAnalyzeRepo={(repo) => onNavigateAnalysis?.(repo.url)}
          onNavigateAnalysis={onNavigateAnalysis}
        />
      </main>

    </div>
  );
};

export default DashboardPage;
