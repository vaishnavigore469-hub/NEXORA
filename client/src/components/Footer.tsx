import { type FC } from 'react';
import { Terminal, Shield, Award, Cpu, BookCheck } from 'lucide-react';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
}

export const Footer: FC<FooterProps> = ({ setCurrentTab }) => {
  return (
    <footer className="w-full mt-24 border-t border-slate-800/80 bg-slate-950/90 text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        {/* Brand column */}
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400">
              <Terminal className="w-4 h-4" />
            </div>
            <span className="font-bold text-white tracking-wider text-base">NEXORA</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            AI-powered C++ technical mock interview platform helping students and software engineers prepare for rigorous technical interviews.
          </p>
          <div className="text-[11px] text-sky-400/80 font-mono">Think. Answer. Evolve.</div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">Navigation</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => setCurrentTab('landing')} className="hover:text-sky-400 transition-colors">
                Platform Overview
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentTab('dashboard')} className="hover:text-sky-400 transition-colors">
                Student Dashboard
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentTab('setup')} className="hover:text-sky-400 transition-colors">
                Launch Mock Interview
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentTab('topics')} className="hover:text-sky-400 transition-colors">
                Explore 40 C++ Topics
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentTab('history')} className="hover:text-sky-400 transition-colors">
                Interview History & Reports
              </button>
            </li>
          </ul>
        </div>

        {/* College Activity Highlights */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">Core College Focus</h4>
          <ul className="space-y-2 text-xs">
            <li className="flex items-center gap-1.5 text-sky-300">
              <BookCheck className="w-3.5 h-3.5 text-sky-400" />
              <span>Exception Handling (try-catch, nested, custom)</span>
            </li>
            <li className="flex items-center gap-1.5 text-sky-300">
              <BookCheck className="w-3.5 h-3.5 text-sky-400" />
              <span>Templates & Generic Classes</span>
            </li>
            <li className="flex items-center gap-1.5 text-slate-400">
              <Award className="w-3.5 h-3.5 text-indigo-400" />
              <span>Virtual Tables (VTABLE & VPTR)</span>
            </li>
            <li className="flex items-center gap-1.5 text-slate-400">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span>Diamond Problem & Virtual Base</span>
            </li>
            <li className="flex items-center gap-1.5 text-slate-400">
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              <span>Standard Template Library (STL)</span>
            </li>
          </ul>
        </div>

        {/* Evaluation Engine */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">AI Intelligence</h4>
          <p className="text-xs text-slate-400 leading-relaxed mb-3">
            Powered by Google Gemini 2.5 Flash with structured JSON evaluation and deterministic fallback to local verified technical analysis.
          </p>
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
            <span className="text-emerald-400 font-semibold">Adaptive Engine:</span> Adjusts question complexity dynamically based on student response accuracy.
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
        <div>© 2026 NEXORA AI. All technical evaluations verified.</div>
        <div className="flex items-center gap-4 mt-4 sm:mt-0">
          <span>C++20 Ready</span>
          <span>•</span>
          <span>SQLite Persistent</span>
          <span>•</span>
          <span>Google Gemini API</span>
        </div>
      </div>
    </footer>
  );
};
