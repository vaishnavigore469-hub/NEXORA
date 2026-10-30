import { type FC, useEffect, useState } from 'react';
import { 
  Play, 
  BookOpen, 
  Clock, 
  Award, 
  TrendingUp, 
  CheckCircle, 
  ArrowRight,
  ShieldAlert,
  Layers,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { getOverallStats, getRecentSessions } from '../services/api';

import type { UserProfile } from '../types';

interface DashboardPageProps {
  onStartNewInterview: (topicId?: string) => void;
  onExploreTopics: () => void;
  onViewHistory: () => void;
  onOpenReport: (sessionId: string) => void;
  user?: UserProfile | null;
  onOpenAuth?: () => void;
  onOpenProfile?: () => void;
}

export const DashboardPage: FC<DashboardPageProps> = ({
  onStartNewInterview,
  onExploreTopics,
  onViewHistory,
  onOpenReport,
  user,
  onOpenAuth,
  onOpenProfile,
}) => {
  const [stats, setStats] = useState<{
    totalInterviews: number;
    averageScore: number;
    highestScore: number;
    topicsCovered: number;
  }>({
    totalInterviews: 0,
    averageScore: 0,
    highestScore: 0,
    topicsCovered: 0,
  });

  const [recentSessions, setRecentSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [statsRes, historyRes] = await Promise.all([
          getOverallStats(),
          getRecentSessions(),
        ]);
        if (statsRes.success) setStats(statsRes.stats);
        if (historyRes.success) setRecentSessions(historyRes.sessions);
      } catch (err) {
        console.error('Error loading dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const getScoreColor = (score: number | null) => {
    if (score === null || score === undefined) return 'text-slate-400 bg-slate-900 border-slate-700';
    if (score >= 80) return 'text-emerald-400 bg-emerald-950/60 border-emerald-500/40';
    if (score >= 60) return 'text-cyan-400 bg-cyan-950/60 border-cyan-500/40';
    if (score >= 40) return 'text-amber-400 bg-amber-950/60 border-amber-500/40';
    return 'text-rose-400 bg-rose-950/60 border-rose-500/40';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-indigo-950/40 border border-sky-500/20 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sky-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>{user ? `Candidate Hub • ${user.experienceLevel} Track` : 'Student Performance Hub'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {user ? (
                <>Welcome back, <span className="text-sky-400">{user.name.split(' ')[0]}</span></>
              ) : (
                <>Welcome to <span className="text-sky-400">NEXORA</span></>
              )}
            </h1>
            <p className="text-sm text-slate-300 max-w-xl">
              {user ? (
                `Targeting ${user.targetRole}. Sharpen your low-level mechanics, exception guarantees, and modern C++ abstractions with adaptive AI interviews.`
              ) : (
                'Sharpen your C++ technical knowledge with simulated real-world questions, instant conceptual critique, and adaptive follow-up challenges.'
              )}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {!user && onOpenAuth && (
              <button
                onClick={onOpenAuth}
                className="px-4 py-3 bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 transition-all"
              >
                Sign In to Save History
              </button>
            )}
            <button
              onClick={() => onStartNewInterview()}
              className="px-6 py-3.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-sky-500/20 transition-all flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Start New Interview</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Completed Sessions</span>
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            {loading ? '-' : stats.totalInterviews}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Total interviews conducted</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Average Score</span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            {loading ? '-' : `${stats.averageScore}%`}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Across all attempted topics</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Highest Score</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            {loading ? '-' : `${stats.highestScore}%`}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Personal record</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Topics Explored</span>
            <div className="p-2 rounded-lg bg-violet-500/10 text-violet-400">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            {loading ? '-' : `${stats.topicsCovered} / 40`}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Syllabus coverage</div>
        </div>
      </div>

      {/* Recommended Quick Topics */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-white">Recommended Practice Modules</h2>
            <p className="text-xs text-slate-400">Jump right into high-yield interview topics</p>
          </div>
          <button
            onClick={onExploreTopics}
            className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1"
          >
            <span>View All 40 Topics</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Complete Syllabus */}
          <div
            onClick={() => onStartNewInterview('all')}
            className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 hover:border-sky-500/40 cursor-pointer transition-all hover:-translate-y-0.5 group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800 uppercase">
                Comprehensive
              </span>
              <Play className="w-4 h-4 text-slate-600 group-hover:text-sky-400 transition-colors" />
            </div>
            <h3 className="font-bold text-white text-sm mb-1 group-hover:text-sky-300 transition-colors">
              Complete C++ Syllabus
            </h3>
            <p className="text-xs text-slate-400 line-clamp-2">
              Full spectrum evaluation spanning core fundamentals, OOP, pointers, STL, and exceptions.
            </p>
          </div>

          {/* Exception Handling (Required) */}
          <div
            onClick={() => onStartNewInterview('exception-handling')}
            className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 hover:border-sky-500/40 cursor-pointer transition-all hover:-translate-y-0.5 group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5 text-sky-400 text-xs font-semibold">
                <ShieldAlert className="w-4 h-4" />
                <span>College Activity</span>
              </div>
              <Play className="w-4 h-4 text-slate-600 group-hover:text-sky-400 transition-colors" />
            </div>
            <h3 className="font-bold text-white text-sm mb-1 group-hover:text-sky-300 transition-colors">
              Exception Handling
            </h3>
            <p className="text-xs text-slate-400 line-clamp-2">
              try, throw, catch, multiple catches, nested try blocks, stack unwinding, custom exceptions.
            </p>
          </div>

          {/* Templates (Required) */}
          <div
            onClick={() => onStartNewInterview('templates')}
            className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 hover:border-indigo-500/40 cursor-pointer transition-all hover:-translate-y-0.5 group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5 text-indigo-400 text-xs font-semibold">
                <Layers className="w-4 h-4" />
                <span>College Activity</span>
              </div>
              <Play className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 transition-colors" />
            </div>
            <h3 className="font-bold text-white text-sm mb-1 group-hover:text-indigo-300 transition-colors">
              Templates & Generic Code
            </h3>
            <p className="text-xs text-slate-400 line-clamp-2">
              Function & class templates, non-type template parameters, full and partial specialization.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Interview Sessions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-white">Recent Interview Sessions</h2>
            <p className="text-xs text-slate-400">Review past evaluations and study areas of improvement</p>
          </div>
          {recentSessions.length > 0 && (
            <button
              onClick={onViewHistory}
              className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1"
            >
              <span>View All History</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {recentSessions.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 text-center">
            <Award className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-white mb-1">No Interviews Completed Yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
              Take your first technical mock interview session to unlock your score analysis and personalized learning path.
            </p>
            <button
              onClick={() => onStartNewInterview()}
              className="px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-xs font-semibold transition-all inline-flex items-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Launch Mock Interview</span>
            </button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl bg-slate-900/60 border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Topic</th>
                  <th className="px-5 py-3.5">Difficulty</th>
                  <th className="px-5 py-3.5">Date</th>
                  <th className="px-5 py-3.5">Score</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {recentSessions.map((session) => {
                  const dateStr = new Date(session.start_time).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <tr key={session.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-white">{session.topic_title}</div>
                        <div className="text-[11px] text-slate-400">{session.target_questions} questions</div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                          {session.difficulty}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-400">{dateStr}</td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getScoreColor(session.final_score)}`}>
                          {session.final_score !== null ? `${session.final_score}/100` : 'In Progress'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => onOpenReport(session.id)}
                          className="px-3 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 hover:text-sky-300 border border-sky-400/20 text-xs font-medium transition-all inline-flex items-center gap-1.5"
                        >
                          <span>Review</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
