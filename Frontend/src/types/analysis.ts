export interface RepoDetails {
  owner: string;
  name: string;
  url: string;
}

export interface AnalysisMetadata {
  isToy: boolean;
  hasReadme: boolean;
  isMonorepo: boolean;
  supported: boolean;
  fileCount: number;
  repoName: string;
}

export interface MatchedRoleSignal {
  signal: string;
  score: number;
  points: number;
  depthBonus: number;
  weightedPoints: number;
  strength: number;
  occurrences: number;
  distribution: number;
  filePaths: Record<string, number>;
}

export interface AnalysisRole {
  roleId: string;
  title: string;
  level: string;
  rawScore: string;
  finalScore: number;
  confidence: number;
  suggestedLevel: string;
  rank: number;
  isToy: boolean;
  matchedSignals: MatchedRoleSignal[];
}

export interface SignalEvidence {
  id: string;
  sourceType: string;
  filePath: string;
  line: number | null;
  column: number | null;
  strength: 'strong' | 'medium' | 'weak';
}

export interface RoleSignalGroup {
  signal: string;
  occurrences: number;
  filePaths: Record<string, number>;
  evidence: SignalEvidence[];
  strength: number;
}

export interface DetailedSignalDefinition {
  name: string;
  represents: string;
  validEvidence: string;
  weakEvidence: string;
  invalidEvidence: string;
}

export interface DetailedSignalItem {
  signal: string;
  category: string;
  definition: DetailedSignalDefinition;
  occurrences: number;
  filePaths: Record<string, number>;
  evidence: SignalEvidence[];
}

export interface RepoAnalysisData {
  repo: RepoDetails;
  languages: string[];
  runtime: string[];
  frameworks: string[];
  databases: string[];
  buildFiles: string[];
  structure: string[];
  flags: string[];
  metadata: AnalysisMetadata;
  roles: AnalysisRole[];
  roleSignals: Record<string, RoleSignalGroup>;
  detailedSignals: Record<string, DetailedSignalItem>;
  unmappedSignals: Record<string, DetailedSignalItem>;
  selectedFiles: string[];
}
