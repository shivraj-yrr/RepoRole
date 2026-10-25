import React from 'react';
import {
  Code2,
  FileCode2,
  ShieldCheck,
  UserCheck,
  Briefcase,
  Building2,
  Compass,
  Layers,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  icon: (isDark: boolean) => React.ReactNode;
  status: 'live' | 'upcoming';
  tag: string;
}

const CURRENT_FEATURES: FeatureItem[] = [
  {
    id: 'role-detection-mern',
    title: 'Role detection for MERN repositories',
    description:
      'Intelligently maps MongoDB, Express, React, and Node.js architectures to targeted frontend, backend, and full-stack software roles.',
    icon: (isDark) => <Code2 className={`w-6 h-6 ${isDark ? 'text-[#F2C14E]' : 'text-[#2A2F35]'}`} aria-hidden="true" />,
    status: 'live',
    tag: 'Active',
  },
  {
    id: 'ast-code-analysis',
    title: 'AST based code analysis for MERN repositories',
    description:
      'Deep abstract syntax tree parsing to evaluate algorithmic complexity, design patterns, component modularity, and clean code conventions.',
    icon: (isDark) => <FileCode2 className={`w-6 h-6 ${isDark ? 'text-[#F2C14E]' : 'text-[#2A2F35]'}`} aria-hidden="true" />,
    status: 'live',
    tag: 'Active',
  },
  {
    id: 'toy-repo-detection',
    title: 'Toy Repo detection for MERN repositories',
    description:
      'Distinguishes superficial tutorial clone repos and basic starter templates from genuine, production-grade applications.',
    icon: (isDark) => <ShieldCheck className={`w-6 h-6 ${isDark ? 'text-[#F2C14E]' : 'text-[#2A2F35]'}`} aria-hidden="true" />,
    status: 'live',
    tag: 'Active',
  },
  {
    id: 'student-dashboard',
    title: 'Personal dashboard for students',
    description:
      'Custom portfolio metrics, technical strengths breakdown, and targeted project recommendations to level up job readiness.',
    icon: (isDark) => <UserCheck className={`w-6 h-6 ${isDark ? 'text-[#F2C14E]' : 'text-[#2A2F35]'}`} aria-hidden="true" />,
    status: 'live',
    tag: 'Active',
  },
];

const UPCOMING_FEATURES: FeatureItem[] = [
  {
    id: 'recruiter-dashboard',
    title: 'Recruiter dashboard',
    description:
      'Comprehensive candidate discovery hub with verified codebase analysis, technical competency radar, and repo quality scoring.',
    icon: (isDark) => <Briefcase className={`w-6 h-6 ${isDark ? 'text-[#9AA5B1]' : 'text-[#5B6770]'}`} aria-hidden="true" />,
    status: 'upcoming',
    tag: 'Coming Soon',
  },
  {
    id: 'company-profile-management',
    title: 'Company profile management',
    description:
      'Tailored hiring pipelines, customized technical assessment rubrics, and automated role matching based on internal stack requirements.',
    icon: (isDark) => <Building2 className={`w-6 h-6 ${isDark ? 'text-[#9AA5B1]' : 'text-[#5B6770]'}`} aria-hidden="true" />,
    status: 'upcoming',
    tag: 'Coming Soon',
  },
  {
    id: 'jobs-and-internships',
    title: 'Jobs and internships',
    description:
      'Curated opportunities matched directly against real code contributions—bypassing traditional resumes for merit-first hiring.',
    icon: (isDark) => <Compass className={`w-6 h-6 ${isDark ? 'text-[#9AA5B1]' : 'text-[#5B6770]'}`} aria-hidden="true" />,
    status: 'upcoming',
    tag: 'Coming Soon',
  },
  {
    id: 'polyglot-role-detection',
    title: 'Role detection for Python, C, C++, Java repositories',
    description:
      'Expanding AST parsing and repository intelligence into systems programming, data science, backend microservices, and enterprise applications.',
    icon: (isDark) => <Layers className={`w-6 h-6 ${isDark ? 'text-[#9AA5B1]' : 'text-[#5B6770]'}`} aria-hidden="true" />,
    status: 'upcoming',
    tag: 'Coming Soon',
  },
];

export const Features: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <section
      id="features"
      aria-labelledby="features-heading"
      className={`w-full py-16 md:py-24 px-4 sm:px-6 lg:px-8 border-b transition-colors duration-200 ${
        isDark
          ? 'bg-[#2A2F35] text-[#FFF4D6] border-[#5B6770]/40'
          : 'bg-[#FFF4D6] text-[#2A2F35] border-[#5B6770]/30'
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2
            id="features-heading"
            className={`text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4 transition-colors ${
              isDark ? 'text-[#FFF4D6]' : 'text-[#2A2F35]'
            }`}
          >
            Engineered for Real Technical Signals
          </h2>
          <p className={`text-base sm:text-lg leading-relaxed transition-colors ${
            isDark ? 'text-[#9AA5B1]' : 'text-[#5B6770]'
          }`}>
            From deep AST parsing to automated skill-to-role matching, discover the core engine powering RepoRole today and what's arriving next.
          </p>
        </div>

        {/* 1. CURRENT FEATURES CATEGORY */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-8 pb-3 border-b border-[#5B6770]/40">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-lg ${
                isDark
                  ? 'bg-[#F2C14E]/20 text-[#F2C14E] border border-[#F2C14E]/40'
                  : 'bg-[#F2C14E] text-[#2A2F35] shadow-sm'
              }`}
            >
              <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h3 className={`text-xl sm:text-2xl font-bold tracking-tight ${
                isDark ? 'text-[#FFF4D6]' : 'text-[#2A2F35]'
              }`}>
                Current Features
              </h3>
              <p className={`text-xs sm:text-sm ${
                isDark ? 'text-[#9AA5B1]' : 'text-[#5B6770]'
              }`}>
                Production-ready features active in the current release
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CURRENT_FEATURES.map((feature) => (
              <article
                key={feature.id}
                id={feature.id}
                className={`group relative p-6 sm:p-8 rounded-xl border transition-all duration-300 shadow-lg hover:shadow-2xl flex flex-col justify-between ${
                  isDark
                    ? 'bg-[#5B6770]/10 border-[#5B6770] hover:border-[#F2C14E]'
                    : 'bg-[#FFFFFF] border-[#5B6770]/40 hover:border-[#2A2F35]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`p-3 rounded-lg border shadow-inner transition-colors ${
                        isDark
                          ? 'bg-[#2A2F35] border-[#5B6770]/60 group-hover:border-[#F2C14E]/60'
                          : 'bg-[#FFF4D6] border-[#5B6770]/40 group-hover:border-[#2A2F35]'
                      }`}
                    >
                      {feature.icon(isDark)}
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                        isDark
                          ? 'bg-[#F2C14E]/15 text-[#F2C14E] border border-[#F2C14E]/30'
                          : 'bg-[#F2C14E] text-[#2A2F35] border border-[#2A2F35]/20 shadow-xs'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-[#F2C14E]' : 'bg-[#2A2F35]'} animate-pulse`}></span>
                      {feature.tag}
                    </span>
                  </div>

                  <h4
                    className={`text-lg sm:text-xl font-bold mb-2 transition-colors ${
                      isDark
                        ? 'text-[#FFF4D6] group-hover:text-[#F2C14E]'
                        : 'text-[#2A2F35] group-hover:text-[#2A2F35]'
                    }`}
                  >
                    {feature.title}
                  </h4>
                  <p
                    className={`text-sm leading-relaxed transition-colors ${
                      isDark ? 'text-[#9AA5B1]' : 'text-[#5B6770]'
                    }`}
                  >
                    {feature.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* 2. UPCOMING FEATURES CATEGORY */}
        <div>
          <div className="flex items-center gap-3 mb-8 pb-3 border-b border-[#5B6770]/40">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-lg ${
                isDark
                  ? 'bg-[#5B6770]/30 text-[#9AA5B1] border border-[#5B6770]'
                  : 'bg-[#5B6770]/20 text-[#5B6770] border border-[#5B6770]/40'
              }`}
            >
              <Clock className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h3 className={`text-xl sm:text-2xl font-bold tracking-tight ${
                isDark ? 'text-[#FFF4D6]' : 'text-[#2A2F35]'
              }`}>
                Upcoming Features
              </h3>
              <p className={`text-xs sm:text-sm ${
                isDark ? 'text-[#9AA5B1]' : 'text-[#5B6770]'
              }`}>
                In active development on our engineering roadmap
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {UPCOMING_FEATURES.map((feature) => (
              <article
                key={feature.id}
                id={feature.id}
                className={`group relative p-6 sm:p-8 rounded-xl border transition-all duration-300 shadow-md flex flex-col justify-between ${
                  isDark
                    ? 'bg-[#5B6770]/5 border-[#5B6770]/50 hover:border-[#9AA5B1]'
                    : 'bg-[#FFFFFF]/70 border-[#5B6770]/30 hover:border-[#5B6770]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`p-3 rounded-lg border shadow-inner transition-colors ${
                        isDark
                          ? 'bg-[#2A2F35] border-[#5B6770]/40 group-hover:border-[#9AA5B1]/60'
                          : 'bg-[#FFF4D6] border-[#5B6770]/30 group-hover:border-[#5B6770]'
                      }`}
                    >
                      {feature.icon(isDark)}
                    </div>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        isDark
                          ? 'bg-[#5B6770]/20 text-[#9AA5B1] border border-[#5B6770]/40'
                          : 'bg-[#5B6770]/15 text-[#5B6770] border border-[#5B6770]/30'
                      }`}
                    >
                      {feature.tag}
                    </span>
                  </div>

                  <h4
                    className={`text-lg sm:text-xl font-bold mb-2 transition-colors ${
                      isDark
                        ? 'text-[#FFF4D6] group-hover:text-[#F2C14E]'
                        : 'text-[#2A2F35] group-hover:text-[#2A2F35]'
                    }`}
                  >
                    {feature.title}
                  </h4>
                  <p
                    className={`text-sm leading-relaxed transition-colors ${
                      isDark ? 'text-[#9AA5B1]' : 'text-[#5B6770]'
                    }`}
                  >
                    {feature.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;

