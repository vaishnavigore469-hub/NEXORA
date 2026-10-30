import { type FC, useState, useEffect } from 'react';
import { X, User, Briefcase, Award, TrendingUp, LogOut, CheckCircle2, Edit3, Save } from 'lucide-react';
import { apiGetUserStats, apiUpdateProfile, apiLogout } from '../services/api';
import type { UserProfile, UserStatistics } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUserUpdated: (updatedUser: UserProfile) => void;
  onLogout: () => void;
}

export const ProfileModal: FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onUserUpdated,
  onLogout,
}) => {
  const [stats, setStats] = useState<UserStatistics | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [targetRole, setTargetRole] = useState(user.targetRole);
  const [experienceLevel, setExperienceLevel] = useState(user.experienceLevel);
  const [bio, setBio] = useState(user.bio || '');
  const [isSaving, setIsSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setName(user.name);
      setTargetRole(user.targetRole);
      setExperienceLevel(user.experienceLevel);
      setBio(user.bio || '');
      loadStats();
    }
  }, [isOpen, user]);

  const loadStats = async () => {
    try {
      const res = await apiGetUserStats();
      if (res.success && res.stats) {
        setStats(res.stats);
      }
    } catch (e) {
      console.warn('Could not load user stats:', e);
    }
  };

  if (!isOpen) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMsg(null);
    try {
      const res = await apiUpdateProfile({ name, targetRole, experienceLevel, bio });
      if (res.success && res.user) {
        onUserUpdated(res.user);
        setIsEditing(false);
        setMsg({ type: 'success', text: 'Profile updated successfully!' });
      } else {
        setMsg({ type: 'error', text: res.error || 'Failed to update profile.' });
      }
    } catch (err: any) {
      setMsg({ type: 'error', text: err.message || 'Error saving changes.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    await apiLogout();
    onLogout();
    onClose();
  };

  const targetRoles = [
    'C++ Software Engineer',
    'High-Performance Systems Engineer',
    'Quantitative Developer / HFT',
    'Game Engine Programmer (Unreal / Custom)',
    'Embedded & Robotics C++ Developer',
    'Computer Vision & Graphics Engineer',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-900/95 border border-sky-500/20 shadow-2xl shadow-sky-500/10 p-6 sm:p-8 custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow corner */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800/80 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Candidate Profile Header */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-sky-500/20">
            {user.avatarSeed || user.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white truncate">{user.name}</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30">
                {user.experienceLevel}
              </span>
            </div>
            <p className="text-xs text-sky-400/90 font-medium truncate mt-0.5">{user.targetRole}</p>
            <p className="text-[11px] text-slate-500 truncate mt-0.5">{user.email}</p>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`p-2 rounded-xl text-xs font-semibold border transition-all ${
              isEditing 
                ? 'bg-slate-800 text-slate-200 border-slate-700' 
                : 'bg-sky-500/10 text-sky-300 border-sky-500/30 hover:bg-sky-500/20'
            }`}
            title="Edit profile information"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        </div>

        {/* Status Message */}
        {msg && (
          <div className={`mb-4 p-3 rounded-xl border text-xs flex items-center gap-2 ${
            msg.type === 'success' 
              ? 'bg-emerald-950/50 border-emerald-500/30 text-emerald-200' 
              : 'bg-red-950/50 border-red-500/30 text-red-200'
          }`}>
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{msg.text}</span>
          </div>
        )}

        {/* Edit Profile Form OR Stats View */}
        {isEditing ? (
          <form onSubmit={handleSaveProfile} className="space-y-4 mb-6">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Target Engineering Role</label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500 transition-colors cursor-pointer"
              >
                {targetRoles.map((role) => (
                  <option key={role} value={role} className="bg-slate-900 text-white">
                    {role}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Experience Level</label>
              <div className="grid grid-cols-3 gap-2">
                {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setExperienceLevel(lvl)}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                      experienceLevel === lvl
                        ? 'bg-sky-500/20 text-sky-300 border-sky-400/50 shadow-inner'
                        : 'bg-slate-950/40 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Bio / Technical Focus</label>
              <textarea
                rows={3}
                placeholder="Briefly state your C++ focus (e.g., low-latency systems, modern C++20, concurrency, template metaprogramming)..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500 transition-colors resize-none"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-400 text-slate-950 transition-colors flex items-center justify-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            {/* Technical Readiness Badge */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-sky-950/40 to-indigo-950/40 border border-sky-500/20 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-wider font-bold text-sky-400">Readiness Rating</p>
                <p className="text-sm font-black text-white mt-0.5">{stats?.readinessRating || 'Progressing'}</p>
              </div>
              <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-300 text-xs font-semibold">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Score: {stats?.averageScore || 0}%</span>
              </div>
            </div>

            {/* Performance Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Interviews</p>
                <p className="text-lg font-black text-white mt-1">{stats?.totalInterviews || 0}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Average</p>
                <p className="text-lg font-black text-sky-400 mt-1">{stats?.averageScore || 0}%</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Peak Score</p>
                <p className="text-lg font-black text-emerald-400 mt-1">{stats?.highestScore || 0}%</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Topics</p>
                <p className="text-lg font-black text-indigo-400 mt-1">{stats?.topicsCovered || 0}</p>
              </div>
            </div>

            {/* Top Strengths */}
            {stats && stats.topStrengths && stats.topStrengths.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-sky-400" />
                  Demonstrated Competencies
                </h4>
                <div className="space-y-1.5">
                  {stats.topStrengths.map((str, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 shrink-0" />
                      <span>{str}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {user.bio && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">About Candidate</h4>
                <p className="text-xs text-slate-300 italic bg-slate-950/40 p-3 rounded-xl border border-slate-800/80">
                  "{user.bio}"
                </p>
              </div>
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-950/40 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
