export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Adaptive';

export type InterviewLength = 5 | 10 | 15;

export type SessionStatus = 'in_progress' | 'completed' | 'abandoned';

export type EvaluationStatus = 'correct' | 'partially_correct' | 'incorrect' | 'clarification' | 'skipped';

export type InteractionType = 
  | 'answer'
  | 'hint_request'
  | 'explanation_request'
  | 'repeat_request'
  | 'easier_request'
  | 'example_request'
  | 'skip_request'
  | 'end_request';

export interface CppTopic {
  id: string;
  name: string;
  category: string;
  description: string;
  subtopics: string[];
  keyConcepts: string[];
}

export interface BankQuestion {
  id: string;
  topicId: string;
  topicName: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  question: string;
  codeSnippet?: string;
  expectedAnswer: string;
  keyPoints: string[];
  hint: string;
  explanation: string;
  maxMarks: number;
  followUpPrompt?: string;
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
  interactionType: InteractionType;
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

export interface AiEvaluationResult {
  isClarificationOrMeta: boolean;
  metaIntent?: InteractionType;
  evaluation_status: 'correct' | 'partially_correct' | 'incorrect' | 'clarification' | 'skipped';
  marks_awarded: number;
  maximum_marks: number;
  correct_points: string[];
  missing_points: string[];
  incorrect_points: string[];
  feedback: string;
  expected_answer: string;
  follow_up_question?: string;
  next_action: 'next_question' | 'repeat_question' | 'clarification_provided' | 'end_interview';
  confidenceScore?: number;
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
  finalScore: number; // out of 100
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
