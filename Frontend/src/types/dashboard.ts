export interface DashboardUser {
  id: string;
  githubId: string | null;
  email: string | null;
  name: string;
  role: string;
  avatarUrl: string;
  githubLogin: string;
  provider: string;
  createdAt: string;
  updatedAt: string;
  analyzedAt: string | null;
}

export interface DashboardRepo {
  id: string;
  githubRepoId: string;
  owner: string;
  name: string;
  url: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface MatchedSignal {
  signal: string;
  score: number;
  points?: number;
  depthBonus?: number;
  weightedPoints?: number;
  strength?: number;
  occurrences?: number;
  distribution?: number;
  repo?: string;
  filePaths?: Record<string, number>;
}

export interface RoleCard {
  roleId: string;
  title: string;
  level?: string;
  suggestedLevel?: string;
  rawScore?: string;
  finalScore: number;
  confidence?: number;
  isToy?: boolean;
  rank?: number;
  matchedSignals: MatchedSignal[];
}

export interface MeApiResponse {
  success: boolean;
  user: DashboardUser;
  repos: DashboardRepo[];
}
