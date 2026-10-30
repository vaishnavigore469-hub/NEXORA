import { type FC, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  FastForward, 
  RotateCcw, 
  Clock, 
  LayoutDashboard, 
  Check, 
  Sparkles, 
  Target, 
  Layers, 
  BookOpen, 
  ChevronDown,
  TrendingUp,
  BrainCircuit
} from 'lucide-react';
import type { FinalInterviewReport } from '../types';

interface ReportPageProps {
  report: FinalInterviewReport;
  onStartAnother: () => void;
  onReturnDashboard: () => void;
  onViewHistory: () => void;
}

export const ReportPage: FC<ReportPageProps> = ({
  report,
  onStartAnother,
  onReturnDashboard,
  onViewHistory,
}) => {
  useEffect(() => {
    // Trigger celebratory confetti if score is >= 70
    if (report.finalScore >= 70) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#38bdf8', '#818cf8', '#34d399', '#f472b6']
        });
      } catch (e) {
        // Safe ignore
      }
    }
  }, [report.finalScore]);

  const getScoreVerdict = (score: number) => {
    if (score >= 90) return { title: 'Exceptional Performance!', subtitle: 'You demonstrated deep C++ technical mastery and precision.', color: 'text-emerald-400' };
    if (score >= 75) return { title: 'Strong Candidate!', subtitle: 'Solid understanding of core mechanics with minor room for optimization.', color: 'text-sky-400' };
    if (score >= 50) return { title: 'Good Effort — Keep Refining!', subtitle: 'You grasp the main concepts, but review missing points to master edge cases.', color: 'text-amber-400' };
    return { title: 'Foundational Review Recommended', subtitle: 'Focus on memory layout, pointer fundamentals, and structured syntax.', color: 'text-rose-400' };
  };

  const verdict = getScoreVerdict(report.finalScore);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* Hero Score Card */}
      <div className="relative overflow-hidden p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-indigo-950/40 border border-sky-500/25 shadow-2xl text-center">
        <div className="absolute top-0 right-1/2 translate-x-1/2 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-500/10 border border-sky-400/20 text-sky-400 text-xs font-semibold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5" />
            <span>Official Evaluation Report</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Interview Assessment for <span className="text-sky-400">{report.topicTitle}</span>
          </h1>

          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            Difficulty: <strong className="text-white">{report.initialDifficulty}</strong> • Completed in {Math.round(report.durationSeconds / 60)}m {report.durationSeconds % 60}s
          </p>

          {/* Central Circular Score Display */}
          <div className="py-6 flex flex-col items-center justify-center">
            <div className="relative flex items-center justify-center w-40 h-40 rounded-full bg-slate-950 border-4 border-sky-500/40 shadow-2xl shadow-sky-500/20">
              <div className="text-center">
                <span className="text-5xl font-black text-white tracking-tight">{report.finalScore}</span>
                <span className="text-slate-500 font-bold text-sm block">/ 100</span>
              </div>
            </div>

            <div className="mt-4">
              <h2 className={`text-xl font-bold ${verdict.color}`}>{verdict.title}</h2>
              <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">{verdict.subtitle}</p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onStartAnother}
              className="px-6 py-3 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-sky-500/20 transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Start Another Interview</span>
            </button>

            <button
              onClick={onReturnDashboard}
              className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>

            <button
              onClick={onViewHistory}
              className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2"
            >
              <Clock className="w-4 h-4" />
              <span>View All Past History</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Breakdown Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
          <div className="text-xs text-slate-400 mb-1">Total Questions</div>
          <div className="text-2xl font-black text-white">{report.totalQuestions}</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
          <div className="text-xs text-slate-400 mb-1">Attempted</div>
          <div className="text-2xl font-black text-sky-400">{report.questionsAttempted}</div>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 text-center">
          <div className="text-xs text-emerald-400 mb-1">Correct</div>
          <div className="text-2xl font-black text-emerald-300">{report.correctAnswers}</div>
        </div>

        <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/20 text-center">
          <div className="text-xs text-amber-400 mb-1">Partially Correct</div>
          <div className="text-2xl font-black text-amber-300">{report.partiallyCorrectAnswers}</div>
        </div>

        <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/20 text-center">
          <div className="text-xs text-rose-400 mb-1">Incorrect</div>
          <div className="text-2xl font-black text-rose-300">{report.incorrectAnswers}</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
          <div className="text-xs text-slate-400 mb-1">Skipped</div>
          <div className="text-2xl font-black text-slate-400">{report.skippedQuestions}</div>
        </div>
      </div>

      {/* Strengths & Weaknesses Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Identified Strengths */}
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5" />
            <h3>Demonstrated Technical Strengths</h3>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-300">
            {report.strengths.map((str, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <span className="leading-relaxed">{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Identified Areas for Improvement */}
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <AlertCircle className="w-5 h-5" />
            <h3>Areas Needing Reinforcement</h3>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-300">
            {report.weaknesses.map((weak, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                <span className="leading-relaxed">{weak}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Personalized Improvement Suggestions */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950/40 border border-indigo-500/20 space-y-4">
        <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm">
          <BrainCircuit className="w-5 h-5 text-indigo-400" />
          <h3>Personalized Actionable Next Steps</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {report.improvementSuggestions.map((sug, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 leading-relaxed">
              <span className="font-bold text-indigo-400 block mb-1">Step {idx + 1}</span>
              {sug}
            </div>
          ))}
        </div>
      </div>

      {/* Topic-wise breakdown */}
      {report.topicWisePerformance.length > 0 && (
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
          <h3 className="font-bold text-white text-sm">Topic-Wise Performance Breakdown</h3>
          <div className="space-y-3">
            {report.topicWisePerformance.map((stat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">{stat.topic}</span>
                  <span className="font-mono text-slate-400">{stat.marksAwarded} / {stat.maxMarks} Marks ({stat.percentage}%)</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      stat.percentage >= 80 ? 'bg-emerald-400' : stat.percentage >= 50 ? 'bg-sky-400' : 'bg-rose-400'
                    }`}
                    style={{ width: `${stat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Individual Question Review */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white">Comprehensive Question Review</h2>
          <p className="text-xs text-slate-400 mt-1">Review your exact responses against reference answers and AI critiques</p>
        </div>

        <div className="space-y-4">
          {report.questionReviews.map((rev) => (
            <div
              key={rev.questionIndex}
              className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4"
            >
              {/* Question header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-sky-500/20 text-sky-400 text-xs font-bold flex items-center justify-center">
                    Q{rev.questionIndex}
                  </span>
                  <span className="text-xs font-semibold text-slate-300">{rev.topic}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    {rev.difficulty}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                    rev.evaluationStatus === 'correct' ? 'text-emerald-300 bg-emerald-950/60 border-emerald-500/40' :
                    rev.evaluationStatus === 'partially_correct' ? 'text-amber-300 bg-amber-950/60 border-amber-500/40' :
                    rev.evaluationStatus === 'skipped' ? 'text-slate-400 bg-slate-800 border-slate-700' :
                    'text-rose-300 bg-rose-950/60 border-rose-500/40'
                  }`}>
                    {rev.evaluationStatus.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className="text-xs font-mono font-bold text-white">
                    {rev.marksAwarded} / {rev.maxMarks} pts
                  </span>
                </div>
              </div>

              {/* Question text */}
              <div className="text-sm font-semibold text-white">
                {rev.questionText}
              </div>

              {/* Student answer */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Your Answer:</span>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {rev.studentAnswer}
                </div>
              </div>

              {/* Expected answer */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider">Ideal Reference Answer:</span>
                <div className="p-3.5 rounded-xl bg-sky-950/20 border border-sky-500/20 text-xs text-sky-200 leading-relaxed">
                  {rev.expectedAnswer}
                </div>
              </div>

              {/* AI Feedback */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">AI Interviewer Critique:</span>
                <p className="leading-relaxed">{rev.aiFeedback}</p>

                {rev.followUp && (
                  <div className="pt-2 border-t border-slate-800/60 text-[11px] text-indigo-300">
                    <span className="font-semibold text-indigo-400">Follow-Up Note: </span>
                    {rev.followUp}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
