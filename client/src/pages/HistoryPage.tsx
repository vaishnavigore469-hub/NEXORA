import { type FC, useEffect, useState } from 'react';
import { Clock, Award, ExternalLink, Play, Search, ArrowRight, ShieldAlert, Layers } from 'lucide-react';
import { getRecentSessions } from '../services/api';
import type { UserProfile } from '../types';

interface HistoryPageProps {
  onOpenReport: (sessionId: string) => void;
  onStartNewInterview: (topicId?: string) => void;
  user?: UserProfile | null;
  onOpenAuth?: () => void;
}

export const HistoryPage: FC<HistoryPageProps> = ({
  onOpenReport,
  onStartNewInterview,
  user,
  onOpenAuth,
}) => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadHistory() {
      try {
        const res = await getRecentSessions();
        if (res.success) {
          setSessions(res.sessions);
        }
      } catch (err) {
        console.error('Failed to load history:', err);
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, []);

  const filteredSessions = sessions.filter(s =>
    s.topic_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.difficulty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getScoreBadge = (score: number | null) => {
    if (score === null || score === undefined) {
      return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-400">In Progress</span>;
    }
    if (score >= 80) {
      return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40">{score}/100</span>;
    }
    if (score >= 60) {
      return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-sky-950 text-sky-300 border border-sky-500/40">{score}/100</span>;
    }
    if (score >= 40) {
      return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-950 text-amber-300 border border-amber-500/40">{score}/100</span>;
    }
    return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-950 text-rose-300 border border-rose-500/40">{score}/100</span>;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/20 text-sky-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Clock className="w-3.5 h-3.5" />
            <span>Persistent SQLite History</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {user ? `${user.name.split(' ')[0]}'s Interview Archive` : 'Interview Records'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {user ? `Candidate: ${user.name} • ${user.targetRole}` : 'Review past scores, technical feedback, and questions asked.'}
          </p>
        </div>

        <button
          onClick={() => onStartNewInterview()}
          className="px-5 py-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-sky-500/20 transition-all flex items-center gap-2 shrink-0 self-start sm:self-auto"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          <span>New Interview</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter past interviews by topic or difficulty..."
          className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-sky-500 placeholder-slate-500"
        />
      </div>

      {/* History List Table */}
      {loading ? (
        <div className="text-center py-12 text-xs text-slate-400">Loading interview records...</div>
      ) : filteredSessions.length === 0 ? (
        <div className="p-10 rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 text-center space-y-3">
          <Award className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-semibold text-white">No Sessions Match Your Search</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Take an interview session to build up your history and analyze your progress over time.
          </p>
          <button
            onClick={() => onStartNewInterview()}
            className="px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-xs font-semibold"
          >
            Start Mock Interview
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl bg-slate-900/70 border border-slate-800 shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-5 py-4">Topic / Syllabus Focus</th>
                <th className="px-5 py-4">Difficulty</th>
                <th className="px-5 py-4">Date & Time</th>
                <th className="px-5 py-4">Final Score</th>
                <th className="px-5 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredSessions.map((session) => {
                const date = new Date(session.start_time);
                const isSpecial = session.topic_id === 'exception-handling' || session.topic_id === 'templates';

                return (
                  <tr key={session.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white text-sm">{session.topic_title}</span>
                        {isSpecial && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                            College Activity
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Target length: {session.target_questions} questions
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                        {session.difficulty}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-400">
                      <div>{date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                      <div className="text-[10px] text-slate-500">{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </td>
                    <td className="px-5 py-4">
                      {getScoreBadge(session.final_score)}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => onOpenReport(session.id)}
                        className="px-3.5 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 hover:text-sky-300 border border-sky-400/20 text-xs font-semibold transition-all inline-flex items-center gap-1.5"
                      >
                        <span>Open Report</span>
                        <ExternalLink className="w-3.5 h-3.5" />
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
  );
};
