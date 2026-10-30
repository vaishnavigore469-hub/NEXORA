import { Router, Request, Response } from 'express';
import { 
  createSession, 
  getSessionById, 
  recordInteraction, 
  prepareNextQuestion, 
  advanceSessionDifficulty, 
  updateSessionCurrentIndex, 
  finishSession, 
  getSessionReport, 
  listRecentSessions, 
  getOverallStatistics 
} from '../services/sessionService.js';
import { evaluateStudentInput } from '../services/evaluatorService.js';
import { generateReport } from '../services/reportService.js';
import { Difficulty, InterviewLength } from '../types/index.js';
import { QUESTION_BANK } from '../data/questionBank.js';
import { optionalAuth, AuthenticatedRequest } from './authRoutes.js';

const router = Router();

// Start a new interview session
router.post('/start', optionalAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { topicId = 'all', difficulty = 'Adaptive', targetQuestions = 5 } = req.body;
    
    const validDifficulties: Difficulty[] = ['Beginner', 'Intermediate', 'Advanced', 'Adaptive'];
    const validLengths: InterviewLength[] = [5, 10, 15];

    const diff = validDifficulties.includes(difficulty) ? difficulty : 'Adaptive';
    const len = validLengths.includes(targetQuestions) ? targetQuestions : 5;

    const session = await createSession({
      topicId: String(topicId),
      difficulty: diff,
      targetQuestions: len,
      userId: req.user?.id
    });

    res.status(201).json({ success: true, session });
  } catch (err: any) {
    console.error('Error starting session:', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to start interview' });
  }
});

// Get session state (for restore on page refresh)
router.get('/:sessionId', (req: Request, res: Response): void => {
  try {
    const sessionId = String(req.params.sessionId);
    const session = getSessionById(sessionId);

    if (!session) {
      res.status(404).json({ success: false, error: 'Interview session not found' });
      return;
    }

    res.json({ success: true, session });
  } catch (err: any) {
    console.error('Error fetching session:', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to retrieve session' });
  }
});

// Submit an interaction (Answer, Hint, Clarification, Repeat, Skip, End)
router.post('/:sessionId/interact', async (req: Request, res: Response): Promise<void> => {
  try {
    const sessionId = String(req.params.sessionId);
    const { userInput = '' } = req.body;

    const session = getSessionById(sessionId);
    if (!session) {
      res.status(404).json({ success: false, error: 'Session not found' });
      return;
    }

    if (session.status === 'completed') {
      const existingReport = getSessionReport(sessionId);
      res.json({ 
        success: true, 
        isFinished: true, 
        session, 
        report: existingReport 
      });
      return;
    }

    const currentQuestion = session.questions[session.currentQuestionIndex];
    if (!currentQuestion) {
      res.status(400).json({ success: false, error: 'No active question found for this index' });
      return;
    }

    // Match against question bank for reference answer / hint
    const bankMatch = QUESTION_BANK.find(q => q.question === currentQuestion.questionText);
    const hint = bankMatch?.hint;
    const expectedAnswer = bankMatch?.expectedAnswer || currentQuestion.expectedPoints.join('. ');
    const followUpPrompt = bankMatch?.followUpPrompt;

    // Evaluate input (detects meta intent like hint/explanation vs technical answer)
    const evaluation = await evaluateStudentInput({
      question: currentQuestion,
      userInput: String(userInput),
      hint,
      expectedAnswer,
      followUpPrompt
    });

    // Record interaction in DB
    const recordedInteraction = recordInteraction({
      sessionId,
      questionId: currentQuestion.id,
      interactionType: evaluation.metaIntent || 'answer',
      userInput: String(userInput),
      aiResponseText: evaluation.feedback,
      evaluationStatus: evaluation.evaluation_status,
      marksAwarded: evaluation.marks_awarded,
      maxMarks: evaluation.maximum_marks,
      correctPoints: evaluation.correct_points,
      missingPoints: evaluation.missing_points,
      incorrectPoints: evaluation.incorrect_points,
      feedback: evaluation.feedback,
      expectedAnswer: evaluation.expected_answer,
      followUpQuestion: evaluation.follow_up_question
    });

    // Handle end interview request
    if (evaluation.next_action === 'end_interview') {
      const updatedSession = getSessionById(sessionId)!;
      const report = generateReport(updatedSession);
      finishSession(sessionId, report);
      res.json({
        success: true,
        interaction: recordedInteraction,
        isFinished: true,
        session: getSessionById(sessionId),
        report
      });
      return;
    }

    // If it was just a clarification/hint/repeat, do NOT advance question!
    if (evaluation.next_action === 'clarification_provided' || evaluation.next_action === 'repeat_question') {
      res.json({
        success: true,
        interaction: recordedInteraction,
        isFinished: false,
        session: getSessionById(sessionId),
        advanced: false
      });
      return;
    }

    // It was an actual answer or skip: advance to next question or complete
    const nextIndex = session.currentQuestionIndex + 1;
    let nextDifficulty = session.currentDifficulty;

    if (session.difficulty === 'Adaptive') {
      nextDifficulty = advanceSessionDifficulty(session.currentDifficulty, evaluation.marks_awarded, evaluation.maximum_marks);
    }

    // Check if session reached target questions
    if (nextIndex >= session.targetQuestions) {
      updateSessionCurrentIndex(sessionId, nextIndex, nextDifficulty);
      const updatedSession = getSessionById(sessionId)!;
      const report = generateReport(updatedSession);
      finishSession(sessionId, report);

      res.json({
        success: true,
        interaction: recordedInteraction,
        isFinished: true,
        session: getSessionById(sessionId),
        report,
        advanced: true
      });
      return;
    }

    // Prepare the next question
    const existingTexts = session.questions.map(q => q.questionText);
    const nextQ = await prepareNextQuestion(
      sessionId,
      nextIndex,
      nextDifficulty,
      session.topicId,
      session.topicTitle,
      existingTexts
    );

    updateSessionCurrentIndex(sessionId, nextIndex, nextDifficulty);

    res.json({
      success: true,
      interaction: recordedInteraction,
      nextQuestion: nextQ,
      isFinished: false,
      session: getSessionById(sessionId),
      advanced: true
    });

  } catch (err: any) {
    console.error('Error handling interaction:', err);
    res.status(500).json({ success: false, error: err.message || 'Interaction processing failed' });
  }
});

// Explicitly finish/end session
router.post('/:sessionId/end', (req: Request, res: Response): void => {
  try {
    const sessionId = String(req.params.sessionId);
    const session = getSessionById(sessionId);

    if (!session) {
      res.status(404).json({ success: false, error: 'Session not found' });
      return;
    }

    const report = generateReport(session);
    finishSession(sessionId, report);

    res.json({
      success: true,
      session: getSessionById(sessionId),
      report
    });
  } catch (err: any) {
    console.error('Error ending session:', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to end session' });
  }
});

// Get session report
router.get('/:sessionId/report', (req: Request, res: Response): void => {
  try {
    const sessionId = String(req.params.sessionId);
    const report = getSessionReport(sessionId);

    if (!report) {
      // If not yet finished, generate report on the fly
      const session = getSessionById(sessionId);
      if (session) {
        const generated = generateReport(session);
        res.json({ success: true, report: generated });
        return;
      }
      res.status(404).json({ success: false, error: 'Report not found' });
      return;
    }

    res.json({ success: true, report });
  } catch (err: any) {
    console.error('Error getting report:', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to get report' });
  }
});

// Get recent history
router.get('/history/recent', optionalAuth, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const limit = parseInt(String(req.query.limit || '15'), 10);
    const userId = req.user?.id;
    const sessions = listRecentSessions(limit, userId);
    res.json({ success: true, sessions });
  } catch (err: any) {
    console.error('Error fetching history:', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to fetch history' });
  }
});

// Get overall statistics
router.get('/history/stats', optionalAuth, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const userId = req.user?.id;
    const stats = getOverallStatistics(userId);
    res.json({ success: true, stats });
  } catch (err: any) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to fetch stats' });
  }
});

export default router;
