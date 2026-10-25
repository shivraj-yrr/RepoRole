import React, { useState } from 'react';
import {
  Heart,
  GitPullRequest,
  MessageSquareHeart,
  Coins,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  Bug,
  Terminal,
  Layers,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const SupportUs: React.FC = () => {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<'all' | 'code' | 'feedback' | 'fund'>('all');

  const supportWays = [
    {
      id: 'code',
      title: 'Contribute Code',
      badge: 'Open Source',
      subtitle: 'Build parser rules, AST analyzers, and platform features',
      icon: GitPullRequest,
      accentColor: '#F2C14E',
      description:
        'RepoRole is powered by AST (Abstract Syntax Tree) heuristics and open-source parser rules. Help us expand tech stack detection, refine architectural signals, and optimize repository scanning.',
      keyContributions: [
        'Add AST syntax visitors for new frameworks & libraries (Next.js, FastAPI, Django)',
        'Enhance role classification algorithms and competency scoring matrices',
        'Improve repository analysis throughput and edge-case error recovery',
        'Refine UI components, accessibility, and dark/light mode performance',
      ],
      actionLabel: 'Contribute on GitHub',
      actionUrl: 'https://github.com/reporole/reporole',
      secondaryTag: 'Good First Issues Available',
    },
    {
      id: 'feedback',
      title: 'Share Feedback & Reviews',
      badge: 'Community Voice',
      subtitle: 'Test your repositories and help refine role accuracy',
      icon: MessageSquareHeart,
      accentColor: '#F2C14E',
      description:
        'Real-world codebases come in every architecture and pattern. Run your GitHub repositories through RepoRole, let us know how accurate your role predictions are, and suggest new engineering capabilities.',
      keyContributions: [
        'Analyze your personal or team repositories and validate role matches',
        'Report parser false positives or missed architectural patterns',
        'Request new role classifications (DevOps, Data Platform, Security)',
        'Participate in RFC discussions and product roadmap prioritization',
      ],
      actionLabel: 'Submit Feedback & Issues',
      actionUrl: 'https://github.com/reporole/reporole/issues',
      secondaryTag: 'RFCs & Discussions Open',
    },
    {
      id: 'fund',
      title: 'Fund & Sponsor',
      badge: 'Sponsorship',
      subtitle: 'Sustain server compute, AST infrastructure, and open access',
      icon: Coins,
      accentColor: '#F2C14E',
      description:
        'Your financial backing keeps RepoRole 100% free and accessible for developers and students worldwide. Funds directly cover container compute costs, serverless AST indexing pipelines, and domain hosting.',
      keyContributions: [
        'Sponsor high-speed cloud infrastructure for real-time repository parsing',
        'Keep the platform free for students and junior developers globally',
        'Fund dedicated research into multilingual AST parsing and security analysis',
        'Enable open dataset curation for transparent role-matching benchmarks',
      ],
      actionLabel: 'Sponsor via GitHub Sponsors',
      actionUrl: 'https://github.com/sponsors/reporole',
      secondaryTag: 'Transparent Fund Allocation',
    },
  ];

  const filteredWays =
    activeTab === 'all'
      ? supportWays
      : supportWays.filter((way) => way.id === activeTab);

  return (
    <section
      id="support-us"
      aria-labelledby="support-us-heading"
      className={`w-full py-16 md:py-24 px-4 sm:px-6 lg:px-8 border-b transition-colors duration-200 ${
        isDark
          ? 'bg-[#2A2F35] text-[#FFF4D6] border-[#5B6770]/40'
          : 'bg-[#FFF4D6] text-[#2A2F35] border-[#5B6770]/30'
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider mb-4 border ${
              isDark
                ? 'bg-[#5B6770]/20 border-[#5B6770]/40 text-[#F2C14E]'
                : 'bg-[#F2C14E]/20 border-[#5B6770]/30 text-[#2A2F35]'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isDark ? 'text-[#F2C14E]' : 'text-[#2A2F35]'}`} aria-hidden="true" />
            <span>Community & Ecosystem</span>
          </div>

          <h2
            id="support-us-heading"
            className={`text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-6 transition-colors ${
              isDark ? 'text-[#FFF4D6]' : 'text-[#2A2F35]'
            }`}
          >
            Support RepoRole
          </h2>

          <p
            className={`text-base sm:text-lg md:text-xl leading-relaxed transition-colors ${
              isDark ? 'text-[#FFF4D6]/90' : 'text-[#2A2F35]/90'
            }`}
          >
            RepoRole is an open-source initiative designed to transform authentic GitHub code evidence into clear developer roles and career opportunities. Explore how you can contribute by code, by feedback, and by funding.
          </p>
        </div>

        {/* Filter / Quick Jump Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-mono font-semibold transition-all border ${
              activeTab === 'all'
                ? isDark
                  ? 'bg-[#F2C14E] text-[#2A2F35] border-[#F2C14E]'
                  : 'bg-[#2A2F35] text-[#FFF4D6] border-[#2A2F35]'
                : isDark
                ? 'bg-[#5B6770]/20 text-[#FFF4D6] border-[#5B6770]/40 hover:border-[#F2C14E]'
                : 'bg-[#FFFFFF] text-[#2A2F35] border-[#5B6770]/30 hover:border-[#2A2F35]'
            }`}
          >
            All Ways to Support
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs sm:text-sm font-mono font-semibold transition-all border ${
              activeTab === 'code'
                ? isDark
                  ? 'bg-[#F2C14E] text-[#2A2F35] border-[#F2C14E]'
                  : 'bg-[#2A2F35] text-[#FFF4D6] border-[#2A2F35]'
                : isDark
                ? 'bg-[#5B6770]/20 text-[#FFF4D6] border-[#5B6770]/40 hover:border-[#F2C14E]'
                : 'bg-[#FFFFFF] text-[#2A2F35] border-[#5B6770]/30 hover:border-[#2A2F35]'
            }`}
          >
            <GitPullRequest className="w-3.5 h-3.5" aria-hidden="true" />
            <span>By Code</span>
          </button>
          <button
            onClick={() => setActiveTab('feedback')}
            className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs sm:text-sm font-mono font-semibold transition-all border ${
              activeTab === 'feedback'
                ? isDark
                  ? 'bg-[#F2C14E] text-[#2A2F35] border-[#F2C14E]'
                  : 'bg-[#2A2F35] text-[#FFF4D6] border-[#2A2F35]'
                : isDark
                ? 'bg-[#5B6770]/20 text-[#FFF4D6] border-[#5B6770]/40 hover:border-[#F2C14E]'
                : 'bg-[#FFFFFF] text-[#2A2F35] border-[#5B6770]/30 hover:border-[#2A2F35]'
            }`}
          >
            <MessageSquareHeart className="w-3.5 h-3.5" aria-hidden="true" />
            <span>By Feedback</span>
          </button>
          <button
            onClick={() => setActiveTab('fund')}
            className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs sm:text-sm font-mono font-semibold transition-all border ${
              activeTab === 'fund'
                ? isDark
                  ? 'bg-[#F2C14E] text-[#2A2F35] border-[#F2C14E]'
                  : 'bg-[#2A2F35] text-[#FFF4D6] border-[#2A2F35]'
                : isDark
                ? 'bg-[#5B6770]/20 text-[#FFF4D6] border-[#5B6770]/40 hover:border-[#F2C14E]'
                : 'bg-[#FFFFFF] text-[#2A2F35] border-[#5B6770]/30 hover:border-[#2A2F35]'
            }`}
          >
            <Coins className="w-3.5 h-3.5" aria-hidden="true" />
            <span>By Fund</span>
          </button>
        </div>

        {/* 3 Main Pillars / Subsections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-14">
          {filteredWays.map((way) => {
            const IconComponent = way.icon;
            return (
              <article
                key={way.id}
                id={`support-${way.id}`}
                className={`p-6 sm:p-8 rounded-2xl border transition-all duration-200 flex flex-col justify-between hover:shadow-lg ${
                  isDark
                    ? 'bg-[#5B6770]/10 border-[#5B6770] hover:border-[#F2C14E]'
                    : 'bg-[#FFFFFF] border-[#5B6770]/40 hover:border-[#2A2F35]'
                }`}
              >
                <div>
                  {/* Subsection Header */}
                  <div className="flex items-start justify-between gap-3 mb-5">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${
                        isDark
                          ? 'bg-[#F2C14E]/20 text-[#F2C14E] border border-[#F2C14E]/40'
                          : 'bg-[#F2C14E] text-[#2A2F35]'
                      }`}
                    >
                      <IconComponent className="w-6 h-6" aria-hidden="true" />
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-md text-xs font-mono font-semibold uppercase tracking-wider border ${
                        isDark
                          ? 'bg-[#2A2F35] border-[#5B6770] text-[#F2C14E]'
                          : 'bg-[#FFF4D6] border-[#5B6770]/30 text-[#2A2F35]'
                      }`}
                    >
                      {way.badge}
                    </span>
                  </div>

                  <h3
                    className={`text-xl sm:text-2xl font-bold tracking-tight mb-2 ${
                      isDark ? 'text-[#FFF4D6]' : 'text-[#2A2F35]'
                    }`}
                  >
                    {way.title}
                  </h3>

                  <p
                    className={`text-xs sm:text-sm font-medium mb-4 ${
                      isDark ? 'text-[#F2C14E]' : 'text-[#5B6770]'
                    }`}
                  >
                    {way.subtitle}
                  </p>

                  <p
                    className={`text-sm leading-relaxed mb-6 ${
                      isDark ? 'text-[#9AA5B1]' : 'text-[#5B6770]'
                    }`}
                  >
                    {way.description}
                  </p>

                  {/* Bulleted Key Focus Points */}
                  <div className="mb-6 space-y-2.5">
                    <span
                      className={`text-xs font-mono uppercase tracking-wider block font-bold ${
                        isDark ? 'text-[#FFF4D6]' : 'text-[#2A2F35]'
                      }`}
                    >
                      How you can help:
                    </span>
                    <ul className="space-y-2">
                      {way.keyContributions.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm">
                          <CheckCircle2
                            className={`w-4 h-4 shrink-0 mt-0.5 ${
                              isDark ? 'text-[#F2C14E]' : 'text-[#2A2F35]'
                            }`}
                            aria-hidden="true"
                          />
                          <span className={isDark ? 'text-[#FFF4D6]/90' : 'text-[#2A2F35]/90'}>
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer Action & Secondary Meta */}
                <div
                  className={`pt-5 border-t mt-4 ${
                    isDark ? 'border-[#5B6770]/40' : 'border-[#5B6770]/20'
                  }`}
                >
                  <a
                    href={way.actionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors border shadow-sm ${
                      isDark
                        ? 'bg-[#2A2F35] border-[#5B6770] hover:border-[#F2C14E] text-[#FFF4D6] hover:text-[#F2C14E]'
                        : 'bg-[#2A2F35] border-[#2A2F35] hover:bg-[#5B6770] text-[#FFF4D6]'
                    }`}
                  >
                    <span>{way.actionLabel}</span>
                    <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                  </a>

                  <div className="flex items-center justify-center gap-1.5 mt-3 text-center">
                    <Sparkles className={`w-3 h-3 ${isDark ? 'text-[#F2C14E]' : 'text-[#5B6770]'}`} aria-hidden="true" />
                    <span className={`text-xs font-mono ${isDark ? 'text-[#9AA5B1]' : 'text-[#5B6770]'}`}>
                      {way.secondaryTag}
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Community Stewardship & Transparency Banner */}
        <div
          className={`p-6 sm:p-8 rounded-2xl border transition-all duration-200 ${
            isDark
              ? 'bg-[#5B6770]/15 border-[#F2C14E]/60'
              : 'bg-[#FFFFFF] border-[#5B6770]/40 shadow-sm'
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold ${
                  isDark ? 'bg-[#F2C14E] text-[#2A2F35]' : 'bg-[#2A2F35] text-[#FFF4D6]'
                }`}
              >
                <Terminal className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <h4 className={`text-sm font-bold ${isDark ? 'text-[#FFF4D6]' : 'text-[#2A2F35]'}`}>
                  100% Open Source
                </h4>
                <p className={`text-xs ${isDark ? 'text-[#9AA5B1]' : 'text-[#5B6770]'}`}>
                  MIT Licensed analyzer core & open taxonomy.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold ${
                  isDark ? 'bg-[#F2C14E] text-[#2A2F35]' : 'bg-[#2A2F35] text-[#FFF4D6]'
                }`}
              >
                <Layers className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <h4 className={`text-sm font-bold ${isDark ? 'text-[#FFF4D6]' : 'text-[#2A2F35]'}`}>
                  Community Driven
                </h4>
                <p className={`text-xs ${isDark ? 'text-[#9AA5B1]' : 'text-[#5B6770]'}`}>
                  Shaped by developers, for developers.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold ${
                  isDark ? 'bg-[#F2C14E] text-[#2A2F35]' : 'bg-[#2A2F35] text-[#FFF4D6]'
                }`}
              >
                <HelpCircle className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <h4 className={`text-sm font-bold ${isDark ? 'text-[#FFF4D6]' : 'text-[#2A2F35]'}`}>
                  Need Guidance?
                </h4>
                <p className={`text-xs ${isDark ? 'text-[#9AA5B1]' : 'text-[#5B6770]'}`}>
                  Read our CONTRIBUTING.md guide on GitHub.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SupportUs;
