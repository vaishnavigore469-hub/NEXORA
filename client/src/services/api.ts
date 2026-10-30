import type { 
  AiStatusResponse, 
  CppTopic, 
  FinalInterviewReport, 
  InterviewLength, 
  InterviewSession, 
  Difficulty,
  UserProfile,
  UserStatistics,
  AuthResponse
} from '../types';

const BASE_URL = (import.meta.env.VITE_API_URL as string)?.replace(/\/$/, '') || '/api';
const TOKEN_KEY = 'nexora_auth_token';

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAuthToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

function getHeaders(extraHeaders: Record<string, string> = {}): Record<string, string> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...extraHeaders,
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

// ================= AUTHENTICATION APIs =================

export async function apiRegister(params: {
  name: string;
  email: string;
  password: string;
  targetRole?: string;
  experienceLevel?: string;
}): Promise<AuthResponse> {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  const data = await res.json();
  if (data.success && data.token) {
    setAuthToken(data.token);
  }
  return data;
}

export async function apiLogin(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (data.success && data.token) {
    setAuthToken(data.token);
  }
  return data;
}

export async function apiGetCurrentUser(): Promise<{ success: boolean; user?: UserProfile; stats?: UserStatistics }> {
  const token = getAuthToken();
  if (!token) return { success: false };

  const res = await fetch(`${BASE_URL}/auth/me`, {
    headers: getHeaders(),
  });
  if (!res.ok) {
    clearAuthToken();
    return { success: false };
  }
  return res.json();
}

export async function apiUpdateProfile(updates: {
  name?: string;
  targetRole?: string;
  experienceLevel?: string;
  bio?: string;
}): Promise<{ success: boolean; user?: UserProfile; message?: string; error?: string }> {
  const res = await fetch(`${BASE_URL}/auth/profile`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(updates),
  });
  return res.json();
}

export async function apiGetUserStats(): Promise<{ success: boolean; stats: UserStatistics }> {
  const res = await fetch(`${BASE_URL}/auth/stats`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch user stats');
  return res.json();
}

export async function apiLogout(): Promise<void> {
  try {
    await fetch(`${BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: getHeaders(),
    });
  } catch (err) {
    console.warn('Logout network error:', err);
  } finally {
    clearAuthToken();
  }
}

// ================= AI & SYSTEM SETTINGS =================

export async function fetchAiStatus(): Promise<AiStatusResponse> {
  const res = await fetch(`${BASE_URL}/settings/ai-status`);
  if (!res.ok) throw new Error('Failed to fetch AI status');
  return res.json();
}

export async function saveGeminiKey(apiKey: string): Promise<{
  success: boolean;
  message: string;
  mode?: string;
  status?: string;
  maskedKey?: string;
  error?: string;
}> {
  const res = await fetch(`${BASE_URL}/settings/gemini-key`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ apiKey }),
  });
  return res.json();
}

export async function testGeminiConnection(): Promise<{
  success: boolean;
  status: string;
  message: string;
  mode?: string;
  maskedKey?: string;
  error?: string;
}> {
  const res = await fetch(`${BASE_URL}/settings/test-connection`, {
    method: 'POST',
    headers: getHeaders(),
  });
  return res.json();
}

export async function clearGeminiKey(): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${BASE_URL}/settings/clear-key`, {
    method: 'POST',
    headers: getHeaders(),
  });
  return res.json();
}

// ================= TOPICS & SYLLABUS =================

export async function fetchTopics(): Promise<{ success: boolean; totalTopics: number; categories: string[]; topics: CppTopic[] }> {
  const res = await fetch(`${BASE_URL}/topics`);
  if (!res.ok) throw new Error('Failed to fetch topics');
  return res.json();
}

export async function fetchTopicDetails(id: string): Promise<{ topic: CppTopic; questionCount: number; sampleQuestions: any[] }> {
  const res = await fetch(`${BASE_URL}/topics/${id}`);
  if (!res.ok) throw new Error('Failed to fetch topic details');
  return res.json();
}

// ================= INTERVIEW WORKFLOW =================

export async function startInterviewSession(params: {
  topicId: string;
  difficulty: Difficulty;
  targetQuestions: InterviewLength;
}): Promise<{ success: boolean; session: InterviewSession }> {
  const res = await fetch(`${BASE_URL}/interview/start`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error('Failed to start interview session');
  return res.json();
}

export async function getInterviewSession(sessionId: string): Promise<{ success: boolean; session: InterviewSession }> {
  const res = await fetch(`${BASE_URL}/interview/${sessionId}`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error('Failed to retrieve interview session');
  return res.json();
}

export async function sendInterviewInteraction(
  sessionId: string,
  userInput: string
): Promise<{
  success: boolean;
  interaction: any;
  nextQuestion?: any;
  isFinished: boolean;
  session: InterviewSession;
  report?: FinalInterviewReport;
  advanced?: boolean;
}> {
  const res = await fetch(`${BASE_URL}/interview/${sessionId}/interact`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ userInput }),
  });
  if (!res.ok) throw new Error('Failed to send answer or clarification');
  return res.json();
}

export async function endInterviewSession(sessionId: string): Promise<{ success: boolean; session: InterviewSession; report: FinalInterviewReport }> {
  const res = await fetch(`${BASE_URL}/interview/${sessionId}/end`, {
    method: 'POST',
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error('Failed to end interview session');
  return res.json();
}

export async function getInterviewReport(sessionId: string): Promise<{ success: boolean; report: FinalInterviewReport }> {
  const res = await fetch(`${BASE_URL}/interview/${sessionId}/report`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error('Failed to get interview report');
  return res.json();
}

export async function getRecentSessions(): Promise<{ success: boolean; sessions: any[] }> {
  const res = await fetch(`${BASE_URL}/interview/history/recent`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch recent history');
  return res.json();
}

export async function getOverallStats(): Promise<{
  success: boolean;
  stats: {
    totalInterviews: number;
    averageScore: number;
    highestScore: number;
    topicsCovered: number;
  };
}> {
  const res = await fetch(`${BASE_URL}/interview/history/stats`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
}
