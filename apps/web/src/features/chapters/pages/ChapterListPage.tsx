import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, GraduationCap } from 'lucide-react';
import ChapterGrid from '../components/ChapterGrid';

export const ChapterListPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen bg-[var(--color-bg)] text-slate-800 p-4 sm:p-6 md:p-10 overflow-y-auto relative select-none pt-20">
      {/* Decorative ambient gradients with Indian branding flavor */}
      <div className="absolute top-0 right-1/4 w-48 h-48 sm:w-96 sm:h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-40 h-40 sm:w-[30rem] sm:h-[30rem] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-10">
          <button 
            onClick={() => navigate('/grades')}
            className="self-start flex items-center text-slate-600 hover:text-slate-900 transition-all font-semibold bg-white/80 backdrop-blur px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md cursor-pointer hover:-translate-y-0.5 active:translate-y-0 text-xs sm:text-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
            <span className="hidden sm:inline">Back to Grades</span>
            <span className="sm:hidden">Back</span>
          </button>
          
          <div className="flex items-center gap-2 bg-orange-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border border-orange-100">
            <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-600" />
            <span className="text-[10px] sm:text-xs font-semibold text-orange-850 uppercase tracking-wider">Class X Mathematics</span>
          </div>
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold mb-2 sm:mb-3 text-slate-850 text-center tracking-tight bg-gradient-to-r from-orange-600 via-slate-800 to-indigo-700 bg-clip-text text-transparent">
          Mathematics Class X
        </h2>
        <p className="text-slate-500 text-center mb-6 sm:mb-10 max-w-md mx-auto text-xs sm:text-sm leading-relaxed font-medium px-2">
          Select a chapter below. Unlock interactive math labs to visually learn and master key concepts.
        </p>

        <ChapterGrid />
      </div>
    </div>
  );
};

export default ChapterListPage;
