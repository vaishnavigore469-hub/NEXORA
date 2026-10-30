import { AiEvaluationResult, InteractionType, StoredQuestion } from '../types/index.js';
import { detectMetaIntent, evaluateAnswerWithGemini, generateClarificationWithGemini } from './geminiService.js';
import { isGeminiConfigured } from '../config/index.js';

export interface EvaluateInputParams {
  sessionId: string;
  question: StoredQuestion;
  userInput: string;
  hint?: string;
  expectedAnswer?: string;
}

export async function evaluateStudentInput(params: {
  question: StoredQuestion;
  userInput: string;
  hint?: string;
  expectedAnswer?: string;
  followUpPrompt?: string;
}): Promise<AiEvaluationResult> {
  const { question, userInput, hint, expectedAnswer, followUpPrompt } = params;
  const trimmed = userInput.trim();

  // 1. Check for Meta Intent (Clarification, Hint, Repeat, Skip, End)
  const metaIntent = detectMetaIntent(trimmed);

  if (metaIntent) {
    if (metaIntent === 'skip_request') {
      return {
        isClarificationOrMeta: true,
        metaIntent: 'skip_request',
        evaluation_status: 'skipped',
        marks_awarded: 0,
        maximum_marks: question.maxMarks,
        correct_points: [],
        missing_points: ['Question was skipped by candidate'],
        incorrect_points: [],
        feedback: "You chose to skip this question. In a real technical interview, it's always good to share whatever partial thoughts or approach you have before passing.",
        expected_answer: expectedAnswer || 'Review the core concept for this topic in the syllabus.',
        next_action: 'next_question',
      };
    }

    if (metaIntent === 'end_request') {
      return {
        isClarificationOrMeta: true,
        metaIntent: 'end_request',
        evaluation_status: 'clarification',
        marks_awarded: 0,
        maximum_marks: question.maxMarks,
        correct_points: [],
        missing_points: [],
        incorrect_points: [],
        feedback: "Ending interview upon request. Let's look at your performance summary so far.",
        expected_answer: '',
        next_action: 'end_interview',
      };
    }

    if (metaIntent === 'hint_request') {
      let clarificationText = hint || "Think about the underlying C++ memory model and how the compiler handles this concept.";
      if (isGeminiConfigured()) {
        const aiClarification = await generateClarificationWithGemini({
          intent: 'hint_request',
          questionText: question.questionText,
          topic: question.topic,
          hint,
          userInput: trimmed
        });
        if (aiClarification) clarificationText = aiClarification;
      }
      return {
        isClarificationOrMeta: true,
        metaIntent: 'hint_request',
        evaluation_status: 'clarification',
        marks_awarded: 0,
        maximum_marks: question.maxMarks,
        correct_points: [],
        missing_points: [],
        incorrect_points: [],
        feedback: `💡 **Hint:** ${clarificationText}\n\nTake your time and give it your best shot!`,
        expected_answer: '',
        next_action: 'clarification_provided',
      };
    }

    if (metaIntent === 'explanation_request' || metaIntent === 'example_request') {
      let explanationText = `This question asks you to focus on the key mechanics of **${question.topic}**. Consider the syntax, why C++ provides this feature, and where it makes code more robust or performant.`;
      if (isGeminiConfigured()) {
        const aiExplanation = await generateClarificationWithGemini({
          intent: metaIntent,
          questionText: question.questionText,
          topic: question.topic,
          hint,
          userInput: trimmed
        });
        if (aiExplanation) explanationText = aiExplanation;
      }
      return {
        isClarificationOrMeta: true,
        metaIntent: metaIntent,
        evaluation_status: 'clarification',
        marks_awarded: 0,
        maximum_marks: question.maxMarks,
        correct_points: [],
        missing_points: [],
        incorrect_points: [],
        feedback: `🔍 **Clarification:** ${explanationText}\n\nHow would you explain your approach?`,
        expected_answer: '',
        next_action: 'clarification_provided',
      };
    }

    if (metaIntent === 'repeat_request') {
      return {
        isClarificationOrMeta: true,
        metaIntent: 'repeat_request',
        evaluation_status: 'clarification',
        marks_awarded: 0,
        maximum_marks: question.maxMarks,
        correct_points: [],
        missing_points: [],
        incorrect_points: [],
        feedback: `Certainly! Here is the question again:\n\n**${question.questionText}**${question.codeSnippet ? `\n\n\`\`\`cpp\n${question.codeSnippet}\n\`\`\`` : ''}`,
        expected_answer: '',
        next_action: 'repeat_question',
      };
    }
  }

  // 2. Check for explicit "I don't know" answers
  const lower = trimmed.toLowerCase();
  if (
    /^(i\s*(do\s*not|don'?t)\s*know|no\s*idea|not\s*sure|have\s*no\s*clue|dunno)$/i.test(lower) ||
    lower.length < 3
  ) {
    return {
      isClarificationOrMeta: false,
      evaluation_status: 'incorrect',
      marks_awarded: 0,
      maximum_marks: question.maxMarks,
      correct_points: [],
      missing_points: question.expectedPoints,
      incorrect_points: ['No technical answer provided'],
      feedback: "That's completely okay! Technical interviews are also learning experiences. Review the expected concept below to strengthen your fundamentals.",
      expected_answer: expectedAnswer || question.expectedPoints.join('. '),
      follow_up_question: followUpPrompt || 'Would you like to try a related concept?',
      next_action: 'next_question',
    };
  }

  // 3. If Gemini is configured, evaluate using Live Gemini AI
  if (isGeminiConfigured()) {
    const aiResult = await evaluateAnswerWithGemini({
      questionText: question.questionText,
      topic: question.topic,
      difficulty: question.difficulty,
      expectedAnswer: expectedAnswer || question.expectedPoints.join('. '),
      keyPoints: question.expectedPoints,
      maxMarks: question.maxMarks,
      studentAnswer: trimmed,
    });

    if (aiResult) {
      return aiResult;
    }
  }

  // 4. Deterministic Local Technical Evaluation Engine (Used for Demo Mode or Network Fallback)
  return evaluateWithLocalTechnicalEngine(question, trimmed, expectedAnswer, followUpPrompt);
}

/**
 * Local verified technical evaluation engine
 * Evaluates semantic presence of core technical concepts and vocabulary.
 */
function evaluateWithLocalTechnicalEngine(
  question: StoredQuestion,
  studentAnswer: string,
  expectedAnswer?: string,
  followUpPrompt?: string
): AiEvaluationResult {
  const answerLower = studentAnswer.toLowerCase();
  const matchedPoints: string[] = [];
  const missingPoints: string[] = [];

  for (const point of question.expectedPoints) {
    // Extract keywords (words > 3 letters, excluding common stopwords)
    const words = point
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 3 && !['with', 'from', 'that', 'this', 'have', 'when', 'which', 'than', 'more', 'also'].includes(w));

    let matchCount = 0;
    for (const w of words) {
      if (answerLower.includes(w)) {
        matchCount++;
      }
    }

    const matchRatio = words.length > 0 ? matchCount / words.length : 0;
    if (matchRatio >= 0.3 || (matchCount >= 2 && words.length >= 3)) {
      matchedPoints.push(point);
    } else {
      missingPoints.push(point);
    }
  }

  const totalPoints = question.expectedPoints.length;
  const ratio = totalPoints > 0 ? matchedPoints.length / totalPoints : 0.5;

  let status: 'correct' | 'partially_correct' | 'incorrect';
  let marks: number;
  let feedbackText = '';

  if (ratio >= 0.7) {
    status = 'correct';
    marks = question.maxMarks;
    feedbackText = `Excellent explanation! You clearly articulated the core principles of **${question.topic}**. Your technical reasoning is sound and accurate.`;
  } else if (ratio >= 0.35 || matchedPoints.length >= 1) {
    status = 'partially_correct';
    marks = Math.round(question.maxMarks * (0.45 + ratio * 0.4));
    feedbackText = `Good attempt! You understood key parts of the concept, but missed a few crucial nuances detailed in the missing points below.`;
  } else {
    status = 'incorrect';
    marks = Math.min(2, Math.round(question.maxMarks * 0.2));
    feedbackText = `Your answer does not yet capture the essential technical definition for this C++ topic. Take a look at the expected answer and key points to solidify your understanding.`;
  }

  const followUp = followUpPrompt || (
    status === 'correct'
      ? `How would you optimize or safeguard this pattern in modern C++ (C++17/20)?`
      : `Can you think of a practical example or edge case where this concept becomes critical?`
  );

  return {
    isClarificationOrMeta: false,
    evaluation_status: status,
    marks_awarded: marks,
    maximum_marks: question.maxMarks,
    correct_points: matchedPoints.length > 0 ? matchedPoints : ['Demonstrated basic engagement with the topic'],
    missing_points: missingPoints,
    incorrect_points: status === 'incorrect' ? ['Core technical concept was not adequately explained'] : [],
    feedback: feedbackText,
    expected_answer: expectedAnswer || question.expectedPoints.join('. '),
    follow_up_question: followUp,
    next_action: 'next_question',
  };
}
