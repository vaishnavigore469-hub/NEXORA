import { randomUUID } from 'crypto';
import { db } from '../database/db.js';
import { 
  Difficulty, 
  InterviewLength, 
  InterviewSession, 
  StoredQuestion, 
  StoredInteraction, 
  BankQuestion,
  FinalInterviewReport
} from '../types/index.js';
import { CPP_TOPICS, getTopicById } from '../data/cppTopics.js';
import { getRandomBankQuestion, getQuestionsByTopic, QUESTION_BANK } from '../data/questionBank.js';
import { generateQuestionWithGemini } from './geminiService.js';
import { isGeminiConfigured } from '../config/index.js';

/**
 * Fetch recently asked question texts from database to avoid repeating questions
 * across consecutive mock interviews.
 */
export function getRecentlyAskedQuestionTexts(topicId?: string, userId?: string, limit = 25): string[] {
  try {
    let query = 'SELECT q.question_text FROM questions q ';
    const conditions: string[] = [];
    const params: any[] = [];

    if (userId) {
      query += 'JOIN sessions s ON q.session_id = s.id ';
      conditions.push('s.user_id = ?');
      params.push(userId);
    } else {
      query += 'JOIN sessions s ON q.session_id = s.id ';
    }

    if (topicId && topicId !== 'all') {
      conditions.push('(s.topic_id = ? OR q.topic = ?)');
      params.push(topicId, topicId);
    }

    if (conditions.length > 0) {
      query += 'WHERE ' + conditions.join(' AND ') + ' ';
    }

    query += 'ORDER BY q.created_at DESC LIMIT ?';
    params.push(limit);

    const rows = db.prepare(query).all(...params) as { question_text: string }[];
    return rows.map(r => r.question_text);
  } catch (err) {
    return [];
  }
}

export async function createSession(params: {
  topicId: string;
  difficulty: Difficulty;
  targetQuestions: InterviewLength;
  userId?: string;
}): Promise<InterviewSession> {
  const sessionId = randomUUID();
  const topic = getTopicById(params.topicId) || {
    id: params.topicId,
    name: params.topicId === 'all' ? 'Complete C++ Syllabus' : params.topicId,
    category: 'General',
    description: '',
    subtopics: [],
    keyConcepts: []
  };

  const initialCurrentDifficulty = params.difficulty === 'Adaptive' ? 'Intermediate' : params.difficulty;
  const startTime = new Date().toISOString();

  // Insert session into SQLite
  db.prepare(`
    INSERT INTO sessions (
      id, user_id, topic_id, topic_title, difficulty, current_difficulty, 
      target_questions, status, current_question_index, start_time
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?)
  `).run(
    sessionId,
    params.userId || null,
    params.topicId,
    topic.name,
    params.difficulty,
    initialCurrentDifficulty,
    params.targetQuestions,
    'in_progress',
    startTime
  );

  // Generate or select the first question with recent questions excluded
  const recentExclusions = getRecentlyAskedQuestionTexts(params.topicId, params.userId, 15);
  await prepareNextQuestion(sessionId, 0, initialCurrentDifficulty, params.topicId, topic.name, recentExclusions);

  return getSessionById(sessionId)!;
}

export async function prepareNextQuestion(
  sessionId: string,
  questionIndex: number,
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced',
  topicId: string,
  topicName: string,
  excludeQuestionTexts: string[] = []
): Promise<StoredQuestion> {
  const questionId = randomUUID();
  let selectedQuestion: Partial<BankQuestion> | undefined;

  // Combine current session questions with recent question history to prevent any repetition
  const recentTexts = getRecentlyAskedQuestionTexts(topicId, undefined, 20);
  const allExclusions = Array.from(new Set([...excludeQuestionTexts, ...recentTexts]));

  // 1. Try Gemini generation if live AI mode is active (using gemini-3.8-flash)
  if (isGeminiConfigured()) {
    try {
      const generated = await generateQuestionWithGemini({
        topic: topicName,
        difficulty,
        previousQuestions: allExclusions
      });
      if (generated && generated.question) {
        selectedQuestion = generated;
      }
    } catch (e) {
      console.warn('Gemini question generation fallback to bank:', e);
    }
  }

  // 2. Fallback to curated question bank with rigorous anti-repetition filter
  if (!selectedQuestion) {
    // Attempt with full exclusions (session + recent history)
    let bankQ = getRandomBankQuestion(topicId, difficulty, allExclusions);
    
    // If topic pool is exhausted by recent history, relax to only current session exclusions
    if (!bankQ && excludeQuestionTexts.length > 0) {
      bankQ = getRandomBankQuestion(topicId, difficulty, excludeQuestionTexts);
    }

    // If still null, pick from any topic without repeating in current session
    if (!bankQ) {
      bankQ = getRandomBankQuestion('all', difficulty, excludeQuestionTexts);
    }

    if (bankQ) {
      selectedQuestion = bankQ;
    } else {
      // Final fallback
      const randomQ = QUESTION_BANK[Math.floor(Math.random() * QUESTION_BANK.length)];
      selectedQuestion = randomQ;
    }
  }

  const questionText = selectedQuestion.question || 'Explain the concept of memory management and pointers in C++.';
  const expectedPoints = selectedQuestion.keyPoints || ['Memory allocation', 'Pointers', 'Resource deallocation'];
  const codeSnippet = selectedQuestion.codeSnippet || null;
  const maxMarks = selectedQuestion.maxMarks || 10;
  const createdAt = new Date().toISOString();

  db.prepare(`
    INSERT INTO questions (
      id, session_id, question_index, question_text, topic, 
      difficulty, max_marks, expected_points_json, code_snippet, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    questionId,
    sessionId,
    questionIndex,
    questionText,
    selectedQuestion.topicName || topicName,
    difficulty,
    maxMarks,
    JSON.stringify(expectedPoints),
    codeSnippet,
    createdAt
  );

  return {
    id: questionId,
    sessionId,
    questionIndex,
    questionText,
    topic: selectedQuestion.topicName || topicName,
    difficulty,
    maxMarks,
    expectedPoints,
    codeSnippet: codeSnippet || undefined,
    createdAt
  };
}

export function getSessionById(sessionId: string): InterviewSession | null {
  const row = db.prepare('SELECT * FROM sessions WHERE id = ?').get(sessionId) as any;
  if (!row) return null;

  const questionsRows = db.prepare('SELECT * FROM questions WHERE session_id = ? ORDER BY question_index ASC').all(sessionId) as any[];
  const interactionsRows = db.prepare('SELECT * FROM interactions WHERE session_id = ? ORDER BY created_at ASC').all(sessionId) as any[];

  const questions: StoredQuestion[] = questionsRows.map(q => ({
    id: q.id,
    sessionId: q.session_id,
    questionIndex: q.question_index,
    questionText: q.question_text,
    topic: q.topic,
    difficulty: q.difficulty,
    maxMarks: q.max_marks,
    expectedPoints: JSON.parse(q.expected_points_json || '[]'),
    codeSnippet: q.code_snippet || undefined,
    createdAt: q.created_at
  }));

  const interactions: StoredInteraction[] = interactionsRows.map(i => ({
    id: i.id,
    sessionId: i.session_id,
    questionId: i.question_id,
    interactionType: i.interaction_type,
    userInput: i.user_input,
    aiResponseText: i.ai_response_text,
    evaluationStatus: i.evaluation_status,
    marksAwarded: i.marks_awarded,
    maxMarks: i.max_marks,
    correctPoints: JSON.parse(i.correct_points_json || '[]'),
    missingPoints: JSON.parse(i.missing_points_json || '[]'),
    incorrectPoints: JSON.parse(i.incorrect_points_json || '[]'),
    feedback: i.feedback,
    expectedAnswer: i.expected_answer,
    followUpQuestion: i.follow_up_question || undefined,
    createdAt: i.created_at
  }));

  return {
    id: row.id,
    userId: row.user_id || undefined,
    topicId: row.topic_id,
    topicTitle: row.topic_title,
    difficulty: row.difficulty,
    currentDifficulty: row.current_difficulty,
    targetQuestions: row.target_questions,
    status: row.status,
    currentQuestionIndex: row.current_question_index,
    startTime: row.start_time,
    endTime: row.end_time || undefined,
    finalScore: row.final_score !== null ? row.final_score : undefined,
    totalMarksAwarded: row.total_marks_awarded !== null ? row.total_marks_awarded : undefined,
    totalMaxMarks: row.total_max_marks !== null ? row.total_max_marks : undefined,
    questions,
    interactions
  };
}

export function recordInteraction(params: {
  sessionId: string;
  questionId: string;
  interactionType: string;
  userInput: string;
  aiResponseText: string;
  evaluationStatus: string;
  marksAwarded: number;
  maxMarks: number;
  correctPoints: string[];
  missingPoints: string[];
  incorrectPoints: string[];
  feedback: string;
  expectedAnswer: string;
  followUpQuestion?: string;
}): StoredInteraction {
  const interactionId = randomUUID();
  const createdAt = new Date().toISOString();

  db.prepare(`
    INSERT INTO interactions (
      id, session_id, question_id, interaction_type, user_input, 
      ai_response_text, evaluation_status, marks_awarded, max_marks, 
      correct_points_json, missing_points_json, incorrect_points_json, 
      feedback, expected_answer, follow_up_question, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    interactionId,
    params.sessionId,
    params.questionId,
    params.interactionType,
    params.userInput,
    params.aiResponseText,
    params.evaluationStatus,
    params.marksAwarded,
    params.maxMarks,
    JSON.stringify(params.correctPoints),
    JSON.stringify(params.missingPoints),
    JSON.stringify(params.incorrectPoints),
    params.feedback,
    params.expectedAnswer,
    params.followUpQuestion || null,
    createdAt
  );

  return {
    id: interactionId,
    sessionId: params.sessionId,
    questionId: params.questionId,
    interactionType: params.interactionType as any,
    userInput: params.userInput,
    aiResponseText: params.aiResponseText,
    evaluationStatus: params.evaluationStatus as any,
    marksAwarded: params.marksAwarded,
    maxMarks: params.maxMarks,
    correctPoints: params.correctPoints,
    missingPoints: params.missingPoints,
    incorrectPoints: params.incorrectPoints,
    feedback: params.feedback,
    expectedAnswer: params.expectedAnswer,
    followUpQuestion: params.followUpQuestion,
    createdAt
  };
}

export function advanceSessionDifficulty(
  current: 'Beginner' | 'Intermediate' | 'Advanced',
  marksAwarded: number,
  maxMarks: number
): 'Beginner' | 'Intermediate' | 'Advanced' {
  const percentage = (marksAwarded / maxMarks) * 100;
  if (percentage >= 80) {
    if (current === 'Beginner') return 'Intermediate';
    if (current === 'Intermediate') return 'Advanced';
    return 'Advanced';
  } else if (percentage < 45) {
    if (current === 'Advanced') return 'Intermediate';
    if (current === 'Intermediate') return 'Beginner';
    return 'Beginner';
  }
  return current;
}

export function updateSessionCurrentIndex(sessionId: string, newIndex: number, newDifficulty?: 'Beginner' | 'Intermediate' | 'Advanced'): void {
  if (newDifficulty) {
    db.prepare('UPDATE sessions SET current_question_index = ?, current_difficulty = ? WHERE id = ?').run(newIndex, newDifficulty, sessionId);
  } else {
    db.prepare('UPDATE sessions SET current_question_index = ? WHERE id = ?').run(newIndex, sessionId);
  }
}

export function finishSession(sessionId: string, report: FinalInterviewReport): void {
  const endTime = new Date().toISOString();
  db.prepare(`
    UPDATE sessions SET
      status = 'completed',
      end_time = ?,
      final_score = ?,
      total_marks_awarded = ?,
      total_max_marks = ?,
      report_json = ?
    WHERE id = ?
  `).run(
    endTime,
    report.finalScore,
    report.marksEarned,
    report.totalPossibleMarks,
    JSON.stringify(report),
    sessionId
  );
}

export function getSessionReport(sessionId: string): FinalInterviewReport | null {
  const row = db.prepare('SELECT report_json FROM sessions WHERE id = ?').get(sessionId) as { report_json: string } | undefined;
  if (!row || !row.report_json) return null;
  try {
    return JSON.parse(row.report_json) as FinalInterviewReport;
  } catch (err) {
    console.error('Failed to parse report_json:', err);
    return null;
  }
}

export function listRecentSessions(limit = 10, userId?: string): any[] {
  if (userId) {
    return db.prepare(`
      SELECT id, user_id, topic_id, topic_title, difficulty, target_questions, status,
             current_question_index, start_time, end_time, final_score,
             total_marks_awarded, total_max_marks
      FROM sessions
      WHERE user_id = ?
      ORDER BY start_time DESC
      LIMIT ?
    `).all(userId, limit);
  }

  return db.prepare(`
    SELECT id, user_id, topic_id, topic_title, difficulty, target_questions, status,
           current_question_index, start_time, end_time, final_score,
           total_marks_awarded, total_max_marks
    FROM sessions
    ORDER BY start_time DESC
    LIMIT ?
  `).all(limit);
}

export function getOverallStatistics(userId?: string): {
  totalInterviews: number;
  averageScore: number;
  highestScore: number;
  topicsCovered: number;
} {
  const where = userId ? "WHERE status = 'completed' AND user_id = ?" : "WHERE status = 'completed'";
  const params = userId ? [userId] : [];

  const totalRow = db.prepare(`SELECT COUNT(*) as count FROM sessions ${where}`).get(...params) as { count: number };
  const avgRow = db.prepare(`SELECT AVG(final_score) as avg, MAX(final_score) as max FROM sessions ${where} AND final_score IS NOT NULL`).get(...params) as { avg: number | null, max: number | null };
  const topicsRow = db.prepare(`SELECT COUNT(DISTINCT topic_id) as count FROM sessions ${where}`).get(...params) as { count: number };

  return {
    totalInterviews: totalRow?.count || 0,
    averageScore: avgRow?.avg ? Math.round(avgRow.avg) : 0,
    highestScore: avgRow?.max ? Math.round(avgRow.max) : 0,
    topicsCovered: topicsRow?.count || 0,
  };
}
