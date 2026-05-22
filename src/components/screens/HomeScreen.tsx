import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, GraduationCap, Award, LogOut } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { useAuthStore } from '../../store/authStore';

export const HomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { xp, stars } = useGameStore();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] p-3 sm:p-4 relative overflow-hidden select-none">
      {/* Saffron & Green decorative ambient lights for Indian theme */}
      <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-80 sm:h-80 bg-orange-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-56 h-56 sm:w-96 sm:h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Modern glassmorphic status bar at the top */}
      <div className="absolute top-4 sm:top-6 right-3 sm:right-6 flex gap-3 sm:gap-5 bg-white/70 backdrop-blur-md px-3 sm:px-5 py-2 sm:py-3 rounded-xl sm:rounded-2xl border border-slate-200/80 shadow-md">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-orange-600 font-semibold text-[10px] sm:text-xs tracking-wider uppercase hidden sm:inline">Player XP</span>
          <span className="text-orange-600 font-semibold text-[10px] sm:text-xs tracking-wider uppercase sm:hidden">XP</span>
          <span className="font-bold text-slate-800 text-sm sm:text-base">{xp}</span>
        </div>
        <div className="w-px h-3 sm:h-4 bg-slate-200 self-center" />
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-yellow-500 text-xs sm:text-sm">⭐</span>
          <span className="font-bold text-slate-800 text-sm sm:text-base">{stars}</span>
        </div>
        <div className="w-px h-3 sm:h-4 bg-slate-200 self-center" />
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 sm:gap-2 text-slate-600 hover:text-red-600 transition-colors"
          title="Logout"
        >
          <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="text-[10px] sm:text-xs font-semibold hidden sm:inline">Logout</span>
        </button>
      </div>
      
      <div className="text-center space-y-6 sm:space-y-10 max-w-xl p-5 sm:p-8 rounded-2xl sm:rounded-3xl relative z-10">
        <div className="relative inline-flex items-center justify-center">
          <div className="absolute inset-0 bg-orange-400/20 rounded-full blur-2xl animate-pulse" />
          <div className="bg-white/80 border border-slate-200/80 p-4 sm:p-6 rounded-full shadow-lg relative">
            {/* GanitQuest Mascot / Cap Style */}
            <GraduationCap className="w-14 h-14 sm:w-20 sm:h-20 text-orange-500" strokeWidth={1.5} />
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 bg-orange-50 px-2.5 sm:px-3 py-1 rounded-full border border-orange-100 text-orange-800 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
            <Award className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> CBSE Class 10 Prep
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-850 bg-gradient-to-r from-orange-600 via-slate-800 to-indigo-700 bg-clip-text text-transparent">
            GanitQuest
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-[var(--color-text-muted)] font-medium max-w-md mx-auto leading-relaxed px-2">
            Gamified learning laboratory for Class X Mathematics. Master coordinate geometry, trigonometry, and surface areas through real-time interactive visuals.
          </p>
        </div>

        <div>
          <button 
            onClick={() => navigate('/chapters')}
            className="group relative inline-flex items-center justify-center px-8 sm:px-10 py-3.5 sm:py-4 font-bold text-white bg-gradient-to-r from-orange-600 to-indigo-600 hover:from-orange-500 hover:to-indigo-500 rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-lg shadow-orange-500/20 cursor-pointer text-sm sm:text-base"
          >
            <span className="mr-2 text-xs sm:text-sm tracking-wider uppercase font-bold">Start Learning</span>
            <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-0.5 transition-transform fill-current" />
          </button>
        </div>
      </div>
    </div>
  );
};
export default HomeScreen;
