import { FinalInterviewReport, InterviewSession, TopicPerformance } from '../types/index.js';

export function generateReport(session: InterviewSession): FinalInterviewReport {
  let marksEarned = 0;
  let totalPossibleMarks = 0;
  let correctCount = 0;
  let partiallyCorrectCount = 0;
  let incorrectCount = 0;
  let skippedCount = 0;
  let attemptedCount = 0;

  const topicMap = new Map<string, { total: number; earned: number; max: number }>();
  const questionReviews: FinalInterviewReport['questionReviews'] = [];

  const strengthsList: string[] = [];
  const weaknessesList: string[] = [];
  const suggestionsList: string[] = [];

  // Group interactions by question
  for (const q of session.questions) {
    const qInteractions = session.interactions.filter(i => i.questionId === q.id);
    
    // Find the latest final evaluation interaction for this question (answer or skip)
    const evaluatedInteraction = qInteractions
      .filter(i => i.evaluationStatus !== 'clarification')
      .slice(-1)[0];

    let marks = 0;
    let status: FinalInterviewReport['questionReviews'][0]['evaluationStatus'] = 'skipped';
    let studentAns = 'Not answered';
    let feedback = 'No answer submitted for this question.';
    let expected = q.expectedPoints.join('. ');
    let correctPoints: string[] = [];
    let missingPoints: string[] = q.expectedPoints;
    let incorrectPoints: string[] = [];
    let followUp: string | undefined = undefined;

    totalPossibleMarks += q.maxMarks;

    if (evaluatedInteraction) {
      marks = evaluatedInteraction.marksAwarded;
      status = evaluatedInteraction.evaluationStatus;
      studentAns = evaluatedInteraction.userInput;
      feedback = evaluatedInteraction.feedback;
      expected = evaluatedInteraction.expectedAnswer || expected;
      correctPoints = evaluatedInteraction.correctPoints;
      missingPoints = evaluatedInteraction.missingPoints;
      incorrectPoints = evaluatedInteraction.incorrectPoints;
      followUp = evaluatedInteraction.followUpQuestion;

      marksEarned += marks;

      if (status === 'correct') {
        correctCount++;
        attemptedCount++;
        strengthsList.push(`Demonstrated solid comprehension of ${q.topic} concepts.`);
      } else if (status === 'partially_correct') {
        partiallyCorrectCount++;
        attemptedCount++;
        weaknessesList.push(`Partially grasped ${q.topic}, but missed key technical specifics.`);
      } else if (status === 'incorrect') {
        incorrectCount++;
        attemptedCount++;
        weaknessesList.push(`Struggled with the foundational definitions in ${q.topic}.`);
      } else if (status === 'skipped') {
        skippedCount++;
      }
    } else {
      skippedCount++;
    }

    // Accumulate topic-wise stats
    const currentTopicStat = topicMap.get(q.topic) || { total: 0, earned: 0, max: 0 };
    currentTopicStat.total += 1;
    currentTopicStat.earned += marks;
    currentTopicStat.max += q.maxMarks;
    topicMap.set(q.topic, currentTopicStat);

    questionReviews.push({
      questionIndex: q.questionIndex + 1,
      questionText: q.questionText,
      topic: q.topic,
      difficulty: q.difficulty,
      studentAnswer: studentAns,
      expectedAnswer: expected,
      evaluationStatus: status,
      marksAwarded: marks,
      maxMarks: q.maxMarks,
      aiFeedback: feedback,
      correctPoints,
      missingPoints,
      incorrectPoints,
      followUp,
    });
  }

  // Calculate percentage and score out of 100
  const percentage = totalPossibleMarks > 0 ? Math.round((marksEarned / totalPossibleMarks) * 100) : 0;
  const finalScore = percentage; // scaled directly to 100

  // Deduplicate and format strengths & weaknesses
  const uniqueStrengths = Array.from(new Set(strengthsList));
  if (uniqueStrengths.length === 0) {
    uniqueStrengths.push('Willingness to undertake rigorous technical interview practice and attempt challenging C++ concepts.');
  }

  const uniqueWeaknesses = Array.from(new Set(weaknessesList));
  if (uniqueWeaknesses.length === 0 && finalScore < 100) {
    uniqueWeaknesses.push('Edge case handling and low-level memory implications in complex scenarios.');
  }

  // Generate personalized actionable improvement suggestions
  if (finalScore >= 85) {
    suggestionsList.push('Outstanding performance! To elevate further, delve into Modern C++20 concepts like Ranges, Concepts, and Coroutines.');
    suggestionsList.push('Practice explaining low-level assembly outputs and compiler optimizations (e.g., NRVO, inlining).');
  } else if (finalScore >= 65) {
    suggestionsList.push('Good foundation. Deepen your understanding of exception safety guarantees (basic, strong, nothrow).');
    suggestionsList.push('Review RAII and smart pointer ownership patterns to avoid subtle memory traps.');
    suggestionsList.push('Practice articulating the difference between compile-time template instantiation and runtime virtual function dispatch.');
  } else {
    suggestionsList.push('Focus on fundamental C++ memory mechanics: stack vs heap, pointer dereferencing, and references.');
    suggestionsList.push('Write hands-on small programs practicing try-catch blocks and function/class templates.');
    suggestionsList.push('Review the 4 pillars of Object-Oriented Programming and how virtual functions enable dynamic dispatch.');
  }

  // Build topic-wise performance array
  const topicWisePerformance: TopicPerformance[] = [];
  topicMap.forEach((stat, topic) => {
    topicWisePerformance.push({
      topic,
      totalQuestions: stat.total,
      marksAwarded: stat.earned,
      maxMarks: stat.max,
      percentage: stat.max > 0 ? Math.round((stat.earned / stat.max) * 100) : 0
    });
  });

  // Calculate duration
  const startTime = new Date(session.startTime).getTime();
  const endTime = Date.now();
  const durationSeconds = Math.max(1, Math.round((endTime - startTime) / 1000));

  return {
    sessionId: session.id,
    topicTitle: session.topicTitle,
    initialDifficulty: session.difficulty,
    finalScore,
    totalQuestions: session.questions.length,
    questionsAttempted: attemptedCount,
    correctAnswers: correctCount,
    partiallyCorrectAnswers: partiallyCorrectCount,
    incorrectAnswers: incorrectCount,
    skippedQuestions: skippedCount,
    marksEarned,
    totalPossibleMarks,
    percentage,
    strengths: uniqueStrengths.slice(0, 5),
    weaknesses: uniqueWeaknesses.slice(0, 5),
    improvementSuggestions: suggestionsList,
    topicWisePerformance,
    questionReviews,
    durationSeconds,
    completedAt: new Date().toISOString()
  };
}
