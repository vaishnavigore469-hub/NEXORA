import { type FC } from 'react';
import type { OrbState } from '../types';

interface AiOrbProps {
  state?: OrbState;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
}

export const AiOrb: FC<AiOrbProps> = ({
  state = 'idle',
  size = 'md',
  showLabel = true,
}) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-28 h-28',
    lg: 'w-40 h-40',
    xl: 'w-56 h-56',
  }[size];

  const coreSize = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-36 h-36',
  }[size];

  const stateDetails = {
    idle: {
      animationClass: 'orb-idle',
      gradient: 'from-cyan-500 via-sky-400 to-indigo-600',
      label: 'AI Interviewer Ready',
      textColor: 'text-cyan-300',
      statusDot: 'bg-cyan-400',
    },
    thinking: {
      animationClass: 'orb-thinking',
      gradient: 'from-violet-500 via-fuchsia-500 to-indigo-600',
      label: 'Synthesizing C++ Question...',
      textColor: 'text-violet-300',
      statusDot: 'bg-violet-400',
    },
    responding: {
      animationClass: 'orb-responding',
      gradient: 'from-emerald-400 via-teal-300 to-cyan-500',
      label: 'Delivering Feedback...',
      textColor: 'text-emerald-300',
      statusDot: 'bg-emerald-400',
    },
    evaluating: {
      animationClass: 'orb-evaluating',
      gradient: 'from-amber-400 via-rose-500 to-violet-600',
      label: 'Evaluating Technical Accuracy...',
      textColor: 'text-amber-300',
      statusDot: 'bg-amber-400',
    },
  }[state];

  return (
    <div className="flex flex-col items-center justify-center select-none">
      <div className={`relative flex items-center justify-center ${sizeClasses}`}>
        {/* Outer ambient blur */}
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-tr ${stateDetails.gradient} opacity-40 blur-xl ${stateDetails.animationClass}`}
        />

        {/* Rotating outer orbit ring */}
        <div
          className={`absolute inset-1 rounded-full border border-sky-400/30 ${stateDetails.animationClass}`}
          style={{ animationDuration: '6s' }}
        />

        {/* Inner core orb */}
        <div
          className={`relative rounded-full bg-gradient-to-br ${stateDetails.gradient} shadow-2xl flex items-center justify-center ${coreSize} ${stateDetails.animationClass}`}
        >
          {/* Neural nucleus highlight */}
          <div className="w-1/2 h-1/2 rounded-full bg-white/40 blur-[2px]" />
        </div>
      </div>

      {showLabel && (
        <div className="mt-3 flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700/60 backdrop-blur-md">
          <span className={`w-2 h-2 rounded-full animate-ping ${stateDetails.statusDot}`} />
          <span className={`text-xs font-medium tracking-wide ${stateDetails.textColor}`}>
            {stateDetails.label}
          </span>
        </div>
      )}
    </div>
  );
};
