import { type FC, useState, useEffect } from 'react';
import { 
  Play, 
  Sparkles, 
  Check, 
  Search, 
  Layers, 
  ShieldAlert, 
  Cpu, 
  BookOpen, 
  SlidersHorizontal 
} from 'lucide-react';
import type { Difficulty, InterviewLength, CppTopic } from '../types';
import { fetchTopics, startInterviewSession } from '../services/api';

interface SetupPageProps {
  initialTopicId?: string;
  onSessionStarted: (session: any) => void;
  onCancel: () => void;
}

export const SetupPage: FC<SetupPageProps> = ({
  initialTopicId = 'all',
  onSessionStarted,
  onCancel,
}) => {
  const [topics, setTopics] = useState<CppTopic[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState<string>(initialTopicId);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('Adaptive');
  const [selectedLength, setSelectedLength] = useState<InterviewLength>(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTopics() {
      try {
        const res = await fetchTopics();
        if (res.success) {
          setTopics(res.topics);
        }
      } catch (err: any) {
        console.error('Failed to load topics:', err);
      }
    }
    loadTopics();
  }, []);

  const categories = ['All', 'Comprehensive', 'Advanced & Core Activity', 'Object-Oriented Programming', 'Memory & Pointers', 'STL & Data Structures', 'Fundamentals', 'Control Flow', 'Functions', 'Modern C++'];

  const filteredTopics = topics.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subtopics.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleStart = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await startInterviewSession({
        topicId: selectedTopicId,
        difficulty: selectedDifficulty,
        targetQuestions: selectedLength,
      });

      if (res.success && res.session) {
        onSessionStarted(res.session);
      } else {
        setError('Failed to initiate interview session.');
      }
    } catch (err: any) {
      setError(err.message || 'Error communicating with interview server.');
    } finally {
      setIsLoading(false);
    }
  };

  const difficultyOptions: { id: Difficulty; label: string; desc: string; color: string }[] = [
    {
      id: 'Beginner',
      label: 'Beginner',
      desc: 'Fundamental definitions, syntax, and foundational semantics.',
      color: 'border-emerald-500/40 text-emerald-400',
    },
    {
      id: 'Intermediate',
      label: 'Intermediate',
      desc: 'Conceptual understanding, structural trade-offs, and practical code patterns.',
      color: 'border-cyan-500/40 text-cyan-400',
    },
    {
      id: 'Advanced',
      label: 'Advanced',
      desc: 'Low-level memory implications, virtual tables, template metaprogramming, edge cases.',
      color: 'border-violet-500/40 text-violet-400',
    },
    {
      id: 'Adaptive',
      label: 'Adaptive (AI Guided)',
      desc: 'Dynamically scales question complexity in real-time based on your answers.',
      color: 'border-sky-500/50 text-sky-300 bg-sky-950/20',
    },
  ];

  const lengthOptions: { length: InterviewLength; label: string; time: string }[] = [
    { length: 5, label: '5 Questions', time: '~10 mins (Rapid Check)' },
    { length: 10, label: '10 Questions', time: '~20 mins (Standard Mock)' },
    { length: 15, label: '15 Questions', time: '~35 mins (Full Technical Assessment)' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/20 text-sky-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Interview Configuration</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Configure Your Mock Interview</h1>
        <p className="text-xs text-slate-400 mt-1">Select your target C++ syllabus topic, desired difficulty, and interview length.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-300 text-xs">
          {error}
        </div>
      )}

      <div className="space-y-8">
        {/* Step 1: Topic Selection */}
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 text-xs flex items-center justify-center font-bold">1</span>
              <span>Select C++ Syllabus Topic</span>
            </h2>
            <span className="text-xs text-slate-400 font-mono">
              {filteredTopics.length} of {topics.length} topics
            </span>
          </div>

          {/* Search & Category Filter */}
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics, keywords (e.g. try-catch, templates, virtual)..."
                className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-xs focus:outline-none focus:border-sky-500 placeholder-slate-500"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="py-2 px-3 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-sky-500"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Topic selection chips grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
            {filteredTopics.map((topic) => {
              const isSelected = selectedTopicId === topic.id;
              const isRequiredModule = topic.id === 'exception-handling' || topic.id === 'templates';

              return (
                <div
                  key={topic.id}
                  onClick={() => setSelectedTopicId(topic.id)}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex items-start justify-between gap-2 ${
                    isSelected
                      ? 'bg-sky-500/15 border-sky-400 shadow-md shadow-sky-500/10'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`text-xs font-semibold ${isSelected ? 'text-sky-300' : 'text-slate-200'}`}>
                        {topic.name}
                      </span>
                      {isRequiredModule && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-900/60 text-indigo-300 border border-indigo-700/60">
                          College Activity
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-1 leading-snug">
                      {topic.description}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="p-1 rounded-full bg-sky-500 text-white shrink-0 mt-0.5">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2: Difficulty Selection */}
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 text-xs flex items-center justify-center font-bold">2</span>
            <span>Select Interview Difficulty</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {difficultyOptions.map((opt) => {
              const isSelected = selectedDifficulty === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => setSelectedDifficulty(opt.id)}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? `bg-slate-800/90 ${opt.color} shadow-lg ring-1 ring-sky-500`
                      : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-xs">{opt.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-sky-400" />}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">{opt.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 3: Interview Length Selection */}
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 text-xs flex items-center justify-center font-bold">3</span>
            <span>Select Interview Length</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {lengthOptions.map((opt) => {
              const isSelected = selectedLength === opt.length;
              return (
                <div
                  key={opt.length}
                  onClick={() => setSelectedLength(opt.length)}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-sky-500/15 border-sky-400 text-sky-300 ring-1 ring-sky-400'
                      : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm">{opt.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-sky-400" />}
                  </div>
                  <div className="text-xs text-slate-400">{opt.time}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={onCancel}
            className="px-5 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors text-xs font-semibold"
          >
            Cancel
          </button>

          <button
            onClick={handleStart}
            disabled={isLoading || !selectedTopicId}
            className="px-8 py-3.5 bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white rounded-xl font-bold text-sm shadow-xl shadow-sky-500/25 transition-all flex items-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span>Initializing Interview Room...</span>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Begin Technical Interview</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
