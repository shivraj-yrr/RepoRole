import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import Navbar from '../components/Navbar';
import { RepoAnalysisData } from '../types/analysis';
import { analyzeRepository } from '../api/client';
import { AnalysisHeader } from '../components/analysis/AnalysisHeader';
import { AnalysisOverview } from '../components/analysis/AnalysisOverview';
import { RoleScoringSection } from '../components/analysis/RoleScoringSection';
import { RoleSignalsDetail } from '../components/analysis/RoleSignalsDetail';
import { EvidenceInspector } from '../components/analysis/EvidenceInspector';
import { AstDetectorsExplorer } from '../components/analysis/AstDetectorsExplorer';
import { StructureTree } from '../components/analysis/StructureTree';
import { SelectedFilesList } from '../components/analysis/SelectedFilesList';
import { RawJsonViewer } from '../components/analysis/RawJsonViewer';
import {
  Code,
  Cpu,
  Workflow,
  FileCode,
  FileJson,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface AnalysisPageProps {
  onNavigateHome: () => void;
  onNavigateDashboard: () => void;
  initialData?: RepoAnalysisData;
  repoUrl?: string;
  isAuthenticated?: boolean;
  onLogout?: () => void | Promise<void>;
}

type TabKey = 'signals' | 'detectors' | 'architecture' | 'files' | 'json';

export const AnalysisPage: React.FC<AnalysisPageProps> = ({
  onNavigateHome,
  onNavigateDashboard,
  initialData,
  repoUrl,
  isAuthenticated = false,
  onLogout,
}) => {
  const { isDark } = useTheme();
  const [data, setData] = useState<RepoAnalysisData | null>(initialData || null);
  const [isLoading, setIsLoading] = useState(!initialData && Boolean(repoUrl));
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState<string>(
    initialData?.roles[0]?.roleId || ''
  );
  const [activeTab, setActiveTab] = useState<TabKey>('signals');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  React.useEffect(() => {
    if (initialData || !repoUrl) {
      if (!initialData && !repoUrl) {
        setErrorMessage('Choose a repository from the home page to start an analysis.');
      }
      return;
    }

    let active = true;
    setIsLoading(true);
    setErrorMessage(null);
    analyzeRepository(repoUrl)
      .then((result) => {
        if (!active) return;
        setData(result);
        setSelectedRoleId(result.roles[0]?.roleId || '');
      })
      .catch((error: unknown) => {
        if (active) {
          setErrorMessage(error instanceof Error ? error.message : 'Repository analysis failed.');
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [initialData, repoUrl]);

  const selectedRole =
    data?.roles.find((r) => r.roleId === selectedRoleId) || data?.roles[0];

  const handleRefresh = async () => {
    if (!data) return;
    setIsRefreshing(true);
    setToastMessage(`Re-running AST parser on repository "${data.repo.name}"...`);

    try {
      const result = await analyzeRepository(data.repo.url);
      setData(result);
      setSelectedRoleId(result.roles[0]?.roleId || '');
      setToastMessage(`AST analysis complete for "${data.repo.name}". All signals verified.`);
    } catch (error: unknown) {
      setErrorMessage(error instanceof Error ? error.message : 'Repository analysis failed.');
    } finally {
      setIsRefreshing(false);
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  const handleExportJson = () => {
    if (!data) return;
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.repo.name.toLowerCase()}-ast-analysis.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setToastMessage(`Exported ${data.repo.name} analysis report as JSON.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  if (!data) {
    return (
      <div
        className={`min-h-screen flex flex-col ${
          isDark ? 'bg-[#2A2F35] text-[#FFF4D6]' : 'bg-[#FFF4D6] text-[#2A2F35]'
        }`}
      >
        <Navbar
          showSignUpButton={false}
          isAuthenticated={isAuthenticated}
          onLogout={onLogout}
          currentPath="/analysis"
          onNavigate={(path) => {
            if (path === '/') onNavigateHome();
            else if (path === '/dashboard') onNavigateDashboard();
          }}
        />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="max-w-lg w-full rounded-2xl border border-[#5B6770]/40 p-8 text-center space-y-4">
            <h1 className="text-2xl font-bold">
              {isLoading ? 'Analyzing repository...' : 'Analysis unavailable'}
            </h1>
            <p className="text-sm opacity-75">
              {isLoading ? 'The backend is scanning the repository. This may take a moment.' : errorMessage}
            </p>
            {!isLoading && (
              <button
                type="button"
                onClick={onNavigateHome}
                className="rounded-xl bg-[#F2C14E] px-4 py-2 font-bold text-[#2A2F35]"
              >
                Back to Home
              </button>
            )}
          </div>
        </main>
      </div>
    );
  }

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
        currentPath="/analysis"
        onNavigate={(path) => {
          if (path === '/') onNavigateHome();
          else if (path === '/dashboard') onNavigateDashboard();
        }}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* Header & Breadcrumb */}
        <AnalysisHeader
          repo={data.repo}
          metadata={data.metadata}
          onNavigateHome={onNavigateHome}
          onNavigateDashboard={onNavigateDashboard}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          onExportJson={handleExportJson}
        />

        {/* 1. Repository & Tech Stack Snapshot */}
        <AnalysisOverview data={data} />

        {/* 2. Candidate Roles Matrix (Rank 1, 2, 3) */}
        <RoleScoringSection
          roles={data.roles}
          selectedRoleId={selectedRoleId}
          onSelectRole={(roleId) => setSelectedRoleId(roleId)}
        />

        {/* 3. Active Role Deep Dive Signals */}
        {selectedRole && <RoleSignalsDetail role={selectedRole} />}

        {/* 4. Deep Inspection Segmented Tabs */}
        <div className="space-y-4">
          <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b ${
            isDark ? 'border-slate-800' : 'border-slate-200'
          }`}>
            <div>
              <h3 className={`text-lg font-bold ${
                isDark ? 'text-[#FFF4D6]' : 'text-slate-900'
              }`}>
                Deep Code Intelligence & Evidence
              </h3>
              <p className={`text-xs mt-0.5 ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}>
                Explore AST-verified evidence call locations, detector rules, project hierarchy, and files.
              </p>
            </div>

            {/* Segmented Controls */}
            <div className={`flex items-center gap-1 p-1 rounded-xl text-xs overflow-x-auto max-w-full ${
              isDark ? 'bg-slate-900/90' : 'bg-slate-200/80'
            }`}>
              <button
                type="button"
                onClick={() => setActiveTab('signals')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap shrink-0 ${
                  activeTab === 'signals'
                    ? isDark
                      ? 'bg-[#1E2328] text-[#FFF4D6] shadow-xs border border-[#5B6770]/40'
                      : 'bg-white text-slate-900 shadow-xs border border-neutral-200'
                    : isDark
                    ? 'text-slate-300 hover:text-[#FFF4D6]'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Code className="w-3.5 h-3.5 text-[#F2C14E]" />
                <span>Code Evidence</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('detectors')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap shrink-0 ${
                  activeTab === 'detectors'
                    ? isDark
                      ? 'bg-[#1E2328] text-[#FFF4D6] shadow-xs border border-[#5B6770]/40'
                      : 'bg-white text-slate-900 shadow-xs border border-neutral-200'
                    : isDark
                    ? 'text-slate-300 hover:text-[#FFF4D6]'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Cpu className="w-3.5 h-3.5 text-[#F2C14E]" />
                <span>25 AST Detectors</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('architecture')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap shrink-0 ${
                  activeTab === 'architecture'
                    ? isDark
                      ? 'bg-[#1E2328] text-[#FFF4D6] shadow-xs border border-[#5B6770]/40'
                      : 'bg-white text-slate-900 shadow-xs border border-neutral-200'
                    : isDark
                    ? 'text-slate-300 hover:text-[#FFF4D6]'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Workflow className="w-3.5 h-3.5 text-[#F2C14E]" />
                <span>Architecture</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('files')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap shrink-0 ${
                  activeTab === 'files'
                    ? isDark
                      ? 'bg-[#1E2328] text-[#FFF4D6] shadow-xs border border-[#5B6770]/40'
                      : 'bg-white text-slate-900 shadow-xs border border-neutral-200'
                    : isDark
                    ? 'text-slate-300 hover:text-[#FFF4D6]'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileCode className="w-3.5 h-3.5 text-[#F2C14E]" />
                <span>Source Files ({data.selectedFiles.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('json')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap shrink-0 ${
                  activeTab === 'json'
                    ? isDark
                      ? 'bg-[#1E2328] text-[#FFF4D6] shadow-xs border border-[#5B6770]/40'
                      : 'bg-white text-slate-900 shadow-xs border border-neutral-200'
                    : isDark
                    ? 'text-slate-300 hover:text-[#FFF4D6]'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileJson className="w-3.5 h-3.5 text-[#F2C14E]" />
                <span>Raw JSON</span>
              </button>
            </div>
          </div>

          {/* Tab Content Display */}
          <div className="pt-2">
            {activeTab === 'signals' && (
              <EvidenceInspector roleSignals={data.roleSignals} />
            )}

            {activeTab === 'detectors' && (
              <AstDetectorsExplorer detailedSignals={data.detailedSignals} />
            )}

            {activeTab === 'architecture' && (
              <StructureTree structure={data.structure} />
            )}

            {activeTab === 'files' && (
              <SelectedFilesList files={data.selectedFiles} />
            )}

            {activeTab === 'json' && (
              <RawJsonViewer data={data} repoName={data.repo.name} />
            )}
          </div>
        </div>
      </main>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-6 right-6 z-50 max-w-md p-4 rounded-2xl shadow-2xl border flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 ${
            isDark
              ? 'bg-[#1E2328] border-[#F2C14E]/60 text-[#FFF4D6]'
              : 'bg-white border-[#F2C14E]/60 text-[#2A2F35]'
          }`}
        >
          <div className="p-1 rounded-lg bg-[#F2C14E]/20 text-[#F2C14E] shrink-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex-1 text-xs font-medium">{toastMessage}</div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-xs opacity-60 hover:opacity-100 p-1"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default AnalysisPage;
