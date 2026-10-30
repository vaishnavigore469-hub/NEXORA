import { type FC, useEffect, useState } from 'react';
import { BookOpen, Search, Sparkles, Play, ShieldAlert, Layers, CheckCircle2 } from 'lucide-react';
import type { CppTopic } from '../types';
import { fetchTopics } from '../services/api';

interface TopicsPageProps {
  onSelectTopicForInterview: (topicId: string) => void;
}

export const TopicsPage: FC<TopicsPageProps> = ({ onSelectTopicForInterview }) => {
  const [topics, setTopics] = useState<CppTopic[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchTopics();
        if (res.success) {
          setTopics(res.topics);
          setCategories(['All', ...res.categories]);
        }
      } catch (err) {
        console.error('Failed to load syllabus topics:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = topics.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subtopics.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      t.keyConcepts.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCat = selectedCategory === 'All' || t.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-500/10 border border-sky-400/20 text-sky-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Complete Technical Syllabus</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">40 Comprehensive C++ Topics</h1>
        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
          Explore the exhaustive C++ curriculum supported by NEXORA. Each topic includes verified technical rubrics, key architectural concepts, and live generative questioning.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search all 40 topics, subtopics, or concepts..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-white text-xs focus:outline-none focus:border-sky-500 placeholder-slate-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="py-2.5 px-3 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-sky-500 shrink-0"
          >
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Topics Grid */}
      {loading ? (
        <div className="text-center py-12 text-xs text-slate-400">Loading C++ syllabus curriculum...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((topic) => {
            const isSpecial = topic.id === 'exception-handling' || topic.id === 'templates';

            return (
              <div
                key={topic.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                  isSpecial
                    ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border-indigo-500/40 shadow-lg shadow-indigo-500/10'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase tracking-wider">
                      {topic.category}
                    </span>
                    {isSpecial && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-700">
                        College Activity Required
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-white">{topic.name}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{topic.description}</p>

                  {/* Subtopics */}
                  {topic.subtopics.length > 0 && (
                    <div className="pt-2 border-t border-slate-800/80 space-y-1">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Key Subtopics:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {topic.subtopics.map((sub, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md bg-slate-950 text-[10px] text-slate-300 border border-slate-800">
                            {sub}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-mono">ID: {topic.id}</span>
                  <button
                    onClick={() => onSelectTopicForInterview(topic.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 font-semibold text-xs border border-sky-400/30 transition-all flex items-center gap-1.5"
                  >
                    <Play className="w-3 h-3 fill-sky-300" />
                    <span>Practice Topic</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
