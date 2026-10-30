import { randomBytes, scryptSync, timingSafeEqual, randomUUID } from 'crypto';
import { db } from '../database/db.js';

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  salt: string;
  target_role: string;
  experience_level: string;
  bio: string;
  avatar_seed: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  targetRole: string;
  experienceLevel: string;
  bio: string;
  avatarSeed: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserStatistics {
  totalInterviews: number;
  averageScore: number;
  highestScore: number;
  topicsCovered: number;
  readinessRating: string;
  topStrengths: string[];
}

function hashPassword(password: string, salt: string): string {
  return scryptSync(password, salt, 64).toString('hex');
}

function verifyPassword(password: string, salt: string, expectedHash: string): boolean {
  const actualHash = hashPassword(password, salt);
  const expectedBuf = Buffer.from(expectedHash, 'hex');
  const actualBuf = Buffer.from(actualHash, 'hex');
  if (expectedBuf.length !== actualBuf.length) return false;
  return timingSafeEqual(expectedBuf, actualBuf);
}

function sanitizeUser(row: any): UserProfile {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    targetRole: row.target_role || 'C++ Software Engineer',
    experienceLevel: row.experience_level || 'Intermediate',
    bio: row.bio || '',
    avatarSeed: row.avatar_seed || row.name.slice(0, 2).toUpperCase(),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Register a new user account
 */
export function registerUser(params: {
  name: string;
  email: string;
  password: string;
  targetRole?: string;
  experienceLevel?: string;
}): { user: UserProfile; token: string } {
  const name = params.name.trim();
  const email = params.email.trim().toLowerCase();
  const password = params.password;

  if (!name || name.length < 2) {
    throw new Error('Name must be at least 2 characters.');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    throw new Error('Please provide a valid email address.');
  }

  if (!password || password.length < 6) {
    throw new Error('Password must be at least 6 characters long.');
  }

  // Check existing user
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) {
    throw new Error('An account with this email address already exists. Please sign in instead.');
  }

  const userId = randomUUID();
  const salt = randomBytes(16).toString('hex');
  const passwordHash = hashPassword(password, salt);
  const now = new Date().toISOString();
  const targetRole = params.targetRole?.trim() || 'C++ Software Engineer';
  const experienceLevel = params.experienceLevel || 'Intermediate';
  const avatarSeed = name.slice(0, 2).toUpperCase();

  db.prepare(`
    INSERT INTO users (
      id, name, email, password_hash, salt, target_role, experience_level, bio, avatar_seed, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, '', ?, ?, ?)
  `).run(userId, name, email, passwordHash, salt, targetRole, experienceLevel, avatarSeed, now, now);

  const token = createAuthToken(userId);
  const user = getUserById(userId)!;

  return { user, token };
}

/**
 * Log in an existing user
 */
export function loginUser(email: string, password: string): { user: UserProfile; token: string } {
  const cleanEmail = email.trim().toLowerCase();
  const row = db.prepare('SELECT * FROM users WHERE email = ?').get(cleanEmail) as UserRecord | undefined;

  if (!row) {
    throw new Error('Invalid email or password.');
  }

  const isMatch = verifyPassword(password, row.salt, row.password_hash);
  if (!isMatch) {
    throw new Error('Invalid email or password.');
  }

  const token = createAuthToken(row.id);
  return { user: sanitizeUser(row), token };
}

/**
 * Create an active auth token (expires in 30 days)
 */
export function createAuthToken(userId: string): string {
  const token = randomBytes(32).toString('hex');
  const now = new Date();
  const expires = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days

  db.prepare(`
    INSERT INTO auth_tokens (token, user_id, created_at, expires_at)
    VALUES (?, ?, ?, ?)
  `).run(token, userId, now.toISOString(), expires.toISOString());

  return token;
}

/**
 * Verify a token and return the associated UserProfile
 */
export function verifyAuthToken(token: string): UserProfile | null {
  if (!token || typeof token !== 'string') return null;

  const row = db.prepare(`
    SELECT u.* FROM auth_tokens a
    JOIN users u ON a.user_id = u.id
    WHERE a.token = ? AND a.expires_at > ?
  `).get(token, new Date().toISOString()) as UserRecord | undefined;

  if (!row) return null;
  return sanitizeUser(row);
}

/**
 * Invalidate a token on logout
 */
export function deleteAuthToken(token: string): void {
  db.prepare('DELETE FROM auth_tokens WHERE token = ?').run(token);
}

/**
 * Fetch user by ID
 */
export function getUserById(userId: string): UserProfile | null {
  const row = db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as UserRecord | undefined;
  if (!row) return null;
  return sanitizeUser(row);
}

/**
 * Update user profile
 */
export function updateUserProfile(
  userId: string,
  updates: {
    name?: string;
    targetRole?: string;
    experienceLevel?: string;
    bio?: string;
  }
): UserProfile {
  const existing = getUserById(userId);
  if (!existing) {
    throw new Error('User not found.');
  }

  const name = updates.name !== undefined ? updates.name.trim() : existing.name;
  const targetRole = updates.targetRole !== undefined ? updates.targetRole.trim() : existing.targetRole;
  const experienceLevel = updates.experienceLevel || existing.experienceLevel;
  const bio = updates.bio !== undefined ? updates.bio.trim() : existing.bio;
  const avatarSeed = name.slice(0, 2).toUpperCase();
  const now = new Date().toISOString();

  db.prepare(`
    UPDATE users
    SET name = ?, target_role = ?, experience_level = ?, bio = ?, avatar_seed = ?, updated_at = ?
    WHERE id = ?
  `).run(name, targetRole, experienceLevel, bio, avatarSeed, now, userId);

  return getUserById(userId)!;
}

/**
 * Calculate user-specific technical interview statistics
 */
export function getUserStatistics(userId: string): UserStatistics {
  const sessions = db.prepare(`
    SELECT final_score, topic_title, report_json, status
    FROM sessions
    WHERE user_id = ? AND status = 'completed'
  `).all(userId) as { final_score: number | null; topic_title: string; report_json: string | null }[];

  const totalInterviews = sessions.length;
  if (totalInterviews === 0) {
    return {
      totalInterviews: 0,
      averageScore: 0,
      highestScore: 0,
      topicsCovered: 0,
      readinessRating: 'Not Started',
      topStrengths: ['Begin technical interview practice to unlock insights']
    };
  }

  const scores = sessions.map(s => Number(s.final_score) || 0);
  const averageScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  const highestScore = Math.round(Math.max(...scores));
  const distinctTopics = new Set(sessions.map(s => s.topic_title)).size;

  let readinessRating = 'Emerging';
  if (averageScore >= 85) readinessRating = 'Interview Ready (Senior)';
  else if (averageScore >= 70) readinessRating = 'Strong Candidate (Mid-Level)';
  else if (averageScore >= 50) readinessRating = 'Progressing (Junior/Associate)';

  // Collect strengths from completed reports
  const allStrengths: string[] = [];
  for (const s of sessions) {
    if (s.report_json) {
      try {
        const report = JSON.parse(s.report_json);
        if (Array.isArray(report.strengths)) {
          allStrengths.push(...report.strengths);
        }
      } catch {}
    }
  }

  const topStrengths = Array.from(new Set(allStrengths)).slice(0, 4);
  if (topStrengths.length === 0) {
    topStrengths.push('Actively taking mock C++ interviews and building technical breadth.');
  }

  return {
    totalInterviews,
    averageScore,
    highestScore,
    topicsCovered: distinctTopics,
    readinessRating,
    topStrengths
  };
}
