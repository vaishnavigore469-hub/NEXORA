import { type FC } from 'react';
import { AiOrb } from '../components/AiOrb';
import { 
  Play, 
  BookOpen, 
  Sparkles, 
  CheckCircle2, 
  BrainCircuit, 
  Layers, 
  ShieldAlert, 
  Zap, 
  ArrowRight,
  Code2,
  Cpu
} from 'lucide-react';

interface LandingPageProps {
  onStartInterview: () => void;
  onExploreTopics: () => void;
  onGoToDashboard: () => void;
  isAiConfigured: boolean;
}

export const LandingPage: FC<LandingPageProps> = ({
  onStartInterview,
  onExploreTopics,
  onGoToDashboard,
  isAiConfigured,
}) => {
  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 overflow-hidden text-center">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-sky-500/15 via-indigo-500/10 to-violet-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
          {/* AI Orb Visual Centerpiece */}
          <div className="mb-8">
            <AiOrb size="lg" state="idle" showLabel={true} />
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-400/20 text-sky-300 text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Powered C++ Technical Mock Interviewer</span>
          </div>

          {/* Title and Tagline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6">
            Think. Answer.{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-cyan-300 to-indigo-400">
              Evolve.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            NEXORA is a next-generation AI interviewer designed to prepare students and software engineers for elite C++ technical interviews with real-time conceptual evaluation, adaptive questioning, and comprehensive feedback.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onStartInterview}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:via-blue-500 hover:to-indigo-500 text-white rounded-2xl font-bold text-sm tracking-wide shadow-xl shadow-sky-500/25 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2.5"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Launch Mock Interview</span>
            </button>

            <button
              onClick={onExploreTopics}
              className="w-full sm:w-auto px-7 py-4 bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 rounded-2xl font-semibold text-sm tracking-wide transition-all flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-sky-400" />
              <span>Explore C++ Syllabus</span>
            </button>

            <button
              onClick={onGoToDashboard}
              className="w-full sm:w-auto px-6 py-4 text-slate-400 hover:text-white rounded-2xl font-medium text-sm transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick status pill */}
          <div className="mt-8 text-xs text-slate-400 flex items-center justify-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isAiConfigured ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
            <span>
              {isAiConfigured 
                ? 'Live Google Gemini AI Evaluation Active' 
                : 'Demo Mode Active (Local Verified C++ Technical Engine)'}
            </span>
          </div>
        </div>
      </section>

      {/* College Activity Spotlight Cards: Exception Handling & Templates */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <div className="inline-block px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-2">
            College Curricular Focus
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Dedicated Core Interview Modules</h2>
          <p className="text-sm text-slate-400 mt-2 max-w-xl mx-auto">
            Specifically tailored for university academic requirements with deep question banks and custom AI evaluation rubrics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Module 1: Exception Handling */}
          <div className="glass-panel p-6 rounded-2xl border border-sky-500/20 hover:border-sky-500/40 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-400/30 text-sky-400">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-950 text-sky-300 border border-sky-800">
                Essential Activity
              </span>
            </div>

            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-sky-300 transition-colors">
              Exception Handling in C++
            </h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Master structured error handling: try, throw, catch mechanisms, sequential multiple catch resolution, universal `catch(...)`, nested try blocks with `throw;` re-throwing, stack unwinding, and custom exceptions derived from `std::exception`.
            </p>

            <div className="space-y-1.5 text-xs text-slate-300 mb-5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                <span>try, throw, and catch mechanics</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                <span>Multiple catch blocks & derived before base ordering</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                <span>Nested try blocks & stack unwinding resource safety</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                <span>Custom exception classes overriding `what() const noexcept`</span>
              </div>
            </div>

            <button
              onClick={onStartInterview}
              className="w-full py-2.5 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 font-semibold text-xs border border-sky-400/30 transition-all flex items-center justify-center gap-2"
            >
              <span>Practice Exception Handling</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Module 2: Templates & Generic Programming */}
          <div className="glass-panel p-6 rounded-2xl border border-indigo-500/20 hover:border-indigo-500/40 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-400/30 text-indigo-400">
                <Layers className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800">
                Essential Activity
              </span>
            </div>

            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
              Templates & Generic Programming
            </h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Compile-time metaprogramming and type independence: function templates, class templates, non-type template parameters (fixed-size buffers), full and partial specialization, and header inclusion models.
            </p>

            <div className="space-y-1.5 text-xs text-slate-300 mb-5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Function templates with automatic type deduction</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Class templates & multi-parameter generic containers</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Non-type template parameters (e.g. `template&lt;typename T, int Size&gt;`)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Full & partial template specialization techniques</span>
              </div>
            </div>

            <button
              onClick={onStartInterview}
              className="w-full py-2.5 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 font-semibold text-xs border border-indigo-400/30 transition-all flex items-center justify-center gap-2"
            >
              <span>Practice Templates</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Why NEXORA Outperforms Standard Chatbots</h2>
          <p className="text-sm text-slate-400 mt-2 max-w-xl mx-auto">
            Built from the ground up as a dedicated technical interview platform with pedagogical intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors">
            <div className="p-3 w-fit rounded-xl bg-cyan-500/10 text-cyan-400 mb-4">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Conceptual Understanding</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Evaluates answers written in simple English, recognizing underlying technical meaning rather than demanding verbatim textbook phrasing.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors">
            <div className="p-3 w-fit rounded-xl bg-sky-500/10 text-sky-400 mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Intelligent Follow-ups</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Probes deeper into edge cases, optimization, or memory implications when you answer well, mimicking real senior engineer interviews.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors">
            <div className="p-3 w-fit rounded-xl bg-indigo-500/10 text-indigo-400 mb-4">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Adaptive Difficulty</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automatically steps up from Beginner to Advanced when you demonstrate mastery, or provides scaffolding when you encounter difficulty.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors">
            <div className="p-3 w-fit rounded-xl bg-violet-500/10 text-violet-400 mb-4">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Natural Clarification</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ask "Can you give me a hint?", "Explain the question", or "Repeat". Clarifications never count as answers or deduct marks.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors">
            <div className="p-3 w-fit rounded-xl bg-emerald-500/10 text-emerald-400 mb-4">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Structured Evaluation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pinpoints exact points you explained correctly, key concepts you missed, and misconceptions with marks breakdown out of 10.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors">
            <div className="p-3 w-fit rounded-xl bg-amber-500/10 text-amber-400 mb-4">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Complete 40-Topic Syllabus</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              From pointers, references, and memory allocation to OOP, virtual functions, STL algorithms, move semantics, and modern C++20.
            </p>
          </div>
        </div>
      </section>

      {/* How it works 4-step */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">How An Interview Session Works</h2>
          <p className="text-sm text-slate-400 mt-2">
            Structured, intuitive, and realistic from start to finish.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 text-center">
            <div className="w-8 h-8 rounded-full bg-sky-500/20 text-sky-400 font-bold flex items-center justify-center mx-auto mb-3 text-sm">
              1
            </div>
            <h4 className="font-semibold text-white text-sm mb-1">Select Preferences</h4>
            <p className="text-xs text-slate-400">Choose syllabus topic, difficulty (Beginner to Adaptive), and interview length.</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 text-center">
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center mx-auto mb-3 text-sm">
              2
            </div>
            <h4 className="font-semibold text-white text-sm mb-1">Engage with AI</h4>
            <p className="text-xs text-slate-400">One question at a time. Natural answers, code reasoning, or ask for hints.</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 text-center">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center mx-auto mb-3 text-sm">
              3
            </div>
            <h4 className="font-semibold text-white text-sm mb-1">Instant Critique</h4>
            <p className="text-xs text-slate-400">Receive fair marks, correct/missing points breakdown, and intelligent follow-ups.</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 text-center">
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center mx-auto mb-3 text-sm">
              4
            </div>
            <h4 className="font-semibold text-white text-sm mb-1">In-Depth Report</h4>
            <p className="text-xs text-slate-400">Score out of 100, identified strengths, weaknesses, and question-by-question review.</p>
          </div>
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={onStartInterview}
            className="px-8 py-3.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-sky-500/20 transition-all inline-flex items-center gap-2"
          >
            <span>Start Your First Interview Session</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
