import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, GraduationCap } from 'lucide-react';
import ChapterGrid from '../chapter/ChapterGrid';

export const ChapterScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen bg-[var(--color-bg)] text-slate-800 p-6 md:p-10 overflow-y-auto relative select-none">
      {/* Decorative ambient gradients with Indian branding flavor */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-[30rem] h-[30rem] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <button 
            onClick={() => navigate('/home')}
            className="self-start flex items-center text-slate-600 hover:text-slate-900 transition-all font-semibold bg-white/80 backdrop-blur px-5 py-2.5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span>Back to Menu</span>
          </button>
          
          <div className="flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-xl border border-orange-100">
            <GraduationCap className="w-4 h-4 text-orange-600" />
            <span className="text-xs font-semibold text-orange-850 uppercase tracking-wider">NCERT Class 10 Syllabus</span>
          </div>
        </div>

        <h2 className="text-4xl font-bold mb-3 text-slate-850 text-center tracking-tight bg-gradient-to-r from-orange-600 via-slate-800 to-indigo-700 bg-clip-text text-transparent">
          Mathematics Class X
        </h2>
        <p className="text-slate-500 text-center mb-10 max-w-md mx-auto text-sm leading-relaxed font-medium">
          Select a syllabus chapter below. Unlock active math geometry labs to visually learn and master CBSE concepts.
        </p>

        <ChapterGrid />
      </div>
    </div>
  );
};

export default ChapterScreen;
