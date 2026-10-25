import React from 'react';
import {
  Code,
  Sparkles,
  Briefcase,
  TrendingUp,
  ArrowRight,
  Eye,
  CheckCircle2,
  Users,
  Compass,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const Vision: React.FC = () => {
  const { isDark } = useTheme();

  const pipelineStages = [
    {
      label: 'Code',
      description: 'Authentic project repositories',
      icon: Code,
    },
    {
      label: 'Skills',
      description: 'Extracted AST & technical signals',
      icon: Sparkles,
    },
    {
      label: 'Roles',
      description: 'Accurate competency matching',
      icon: Briefcase,
    },
    {
      label: 'Opportunities',
      description: 'Merit-first career pathways',
      icon: TrendingUp,
    },
  ];

  return (
    <section
      id="vision"
      aria-labelledby="vision-heading"
      className={`w-full py-16 md:py-24 px-4 sm:px-6 lg:px-8 border-b transition-colors duration-200 ${
        isDark
          ? 'bg-[#2A2F35] text-[#FFF4D6] border-[#5B6770]/40'
          : 'bg-[#FFF4D6] text-[#2A2F35] border-[#5B6770]/30'
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 md:mb-18">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider mb-4 border ${
              isDark
                ? 'bg-[#5B6770]/20 border-[#5B6770]/40 text-[#F2C14E]'
                : 'bg-[#F2C14E]/20 border-[#5B6770]/30 text-[#2A2F35]'
            }`}
          >
            <Eye className={`w-3.5 h-3.5 ${isDark ? 'text-[#F2C14E]' : 'text-[#2A2F35]'}`} aria-hidden="true" />
            <span>Our Vision</span>
          </div>

          <h2
            id="vision-heading"
            className={`text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-6 transition-colors ${
              isDark ? 'text-[#FFF4D6]' : 'text-[#2A2F35]'
            }`}
          >
            Turning Code Into Career Opportunities
          </h2>

          <p
            className={`text-base sm:text-lg md:text-xl leading-relaxed transition-colors ${
              isDark ? 'text-[#FFF4D6]/90' : 'text-[#2A2F35]/90'
            }`}
          >
            Your GitHub repositories are more than collections of code. They contain evidence of the technologies you use, the problems you solve, and the way you build software.
          </p>
        </div>

        {/* Mission Statement Focus Banner */}
        <div
          className={`p-6 sm:p-8 md:p-10 rounded-2xl border transition-all duration-200 mb-14 shadow-lg ${
            isDark
              ? 'bg-[#5B6770]/15 border-[#F2C14E]/60'
              : 'bg-[#FFFFFF] border-[#5B6770]/40'
          }`}
        >
          <div className="max-w-4xl mx-auto text-center">
            <span
              className={`text-xs font-mono font-bold uppercase tracking-widest block mb-3 ${
                isDark ? 'text-[#F2C14E]' : 'text-[#2A2F35]'
              }`}
            >
              Core Mission
            </span>
            <p
              className={`text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight leading-snug ${
                isDark ? 'text-[#FFF4D6]' : 'text-[#2A2F35]'
              }`}
            >
              RepoRole's vision is to make that technical evidence more useful.
            </p>
          </div>
        </div>

        {/* Dual Pillar Focus: Developers & Recruiters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-16">
          {/* For Developers */}
          <article
            className={`p-6 sm:p-8 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
              isDark
                ? 'bg-[#5B6770]/10 border-[#5B6770] hover:border-[#F2C14E]'
                : 'bg-[#FFFFFF] border-[#5B6770]/40 hover:border-[#2A2F35]'
            }`}
          >
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                    isDark
                      ? 'bg-[#F2C14E]/20 text-[#F2C14E] border border-[#F2C14E]/40'
                      : 'bg-[#F2C14E] text-[#2A2F35]'
                  }`}
                >
                  <Compass className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <span className={`text-xs font-mono uppercase tracking-wider block ${isDark ? 'text-[#9AA5B1]' : 'text-[#5B6770]'}`}>
                    Empowering Talent
                  </span>
                  <h3 className={`text-lg sm:text-xl font-bold ${isDark ? 'text-[#FFF4D6]' : 'text-[#2A2F35]'}`}>
                    For Developers
                  </h3>
                </div>
              </div>

              <p className={`text-sm sm:text-base leading-relaxed mb-6 ${isDark ? 'text-[#9AA5B1]' : 'text-[#5B6770]'}`}>
                We want to help developers understand their practical skills, discover software development roles that align with their work, and identify opportunities to grow.
              </p>
            </div>

            <div
              className={`p-4 rounded-xl border flex items-center gap-3 ${
                isDark
                  ? 'bg-[#2A2F35] border-[#5B6770]/50 text-[#FFF4D6]'
                  : 'bg-[#FFF4D6]/70 border-[#5B6770]/30 text-[#2A2F35]'
              }`}
            >
              <CheckCircle2 className={`w-4 h-4 shrink-0 ${isDark ? 'text-[#F2C14E]' : 'text-[#2A2F35]'}`} aria-hidden="true" />
              <span className="text-xs sm:text-sm font-medium">
                Verified skill profiles derived directly from source code
              </span>
            </div>
          </article>

          {/* For Recruiters */}
          <article
            className={`p-6 sm:p-8 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
              isDark
                ? 'bg-[#5B6770]/10 border-[#5B6770] hover:border-[#F2C14E]'
                : 'bg-[#FFFFFF] border-[#5B6770]/40 hover:border-[#2A2F35]'
            }`}
          >
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                    isDark
                      ? 'bg-[#F2C14E]/20 text-[#F2C14E] border border-[#F2C14E]/40'
                      : 'bg-[#F2C14E] text-[#2A2F35]'
                  }`}
                >
                  <Users className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <span className={`text-xs font-mono uppercase tracking-wider block ${isDark ? 'text-[#9AA5B1]' : 'text-[#5B6770]'}`}>
                    Evidence-Based Hiring
                  </span>
                  <h3 className={`text-lg sm:text-xl font-bold ${isDark ? 'text-[#FFF4D6]' : 'text-[#2A2F35]'}`}>
                    For Recruiters
                  </h3>
                </div>
              </div>

              <p className={`text-sm sm:text-base leading-relaxed mb-6 ${isDark ? 'text-[#9AA5B1]' : 'text-[#5B6770]'}`}>
                At the same time, we want to help recruiters move beyond resumes and discover technical talent through real project evidence.
              </p>
            </div>

            <div
              className={`p-4 rounded-xl border flex items-center gap-3 ${
                isDark
                  ? 'bg-[#2A2F35] border-[#5B6770]/50 text-[#FFF4D6]'
                  : 'bg-[#FFF4D6]/70 border-[#5B6770]/30 text-[#2A2F35]'
              }`}
            >
              <CheckCircle2 className={`w-4 h-4 shrink-0 ${isDark ? 'text-[#F2C14E]' : 'text-[#2A2F35]'}`} aria-hidden="true" />
              <span className="text-xs sm:text-sm font-medium">
                Eliminate hiring bias with objective architectural signals
              </span>
            </div>
          </article>
        </div>

        {/* Long-Term Goal: The Natural Progression Pipeline */}
        <div
          className={`p-6 sm:p-8 md:p-10 rounded-2xl border transition-all duration-200 ${
            isDark
              ? 'bg-[#5B6770]/10 border-[#5B6770]'
              : 'bg-[#FFFFFF] border-[#5B6770]/40 shadow-sm'
          }`}
        >
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span
              className={`text-xs font-mono font-bold uppercase tracking-widest block mb-2 ${
                isDark ? 'text-[#F2C14E]' : 'text-[#2A2F35]'
              }`}
            >
              The Pathway
            </span>
            <h3
              className={`text-xl sm:text-2xl font-bold tracking-tight ${
                isDark ? 'text-[#FFF4D6]' : 'text-[#2A2F35]'
              }`}
            >
              Our long-term goal is to build a platform where:
            </h3>
          </div>

          {/* Connected Process Flow Pathway */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-3 items-center mb-8">
            {pipelineStages.map((stage, index) => {
              const IconComponent = stage.icon;
              return (
                <div key={stage.label} className="relative flex flex-col items-center text-center">
                  <div
                    className={`w-full p-5 rounded-xl border transition-all duration-200 flex flex-col items-center ${
                      isDark
                        ? 'bg-[#2A2F35] border-[#5B6770]/70 hover:border-[#F2C14E]'
                        : 'bg-[#FFF4D6] border-[#5B6770]/30 hover:border-[#2A2F35]'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 font-bold ${
                        isDark
                          ? 'bg-[#F2C14E] text-[#2A2F35]'
                          : 'bg-[#2A2F35] text-[#FFF4D6]'
                      }`}
                    >
                      <IconComponent className="w-5 h-5" aria-hidden="true" />
                    </div>

                    <span className={`text-base sm:text-lg font-extrabold mb-1 ${isDark ? 'text-[#FFF4D6]' : 'text-[#2A2F35]'}`}>
                      {stage.label}
                    </span>
                    <span className={`text-xs ${isDark ? 'text-[#9AA5B1]' : 'text-[#5B6770]'}`}>
                      {stage.description}
                    </span>
                  </div>

                  {/* Desktop / Large Arrow */}
                  {index < pipelineStages.length - 1 && (
                    <div
                      className="hidden lg:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full items-center justify-center border bg-[#2A2F35] border-[#5B6770] text-[#F2C14E] shadow-sm pointer-events-none"
                      aria-hidden="true"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <p
            className={`text-center text-base sm:text-lg font-semibold max-w-xl mx-auto leading-relaxed ${
              isDark ? 'text-[#F2C14E]' : 'text-[#2A2F35]'
            }`}
          >
            becomes a natural path from building software to building a career.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Vision;
