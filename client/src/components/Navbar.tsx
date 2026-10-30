import { type FC, useState } from 'react';
import { Terminal, Settings, Menu, X, Sparkles, BookOpen, Clock, LayoutDashboard, Cpu, User, ChevronDown } from 'lucide-react';
import type { AiStatusResponse, UserProfile } from '../types';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  aiStatus: AiStatusResponse | null;
  user: UserProfile | null;
  onOpenSettings: () => void;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
}

export const Navbar: FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  aiStatus,
  user,
  onOpenSettings,
  onOpenAuth,
  onOpenProfile,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'landing', label: 'Home' },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'setup', label: 'Start Interview', icon: Sparkles },
    { id: 'topics', label: 'C++ Syllabus', icon: BookOpen },
    { id: 'history', label: 'History', icon: Clock },
  ];

  const handleNavClick = (id: string) => {
    setCurrentTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 w-full bg-slate-950/80 backdrop-blur-xl border-b border-sky-500/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Tagline */}
          <div
            onClick={() => handleNavClick('landing')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 p-[1px] shadow-lg shadow-sky-500/20 group-hover:shadow-sky-500/40 transition-shadow">
              <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                <Terminal className="w-5 h-5 text-sky-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-wider text-white bg-clip-text text-transparent bg-gradient-to-r from-white via-sky-200 to-sky-400">
                  NEXORA
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-400/30 uppercase tracking-widest">
                  AI
                </span>
              </div>
              <p className="text-[10px] font-medium tracking-widest text-slate-400 uppercase">
                Think. Answer. Evolve.
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'bg-sky-500/15 text-sky-300 border border-sky-400/30 shadow-inner'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  {Icon && <Icon className="w-3.5 h-3.5" />}
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Right Action: User Account + AI Status + Settings */}
          <div className="hidden sm:flex items-center gap-3">
            {/* User Account Button */}
            {user ? (
              <button
                onClick={onOpenProfile}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 hover:border-sky-500/50 text-slate-200 hover:text-white transition-all group"
                title="View Profile & Performance"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-[10px] font-black text-white">
                  {user.avatarSeed || user.name.slice(0, 2).toUpperCase()}
                </div>
                <span className="text-xs font-semibold max-w-[110px] truncate">{user.name.split(' ')[0]}</span>
                <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-sky-400 transition-colors" />
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-500/10 hover:bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-semibold transition-all hover:scale-105"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

            {/* AI Status Pill */}
            <button
              onClick={onOpenSettings}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                aiStatus?.isConfigured
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/50'
                  : 'bg-amber-950/40 border-amber-500/40 text-amber-300 hover:bg-amber-900/50'
              }`}
              title="Click to configure Gemini API Key or change AI engine mode"
            >
              <span className={`w-2 h-2 rounded-full animate-pulse ${aiStatus?.isConfigured ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              <span>{aiStatus?.mode === 'LIVE_AI' ? 'Live Gemini AI' : 'Demo Mode'}</span>
            </button>

            {/* Settings Icon */}
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900/80 border border-transparent hover:border-slate-800 transition-colors"
              title="AI Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-2">
            {user ? (
              <button
                onClick={onOpenProfile}
                className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white"
              >
                {user.avatarSeed || user.name.slice(0, 2).toUpperCase()}
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="p-1.5 rounded-lg text-sky-400 hover:bg-slate-900"
              >
                <User className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={onOpenSettings}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white"
            >
              <Cpu className="w-5 h-5 text-sky-400" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 space-y-1 bg-slate-950/95 border-b border-sky-500/20">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                  isActive
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-400/30'
                    : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                {Icon && <Icon className="w-4 h-4" />}
                {item.label}
              </button>
            );
          })}
          <div className="pt-2 border-t border-slate-800">
            {user ? (
              <button
                onClick={() => { onOpenProfile(); setMobileMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-sky-300 hover:bg-slate-900"
              >
                <User className="w-4 h-4" />
                Profile: {user.name}
              </button>
            ) : (
              <button
                onClick={() => { onOpenAuth(); setMobileMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-sky-300 hover:bg-slate-900"
              >
                <User className="w-4 h-4" />
                Sign In / Register
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
