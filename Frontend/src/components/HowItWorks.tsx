import React, { useState, useEffect } from 'react';
import {
  Link2,
  Database,
  FileText,
  FileCode2,
  Cpu,
  Binary,
  BarChart3,
  ShieldCheck,
  Award,
  ArrowDown,
  ArrowRight,
  Play,
  RotateCcw,
  CheckCircle,
  Terminal,
  Activity,
  GitBranch,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export interface PipelineStep {
  step: number;
  stepNumber: string;
  title: string;
  shortDesc: string;
  stageName: 'Ingestion' | 'Analysis' | 'Evaluation';
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>;
  sampleInput: string;
  sampleOutput: string;
  metric: string;
}

const PIPELINE_STEPS: PipelineStep[] = [
  {
    step: 1,
    stepNumber: '01',
    title: 'Submit repository URL',
    shortDesc: 'User inputs any public GitHub repo URL into the evaluation interface.',
    stageName: 'Ingestion',
    icon: Link2,
    sampleInput: 'https://github.com/org/mern-project',
    sampleOutput: 'Validated Git URI & authenticated endpoint handshake',
    metric: 'Handshake: <120ms',
  },
  {
    step: 2,
    stepNumber: '02',
    title: 'Fetch metadata',
    shortDesc: 'Gathers commit history, branch topology, contributor activity, and repo size.',
    stageName: 'Ingestion',
    icon: Database,
    sampleInput: 'GitHub REST/GraphQL endpoint query',
    sampleOutput: 'Telemetry: 142 commits, 3 contributors, 84% JS/TS',
    metric: 'Telemetry parsed',
  },
  {
    step: 3,
    stepNumber: '03',
    title: 'Scan manifest',
    shortDesc: 'Parses package.json, lockfiles, framework dependencies, and build scripts.',
    stageName: 'Ingestion',
    icon: FileText,
    sampleInput: 'package.json, yarn.lock / package-lock.json',
    sampleOutput: 'Stack: React 18, Node.js, Express, Mongoose, Tailwind',
    metric: 'Stack identified',
  },
  {
    step: 4,
    stepNumber: '04',
    title: 'Select sample files',
    shortDesc: 'Isolates high-signal modules like API routes, controllers, schemas, and state stores.',
    stageName: 'Analysis',
    icon: FileCode2,
    sampleInput: 'File tree structure (120 total files)',
    sampleOutput: '18 high-signal architectural source files extracted',
    metric: '18 files sampled',
  },
  {
    step: 5,
    stepNumber: '05',
    title: 'AST analysis',
    shortDesc: 'Generates and traverses Abstract Syntax Trees to measure cyclomatic & modular complexity.',
    stageName: 'Analysis',
    icon: Cpu,
    sampleInput: '18 JavaScript/TypeScript AST nodes',
    sampleOutput: 'AST Graph: 42 functions, nesting depth 2.4, modular ratio 0.88',
    metric: 'AST parsed',
  },
  {
    step: 6,
    stepNumber: '06',
    title: 'Extract signals',
    shortDesc: 'Identifies production patterns: JWT auth, REST endpoints, async handling, and state flows.',
    stageName: 'Analysis',
    icon: Binary,
    sampleInput: 'Syntactic expressions & control flows',
    sampleOutput: 'Signals: Auth Middleware, CRUD Schemas, Custom Hooks, Async Catchers',
    metric: '24 signals found',
  },
  {
    step: 7,
    stepNumber: '07',
    title: 'Score signals',
    shortDesc: 'Weights extracted technical patterns against industry hiring benchmarks.',
    stageName: 'Evaluation',
    icon: BarChart3,
    sampleInput: '24 weighted signal vectors',
    sampleOutput: 'Scores: Full-Stack (92/100), Backend (88/100), Frontend (85/100)',
    metric: 'Scores computed',
  },
  {
    step: 8,
    stepNumber: '08',
    title: 'Detect toy repo',
    shortDesc: 'Filters out trivial boilerplate, tutorial clones, starter kits, and forks.',
    stageName: 'Evaluation',
    icon: ShieldCheck,
    sampleInput: 'Boilerplate similarity index & custom code ratio',
    sampleOutput: 'Verdict: Authentic Production Repository (96% confidence)',
    metric: 'Verified authentic',
  },
  {
    step: 9,
    stepNumber: '09',
    title: 'Rank suitable roles',
    shortDesc: 'Generates a prioritized ranking of matching job titles and internship positions.',
    stageName: 'Evaluation',
    icon: Award,
    sampleInput: 'Final validated competency matrix',
    sampleOutput: '#1 Full Stack Engineer, #2 Backend Node.js Developer, #3 React Frontend',
    metric: '3 roles ranked',
  },
];

const STAGE_GROUPS = [
  {
    name: 'Phase 1: Ingestion & Resolution',
    badge: 'Stage 01',
    steps: PIPELINE_STEPS.slice(0, 3),
    color: '#9AA5B1',
  },
  {
    name: 'Phase 2: Deep Code Inspection',
    badge: 'Stage 02',
    steps: PIPELINE_STEPS.slice(3, 6),
    color: '#F2C14E',
  },
  {
    name: 'Phase 3: Intelligence & Role Synthesis',
    badge: 'Stage 03',
    steps: PIPELINE_STEPS.slice(6, 9),
    color: '#FFF4D6',
  },
];

export const HowItWorks: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const { isDark } = useTheme();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setActiveStep((prev) => {
          if (prev >= 9) {
            setIsPlaying(false);
            return 9;
          }
          return prev + 1;
        });
      }, 1600);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const togglePlayback = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      if (activeStep >= 9) {
        setActiveStep(1);
      }
      setIsPlaying(true);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setActiveStep(1);
  };

  const currentStepData = PIPELINE_STEPS.find((s) => s.step === activeStep) || PIPELINE_STEPS[0];
  const StepIcon = currentStepData.icon;

  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
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
            <Activity className={`w-3.5 h-3.5 ${isDark ? 'text-[#F2C14E]' : 'text-[#2A2F35]'}`} aria-hidden="true" />
            <span>Automated Analysis Engine</span>
          </div>
          <h2
            id="how-it-works-heading"
            className={`text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4 transition-colors ${
              isDark ? 'text-[#FFF4D6]' : 'text-[#2A2F35]'
            }`}
          >
            How RepoRole Analyzes Code
          </h2>
          <p className={`text-base sm:text-lg leading-relaxed transition-colors ${
            isDark ? 'text-[#9AA5B1]' : 'text-[#5B6770]'
          }`}>
            A continuous 9-step evaluation stream that converts a GitHub repository into concrete technical signals and verified career matches.
          </p>
        </div>
        
        {/* The Visual Process Flow Architecture */}
        <div className="space-y-12">
          {STAGE_GROUPS.map((stageGroup, stageIdx) => (
            <div key={stageGroup.name} className="relative">
              {/* Stage Group Header */}
              <div className="flex items-center justify-between gap-4 mb-6 pb-2 border-b border-[#5B6770]/50">
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold border ${
                      isDark
                        ? 'bg-[#F2C14E]/15 text-[#F2C14E] border-[#F2C14E]/30'
                        : 'bg-[#F2C14E] text-[#2A2F35] border-[#2A2F35]/20'
                    }`}
                  >
                    {stageGroup.badge}
                  </span>
                  <h3 className={`text-base sm:text-lg font-bold tracking-tight ${isDark ? 'text-[#FFF4D6]' : 'text-[#2A2F35]'}`}>
                    {stageGroup.name}
                  </h3>
                </div>
                <span className={`text-xs font-mono hidden sm:inline ${isDark ? 'text-[#9AA5B1]' : 'text-[#5B6770]'}`}>
                  3 Sequential Operations
                </span>
              </div>

              {/* Connected Process Flow Pipeline Nodes */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 relative">
                {stageGroup.steps.map((stepItem, itemIdx) => {
                  const Icon = stepItem.icon;
                  const isActive = stepItem.step === activeStep;
                  const isCompleted = stepItem.step < activeStep;

                  return (
                    <div key={stepItem.stepNumber} className="relative flex flex-col">
                      {/* Flow Connector Arrow for Desktop */}
                      {itemIdx < 2 && (
                        <div
                          className={`hidden md:flex absolute -right-3.5 lg:-right-4.5 top-8 z-20 items-center justify-center w-7 h-7 rounded-full border ${
                            isDark
                              ? 'bg-[#2A2F35] border-[#5B6770] text-[#F2C14E]'
                              : 'bg-[#FFF4D6] border-[#5B6770]/50 text-[#2A2F35]'
                          }`}
                          aria-hidden="true"
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      )}

                      {/* Process Node Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setIsPlaying(false);
                          setActiveStep(stepItem.step);
                        }}
                        className={`w-full h-full text-left p-5 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between focus:outline-none focus:ring-2 focus:ring-[#F2C14E] ${
                          isDark
                            ? isActive
                              ? 'bg-[#5B6770]/25 border-[#F2C14E] shadow-xl ring-1 ring-[#F2C14E]/50'
                              : isCompleted
                              ? 'bg-[#5B6770]/10 border-[#5B6770] hover:border-[#9AA5B1]'
                              : 'bg-[#5B6770]/5 border-[#5B6770]/40 opacity-80 hover:opacity-100 hover:border-[#5B6770]'
                            : isActive
                            ? 'bg-[#FFFFFF] border-[#2A2F35] shadow-xl ring-2 ring-[#F2C14E]'
                            : isCompleted
                            ? 'bg-[#FFFFFF]/80 border-[#5B6770]/40 hover:border-[#2A2F35]'
                            : 'bg-[#FFFFFF]/50 border-[#5B6770]/20 opacity-80 hover:opacity-100 hover:border-[#5B6770]/50'
                        }`}
                        aria-current={isActive ? 'step' : undefined}
                      >
                        <div>
                          {/* Node Header */}
                          <div className="flex items-center justify-between gap-2 mb-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                                  isActive
                                    ? 'bg-[#F2C14E] text-[#2A2F35] font-bold shadow-md'
                                    : isCompleted
                                    ? isDark
                                      ? 'bg-[#5B6770]/40 text-[#FFF4D6] border border-[#5B6770]'
                                      : 'bg-[#5B6770]/20 text-[#2A2F35] border border-[#5B6770]/30'
                                    : isDark
                                    ? 'bg-[#2A2F35] text-[#9AA5B1] border border-[#5B6770]/60'
                                    : 'bg-[#FFF4D6] text-[#5B6770] border border-[#5B6770]/40'
                                }`}
                              >
                                {isCompleted ? (
                                  <CheckCircle className={`w-5 h-5 ${isDark ? 'text-[#F2C14E]' : 'text-[#2A2F35]'}`} aria-hidden="true" />
                                ) : (
                                  <Icon className="w-4 h-4" aria-hidden="true" />
                                )}
                              </div>
                              <span className={`font-mono text-xs font-bold ${isDark ? 'text-[#5B6770]' : 'text-[#5B6770]'}`}>
                                STEP {stepItem.stepNumber}
                              </span>
                            </div>

                            {isActive && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-[#F2C14E] text-[#2A2F35]">
                                Active
                              </span>
                            )}
                          </div>

                          {/* Node Title & Short Description */}
                          <h4
                            className={`text-base font-bold mb-2 transition-colors ${
                              isActive
                                ? isDark ? 'text-[#F2C14E]' : 'text-[#2A2F35]'
                                : isDark ? 'text-[#FFF4D6]' : 'text-[#2A2F35]'
                            }`}
                          >
                            {stepItem.title}
                          </h4>
                          <p className={`text-xs leading-relaxed transition-colors ${
                            isDark ? 'text-[#9AA5B1]' : 'text-[#5B6770]'
                          }`}>
                            {stepItem.shortDesc}
                          </p>
                        </div>

                        {/* Node Footer Indicator */}
                        <div className="mt-4 pt-3 border-t border-[#5B6770]/30 flex items-center justify-between text-[11px] font-mono">
                          <span className={isDark ? 'text-[#9AA5B1]' : 'text-[#5B6770]'}>{stepItem.metric}</span>
                          <span className={`flex items-center gap-1 font-sans font-semibold text-xs ${isDark ? 'text-[#F2C14E]' : 'text-[#2A2F35]'}`}>
                            Inspect &rarr;
                          </span>
                        </div>
                      </button>

                      {/* Flow Connector Arrow for Mobile (between steps) */}
                      {itemIdx < 2 && (
                        <div
                          className="md:hidden flex justify-center py-2 text-[#5B6770]"
                          aria-hidden="true"
                        >
                          <ArrowDown className={`w-4 h-4 ${isDark ? 'text-[#F2C14E]' : 'text-[#2A2F35]'}`} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Inter-Stage Downward Connector */}
              {stageIdx < 2 && (
                <div className="flex items-center justify-center my-6 text-[#5B6770]" aria-hidden="true">
                  <div className="h-px bg-[#5B6770]/40 flex-1" />
                  <div
                    className={`px-4 py-1 rounded-full border text-xs font-mono flex items-center gap-2 ${
                      isDark
                        ? 'bg-[#5B6770]/20 border-[#5B6770]/50 text-[#F2C14E]'
                        : 'bg-[#5B6770]/15 border-[#5B6770]/40 text-[#2A2F35]'
                    }`}
                  >
                    <span>Flow to Next Stage</span>
                    <ArrowDown className="w-3.5 h-3.5" />
                  </div>
                  <div className="h-px bg-[#5B6770]/40 flex-1" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Final Pipeline Summary Terminal */}
        <div
          className={`mt-14 p-6 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-6 transition-colors ${
            isDark
              ? 'bg-[#5B6770]/10 border-[#5B6770]'
              : 'bg-[#FFFFFF] border-[#5B6770]/40 shadow-sm'
          }`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${
                isDark
                  ? 'bg-[#F2C14E]/20 border-[#F2C14E]/40 text-[#F2C14E]'
                  : 'bg-[#F2C14E] text-[#2A2F35]'
              }`}
            >
              <GitBranch className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h4 className={`text-base sm:text-lg font-bold mb-1 ${isDark ? 'text-[#FFF4D6]' : 'text-[#2A2F35]'}`}>
                Zero Resumes. 100% Verified Code Intelligence.
              </h4>
              <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-[#9AA5B1]' : 'text-[#5B6770]'}`}>
                From initial Git endpoint fetch to final ranked role output, each step produces transparent, verifiable technical signals.
              </p>
            </div>
          </div>

          <a
            href="#hero-heading"
            className="shrink-0 px-5 py-2.5 rounded-lg bg-[#F2C14E] text-[#2A2F35] text-xs sm:text-sm font-bold uppercase tracking-wider hover:bg-[#FFF4D6] hover:text-[#2A2F35] transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-[#F2C14E]"
          >
            Analyze A Repo Now
          </a>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

