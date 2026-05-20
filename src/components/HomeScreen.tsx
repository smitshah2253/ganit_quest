import React from 'react';
import { Play, GraduationCap } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

interface HomeScreenProps {
  onStart: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onStart }) => {
  const { xp, stars } = useGameStore();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] p-4 relative overflow-hidden select-none">
      {/* Absolute decorative ambient light glows */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Modern glassmorphic status bar at the top */}
      <div className="absolute top-6 right-6 flex gap-5 bg-white/70 backdrop-blur-md px-5 py-3 rounded-2xl border border-slate-200/80 shadow-md">
        <div className="flex items-center gap-2">
          <span className="text-blue-600 font-semibold text-xs tracking-wider uppercase">Player XP</span>
          <span className="font-bold text-slate-800">{xp}</span>
        </div>
        <div className="w-px h-4 bg-slate-200 self-center" />
        <div className="flex items-center gap-2">
          <span className="text-yellow-500 text-sm">⭐</span>
          <span className="font-bold text-slate-800">{stars}</span>
        </div>
      </div>
      
      <div className="text-center space-y-10 max-w-xl p-8 rounded-3xl relative z-10">
        <div className="relative inline-flex items-center justify-center">
          <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-2xl animate-pulse" />
          <div className="bg-white/80 border border-slate-200/80 p-6 rounded-full shadow-lg relative">
            <GraduationCap className="w-20 h-20 text-blue-500" strokeWidth={1.5} />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-slate-850">
            MathQuest: Volume & Void
          </h1>
          <p className="text-base md:text-lg text-[var(--color-text-muted)] font-medium max-w-md mx-auto leading-relaxed">
            Master 3D geometry dimensions, surface areas, and volume formulas with real-time interactive models.
          </p>
        </div>

        <div>
          <button 
            onClick={onStart}
            className="group relative inline-flex items-center justify-center px-10 py-4 font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/20 cursor-pointer"
          >
            <span className="mr-2 text-sm tracking-wider uppercase font-bold">Start Learning</span>
            <Play className="w-4 h-4 group-hover:translate-x-0.5 transition-transform fill-current" />
          </button>
        </div>
      </div>
    </div>
  );
};
