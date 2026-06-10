import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Play, GraduationCap, Award, Trophy } from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] p-3 sm:p-4 relative overflow-hidden select-none pt-20">
      {/* Ambient lights */}
      <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-80 sm:h-80 bg-orange-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-56 h-56 sm:w-96 sm:h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="text-center space-y-6 sm:space-y-10 max-w-xl p-5 sm:p-8 rounded-2xl sm:rounded-3xl relative z-10">
        <div className="relative inline-flex items-center justify-center">
          <div className="absolute inset-0 bg-orange-400/20 rounded-full blur-2xl animate-pulse" />
          <div className="bg-white/80 border border-slate-200/80 p-4 sm:p-6 rounded-full shadow-lg relative">
            <GraduationCap className="w-14 h-14 sm:w-20 sm:h-20 text-orange-500" strokeWidth={1.5} />
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 bg-orange-50 px-2.5 sm:px-3 py-1 rounded-full border border-orange-100 text-orange-800 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
            <Award className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Class X Prep · All Boards
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-850 bg-gradient-to-r from-orange-600 via-slate-800 to-indigo-700 bg-clip-text text-transparent">
            {t('app.name')}
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-[var(--color-text-muted)] font-medium max-w-md mx-auto leading-relaxed px-2">
            {t('app.tagline')}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <button 
            onClick={() => navigate('/grades')}
            className="group relative inline-flex items-center justify-center px-8 sm:px-10 py-3.5 sm:py-4 font-bold text-white bg-gradient-to-r from-orange-600 to-indigo-600 hover:from-orange-500 hover:to-indigo-500 rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-lg shadow-orange-500/20 cursor-pointer text-sm sm:text-base"
          >
            <span className="mr-2 text-xs sm:text-sm tracking-wider uppercase font-bold">{t('common.start')}</span>
            <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-0.5 transition-transform fill-current" />
          </button>
          <button
            onClick={() => navigate('/leaderboard')}
            className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-full transition-all hover:scale-105 active:scale-95 cursor-pointer text-xs sm:text-sm"
          >
            <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="tracking-wider uppercase font-bold">{t('navigation.leaderboard')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
export default HomeScreen;
