import { RepoAnalysisData } from '../types/analysis';

const backendApi = import.meta.env.VITE_BACKEND_API || '';

export const apiUrl = (path: string) =>
  `${backendApi}${backendApi.endsWith('/') ? '' : '/'}${
    path.startsWith('/') ? path.slice(1) : path
  }`;

export async function requestJson<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(apiUrl(path), {
    ...options,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      ...options.headers,
    },
  });

  const body = await response.text();
  let payload: unknown = null;

  if (body) {
    try {
      payload = JSON.parse(body);
    } catch {
      payload = body;
    }
  }

  if (!response.ok) {
    const message =
      typeof payload === 'object' &&
      payload !== null &&
      'message' in payload &&
      typeof payload.message === 'string'
        ? payload.message
        : `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return payload as T;
}

export function analyzeRepository(repo: string): Promise<RepoAnalysisData> {
  return requestJson<RepoAnalysisData>('analyze/roles', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ repo }),
  });
}

export async function logout(): Promise<{ success: boolean; message: string }> {
  const result = await requestJson<{ success: boolean; message: string }>('auth/logout', {
    method: 'POST',
  });

  if (!result.success) {
    throw new Error(result.message || 'Logout failed.');
  }

  return result;
}
