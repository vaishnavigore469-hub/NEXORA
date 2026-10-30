import { type FC, useState, useEffect, useRef } from 'react';
import { 
  Send, 
  HelpCircle, 
  FastForward, 
  LogOut, 
  RotateCcw, 
  Code, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  Lightbulb, 
  ChevronRight,
  Sparkles,
  Info
} from 'lucide-react';
import { AiOrb } from '../components/AiOrb';
import type { 
  InterviewSession, 
  OrbState, 
  StoredInteraction, 
  StoredQuestion, 
  FinalInterviewReport 
} from '../types';
import { sendInterviewInteraction, endInterviewSession, getInterviewSession } from '../services/api';

interface InterviewPageProps {
  initialSession: InterviewSession;
  onFinishInterview: (report: FinalInterviewReport) => void;
  onExit: () => void;
}

export const InterviewPage: FC<InterviewPageProps> = ({
  initialSession,
  onFinishInterview,
  onExit: _onExit,
}) => {
  const [session, setSession] = useState<InterviewSession>(initialSession);
  const [userInput, setUserInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orbState, setOrbState] = useState<OrbState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Preserve session ID in localStorage and URL query for seamless refresh
  useEffect(() => {
    if (session?.id) {
      localStorage.setItem('nexora_active_session_id', session.id);
      window.history.replaceState(null, '', `?session=${session.id}`);
    }
  }, [session?.id]);

  // Handle restoring session if needed
  useEffect(() => {
    async function verifySessionFreshness() {
      if (session?.id) {
        try {
          const res = await getInterviewSession(session.id);
          if (res.success && res.session) {
            setSession(res.session);
          }
        } catch (e) {
          console.warn('Session sync error:', e);
        }
      }
    }
    verifySessionFreshness();
  }, []);

  // Scroll to bottom on new message or evaluation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session.interactions, isSubmitting, orbState]);

  const progressPercent = Math.min(100, Math.round(((session.currentQuestionIndex) / session.targetQuestions) * 100));

  const handleSend = async (customText?: string) => {
    const textToSend = customText !== undefined ? customText : userInput;
    if (!textToSend.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);
    setOrbState('evaluating');

    try {
      const res = await sendInterviewInteraction(session.id, textToSend.trim());
      if (res.success) {
        setUserInput('');
        setSession(res.session);

        if (res.isFinished && res.report) {
          setOrbState('responding');
          setTimeout(() => {
            onFinishInterview(res.report!);
          }, 1000);
        } else {
          setOrbState('idle');
          if (textareaRef.current) {
            textareaRef.current.focus();
          }
        }
      } else {
        setErrorMessage('Failed to submit response. Please try again.');
        setOrbState('idle');
      }
    } catch (err: any) {
      console.error('Submission error:', err);
      setErrorMessage(err.message || 'Error communicating with interviewer.');
      setOrbState('idle');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEndInterviewEarly = async () => {
    setIsSubmitting(true);
    setOrbState('evaluating');
    try {
      const res = await endInterviewSession(session.id);
      if (res.success && res.report) {
        onFinishInterview(res.report);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to end interview.');
      setIsSubmitting(false);
      setOrbState('idle');
    }
  };

  const getEvaluationStatusBadge = (status: StoredInteraction['evaluationStatus']) => {
    switch (status) {
      case 'correct':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Correct</span>
          </span>
        );
      case 'partially_correct':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-950/80 text-amber-300 border border-amber-500/40">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Partially Correct</span>
          </span>
        );
      case 'incorrect':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-950/80 text-rose-300 border border-rose-500/40">
            <XCircle className="w-3.5 h-3.5 text-rose-400" />
            <span>Incorrect</span>
          </span>
        );
      case 'skipped':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
            <FastForward className="w-3.5 h-3.5 text-slate-400" />
            <span>Skipped</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col h-[calc(100vh-5rem)]">
      {/* Top Header & Progress */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-400/20 text-sky-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white">{session.topicTitle}</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                {session.currentDifficulty}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Question {Math.min(session.currentQuestionIndex + 1, session.targetQuestions)} of {session.targetQuestions} • C++ Technical Evaluation
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
          {/* Progress bar */}
          <div className="w-36 sm:w-48 space-y-1">
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Progress</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <button
            onClick={() => setShowEndConfirm(true)}
            className="px-3 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">End Interview</span>
          </button>
        </div>
      </div>

      {/* Main Interview Stage */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 py-4 min-h-0 overflow-hidden">
        {/* Left Column: AI Interviewer Status & Visual Identity */}
        <div className="lg:col-span-4 hidden lg:flex flex-col rounded-2xl bg-slate-900/70 border border-slate-800/80 p-5 overflow-y-auto">
          <div className="text-center py-4 border-b border-slate-800/60">
            <AiOrb size="md" state={orbState} showLabel={true} />
            <h2 className="text-sm font-bold text-white mt-4">NEXORA Senior Interviewer</h2>
            <p className="text-[11px] text-slate-400 mt-1">Autonomous C++ Technical Evaluation</p>
          </div>

          <div className="mt-5 space-y-3 text-xs flex-1">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Interview Context</span>
              <div className="text-white font-medium">{session.topicTitle}</div>
              <div className="text-[11px] text-slate-400">Difficulty: <span className="text-sky-300 font-medium">{session.currentDifficulty}</span></div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 text-[11px] text-slate-300">
              <div className="font-semibold text-sky-400 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" />
                <span>Interviewer Guidance</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Answer thoroughly using your own words. You can write code snippets or conceptual reasoning. If you get stuck, request a hint without deduction!
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Conversational Feed & Input */}
        <div className="lg:col-span-8 flex flex-col rounded-2xl bg-slate-900/50 border border-slate-800 overflow-hidden">
          {/* Conversation stream */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
            {/* Initial Welcome AI Greeting */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400 shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed max-w-2xl">
                Welcome to NEXORA! I'm your AI interviewer. Today, I'll evaluate your C++ knowledge in{' '}
                <strong className="text-sky-300">{session.topicTitle}</strong>. Answer naturally in simple English or include code. Let's begin!
              </div>
            </div>

            {/* Render all completed questions & interactions */}
            {session.questions.map((q, qIndex) => {
              const qInteractions = session.interactions.filter(i => i.questionId === q.id);

              // Don't render future unreached questions
              if (qIndex > session.currentQuestionIndex) return null;

              return (
                <div key={q.id} className="space-y-4">
                  {/* Question Bubble */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-lg shadow-sky-500/20">
                      Q{q.questionIndex + 1}
                    </div>
                    <div className="flex-1 p-5 rounded-2xl bg-slate-900/90 border border-sky-500/20 space-y-3">
                      <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800/80 pb-2">
                        <span className="font-semibold text-sky-300">{q.topic}</span>
                        <span>Max Marks: {q.maxMarks}</span>
                      </div>

                      <p className="text-sm sm:text-base font-semibold text-white leading-relaxed">
                        {q.questionText}
                      </p>

                      {q.codeSnippet && (
                        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-sky-200 overflow-x-auto whitespace-pre">
                          {q.codeSnippet}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Render interactions for this question */}
                  {qInteractions.map((interaction) => (
                    <div key={interaction.id} className="space-y-4 pl-4 sm:pl-11">
                      {/* Student's message */}
                      <div className="flex justify-end">
                        <div className="p-4 rounded-2xl bg-indigo-950/60 border border-indigo-500/30 text-xs sm:text-sm text-indigo-100 max-w-xl whitespace-pre-wrap leading-relaxed shadow-md">
                          {interaction.userInput}
                        </div>
                      </div>

                      {/* AI Response Card */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/95 border border-slate-800 space-y-3">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            {getEvaluationStatusBadge(interaction.evaluationStatus)}
                            {interaction.evaluationStatus !== 'clarification' && interaction.evaluationStatus !== 'skipped' && (
                              <span className="text-xs font-bold text-white">
                                {interaction.marksAwarded} / {interaction.maxMarks} Marks
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500">
                            {new Date(interaction.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        {/* AI Feedback Text */}
                        <div className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                          {interaction.feedback}
                        </div>

                        {/* Point-by-point breakdown for actual answers */}
                        {interaction.evaluationStatus !== 'clarification' && (
                          <div className="pt-2 border-t border-slate-800/80 space-y-2 text-xs">
                            {interaction.correctPoints.length > 0 && (
                              <div className="space-y-1">
                                <span className="font-semibold text-emerald-400 text-[11px] flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" /> Core Concepts Identified:
                                </span>
                                <ul className="list-disc list-inside text-slate-300 text-[11px] pl-1 space-y-0.5">
                                  {interaction.correctPoints.map((pt, idx) => (
                                    <li key={idx}>{pt}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {interaction.missingPoints.length > 0 && interaction.evaluationStatus !== 'correct' && (
                              <div className="space-y-1">
                                <span className="font-semibold text-amber-400 text-[11px] flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3" /> Nuances / Points to Review:
                                </span>
                                <ul className="list-disc list-inside text-slate-400 text-[11px] pl-1 space-y-0.5">
                                  {interaction.missingPoints.map((pt, idx) => (
                                    <li key={idx}>{pt}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {interaction.followUpQuestion && (
                              <div className="mt-2 p-2.5 rounded-xl bg-sky-950/40 border border-sky-500/20 text-xs text-sky-200">
                                <span className="font-bold text-sky-400 block mb-0.5">Follow-Up Probe:</span>
                                {interaction.followUpQuestion}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}

            {/* Evaluating / Generating Response Indicator */}
            {isSubmitting && (
              <div className="flex items-center gap-3 pl-11 text-xs text-sky-400 animate-pulse">
                <div className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                <span>NEXORA is evaluating your response against C++ standards...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Natural Interaction Chips */}
          <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-950/60 flex items-center gap-2 overflow-x-auto shrink-0 text-xs">
            <span className="text-[10px] uppercase font-bold text-slate-500 shrink-0">Quick Action:</span>
            <button
              onClick={() => handleSend('Can you give me a hint?')}
              disabled={isSubmitting}
              className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-sky-300 border border-slate-700 hover:border-sky-500/40 transition-colors shrink-0 flex items-center gap-1.5 disabled:opacity-50"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>Give me a hint</span>
            </button>

            <button
              onClick={() => handleSend('Please explain the question.')}
              disabled={isSubmitting}
              className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 hover:border-slate-600 transition-colors shrink-0 flex items-center gap-1.5 disabled:opacity-50"
            >
              <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
              <span>Explain question</span>
            </button>

            <button
              onClick={() => handleSend('Can you repeat the question?')}
              disabled={isSubmitting}
              className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 hover:border-slate-600 transition-colors shrink-0 flex items-center gap-1.5 disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5 text-indigo-400" />
              <span>Repeat question</span>
            </button>

            <button
              onClick={() => handleSend('Skip this question.')}
              disabled={isSubmitting}
              className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700 hover:border-slate-600 transition-colors shrink-0 flex items-center gap-1.5 disabled:opacity-50"
            >
              <FastForward className="w-3.5 h-3.5" />
              <span>Skip question</span>
            </button>
          </div>

          {/* Answer Input Area */}
          <div className="p-4 bg-slate-950 border-t border-slate-800 shrink-0 space-y-2">
            {errorMessage && (
              <div className="text-xs text-rose-400 bg-rose-950/40 p-2 rounded-lg border border-rose-500/30">
                {errorMessage}
              </div>
            )}

            <div className="relative">
              <textarea
                ref={textareaRef}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your technical answer here in natural English or code snippet... (Press Ctrl + Enter to submit)"
                rows={3}
                disabled={isSubmitting}
                className="w-full p-3.5 pb-10 bg-slate-900/90 border border-slate-700/80 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 resize-none font-sans placeholder-slate-500 disabled:opacity-50"
              />

              <div className="absolute right-3 bottom-3 flex items-center gap-2">
                <span className="text-[10px] text-slate-500 hidden sm:inline">
                  {userInput.length} chars • Ctrl + Enter to submit
                </span>

                <button
                  onClick={() => handleSend()}
                  disabled={isSubmitting || !userInput.trim()}
                  className="px-4 py-1.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-sky-500/20 transition-all flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span>Submit Answer</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal to End Interview Early */}
      {showEndConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm p-6 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">End Interview Early?</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to conclude this interview session? Your answers so far will be scored and compiled into your final performance report.
            </p>
            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setShowEndConfirm(false)}
                className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Continue Interview
              </button>
              <button
                onClick={() => {
                  setShowEndConfirm(false);
                  handleEndInterviewEarly();
                }}
                className="flex-1 py-2 px-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold"
              >
                Yes, End Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
