import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, ChevronRight, Sparkles } from 'lucide-react';

interface Grade {
  grade: number;
  label: string;
  tagline: string;
  isUnlocked: boolean;
}

const GRADES: Grade[] = [
  { grade: 1,  label: 'Class I',    tagline: 'Numbers & Shapes',          isUnlocked: false },
  { grade: 2,  label: 'Class II',   tagline: 'Addition & Subtraction',    isUnlocked: false },
  { grade: 3,  label: 'Class III',  tagline: 'Multiplication & Division', isUnlocked: false },
  { grade: 4,  label: 'Class IV',   tagline: 'Fractions & Geometry',      isUnlocked: false },
  { grade: 5,  label: 'Class V',    tagline: 'Decimals & Measurement',    isUnlocked: false },
  { grade: 6,  label: 'Class VI',   tagline: 'Integers & Algebra Intro',  isUnlocked: false },
  { grade: 7,  label: 'Class VII',  tagline: 'Ratios & Data Handling',    isUnlocked: false },
  { grade: 8,  label: 'Class VIII', tagline: 'Linear Equations & Exponents', isUnlocked: false },
  { grade: 9,  label: 'Class IX',   tagline: 'Coordinate Geometry & Statistics', isUnlocked: false },
  { grade: 10, label: 'Class X',    tagline: 'Algebra, Trigonometry & More', isUnlocked: true },
  { grade: 11, label: 'Class XI',   tagline: 'Calculus & Combinatorics',  isUnlocked: false },
  { grade: 12, label: 'Class XII',  tagline: 'Integration & 3D Geometry', isUnlocked: false },
];

export const GradeScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-slate-800 p-4 sm:p-6 md:p-10 overflow-y-auto relative select-none pt-20">
      {/* Ambient gradients */}
      <div className="absolute top-0 right-1/4 w-48 h-48 sm:w-96 sm:h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-40 h-40 sm:w-[30rem] sm:h-[30rem] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 mb-8 sm:mb-10">
          <button
            onClick={() => navigate('/home')}
            className="self-start flex items-center text-slate-600 hover:text-slate-900 transition-all font-semibold bg-white/80 backdrop-blur px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md cursor-pointer hover:-translate-y-0.5 active:translate-y-0 text-xs sm:text-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
            <span className="hidden sm:inline">Back to Home</span>
            <span className="sm:hidden">Back</span>
          </button>

          <div className="flex items-center gap-2 bg-orange-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border border-orange-100">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-600" />
            <span className="text-[10px] sm:text-xs font-semibold text-orange-800 uppercase tracking-wider">GanitQuest Learning Path</span>
          </div>
        </div>

        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-2 bg-gradient-to-r from-orange-600 via-slate-800 to-indigo-700 bg-clip-text text-transparent">
            Choose Your Grade
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm font-medium max-w-md mx-auto">
            Select your class to access the interactive math lab. More grades coming soon.
          </p>
        </div>

        {/* Grade Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {GRADES.map(({ grade, label, tagline, isUnlocked }) => (
            <button
              key={grade}
              onClick={() => isUnlocked && navigate('/chapters')}
              disabled={!isUnlocked}
              className={`group relative p-4 sm:p-5 rounded-2xl border text-left transition-all duration-300 overflow-hidden ${
                isUnlocked
                  ? 'border-orange-200 bg-white/85 backdrop-blur-md shadow-sm hover:border-orange-400 hover:shadow-orange-500/10 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer'
                  : 'border-slate-200/70 bg-slate-50/60 opacity-55 cursor-not-allowed'
              }`}
            >
              {/* Active grade top accent */}
              {isUnlocked && (
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-indigo-500" />
              )}

              {/* Grade number badge */}
              <div className="flex justify-between items-start mb-3">
                <span className={`text-[9px] sm:text-[10px] font-black px-2 py-0.5 sm:py-1 rounded-lg border tracking-wider ${
                  isUnlocked
                    ? 'bg-orange-50 text-orange-600 border-orange-100'
                    : 'bg-slate-100 text-slate-400 border-slate-200/60'
                }`}>
                  GRADE {grade}
                </span>
                {isUnlocked ? (
                  <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500 group-hover:translate-x-0.5 transition-transform" />
                ) : (
                  <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400" />
                )}
              </div>

              <p className={`text-base sm:text-lg font-black mb-0.5 leading-tight ${
                isUnlocked ? 'text-slate-800 group-hover:text-orange-700' : 'text-slate-400'
              }`}>
                {label}
              </p>
              <p className={`text-[10px] sm:text-xs font-medium leading-tight ${
                isUnlocked ? 'text-slate-500' : 'text-slate-400'
              }`}>
                {isUnlocked ? tagline : 'Coming Soon'}
              </p>

              {isUnlocked && (
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] sm:text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Active Lab</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GradeScreen;
