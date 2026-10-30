export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Adaptive';

export type InterviewLength = 5 | 10 | 15;

export type SessionStatus = 'in_progress' | 'completed' | 'abandoned';

export type EvaluationStatus = 'correct' | 'partially_correct' | 'incorrect' | 'clarification' | 'skipped';

export type OrbState = 'idle' | 'thinking' | 'responding' | 'evaluating';

export interface CppTopic {
  id: string;
  name: string;
  category: string;
  description: string;
  subtopics: string[];
  keyConcepts: string[];
}

export interface StoredQuestion {
  id: string;
  sessionId: string;
  questionIndex: number;
  questionText: string;
  topic: string;
  difficulty: string;
  maxMarks: number;
  expectedPoints: string[];
  codeSnippet?: string;
  createdAt: string;
}

export interface StoredInteraction {
  id: string;
  sessionId: string;
  questionId: string;
  interactionType: 'answer' | 'hint_request' | 'explanation_request' | 'repeat_request' | 'skip_request' | 'end_request' | 'example_request';
  userInput: string;
  aiResponseText: string;
  evaluationStatus: EvaluationStatus;
  marksAwarded: number;
  maxMarks: number;
  correctPoints: string[];
  missingPoints: string[];
  incorrectPoints: string[];
  feedback: string;
  expectedAnswer: string;
  followUpQuestion?: string;
  createdAt: string;
}

export interface InterviewSession {
  id: string;
  userId?: string;
  topicId: string;
  topicTitle: string;
  difficulty: Difficulty;
  currentDifficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  targetQuestions: number;
  status: SessionStatus;
  currentQuestionIndex: number;
  startTime: string;
  endTime?: string;
  finalScore?: number;
  totalMarksAwarded?: number;
  totalMaxMarks?: number;
  questions: StoredQuestion[];
  interactions: StoredInteraction[];
}

export interface TopicPerformance {
  topic: string;
  totalQuestions: number;
  marksAwarded: number;
  maxMarks: number;
  percentage: number;
}

export interface FinalInterviewReport {
  sessionId: string;
  topicTitle: string;
  initialDifficulty: Difficulty;
  finalScore: number;
  totalQuestions: number;
  questionsAttempted: number;
  correctAnswers: number;
  partiallyCorrectAnswers: number;
  incorrectAnswers: number;
  skippedQuestions: number;
  marksEarned: number;
  totalPossibleMarks: number;
  percentage: number;
  strengths: string[];
  weaknesses: string[];
  improvementSuggestions: string[];
  topicWisePerformance: TopicPerformance[];
  questionReviews: {
    questionIndex: number;
    questionText: string;
    topic: string;
    difficulty: string;
    studentAnswer: string;
    expectedAnswer: string;
    evaluationStatus: EvaluationStatus;
    marksAwarded: number;
    maxMarks: number;
    aiFeedback: string;
    correctPoints: string[];
    missingPoints: string[];
    incorrectPoints: string[];
    followUp?: string;
  }[];
  durationSeconds: number;
  completedAt: string;
}

export interface AiStatusResponse {
  success: boolean;
  isConfigured: boolean;
  status?: 'connected' | 'disconnected' | 'saved_offline' | 'network_error' | string;
  mode: 'LIVE_AI' | 'DEMO_MODE';
  isSaved?: boolean;
  model: string;
  maskedKey: string | null;
  message: string;
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

export interface AuthResponse {
  success: boolean;
  message?: string;
  error?: string;
  user?: UserProfile;
  token?: string;
}

