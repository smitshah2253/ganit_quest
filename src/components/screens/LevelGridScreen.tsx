import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen } from 'lucide-react';
import LevelGrid from '../chapter/LevelGrid';

const CHAPTER_METADATA: Record<string, { title: string; syllabus: string; fullName: string }> = {
  'ch-7': {
    title: 'Coordinate Geometry',
    fullName: 'Chapter 7: Coordinate Geometry',
    syllabus: 'Syllabus: Cartesian coordinate plane plotting, reflections, Distance Formula, Midpoint Formula, and Section division ratios. Select a level challenge to begin.'
  },
  'ch-8': {
    title: 'Trigonometry & Applications',
    fullName: 'Chapter 8: Introduction to Trigonometry',
    syllabus: 'Syllabus: Ratios of right-angled triangles, identities sin²θ + cos²θ = 1, complementary angle formulas, and heights & distances applications. Select a level challenge to begin.'
  },
  'ch-12': {
    title: 'Surface Areas & Volumes',
    fullName: 'Chapter 12: Surface Areas and Volumes',
    syllabus: 'Syllabus: Formulations and transformations of solids—cubes, cuboids, spheres, cones, hemispheres, and combination solids. Select a level challenge to begin.'
  }
};

export const LevelGridScreen: React.FC = () => {
  const { chapterId } = useParams<{ chapterId: string }>();
  const navigate = useNavigate();

  const metadata = CHAPTER_METADATA[chapterId || 'ch-12'] || CHAPTER_METADATA['ch-12'];

  return (
    <div className="h-screen bg-[var(--color-bg)] text-slate-800 p-6 md:p-10 overflow-y-auto relative select-none">
      {/* Decorative ambient gradients */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-[30rem] h-[30rem] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <button 
            onClick={() => navigate(`/chapter/${chapterId}`)}
            className="self-start flex items-center text-slate-600 hover:text-slate-900 transition-all font-semibold bg-white/80 backdrop-blur px-5 py-2.5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span>Back to Intro</span>
          </button>
          
          <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
              {metadata.fullName}
            </span>
          </div>
        </div>

        <h2 className="text-3xl font-bold mb-2 text-slate-850 tracking-tight">
          {metadata.title}
        </h2>
        <p className="text-slate-500 mb-10 text-sm leading-relaxed max-w-xl font-medium">
          {metadata.syllabus}
        </p>

        <LevelGrid chapterId={chapterId || 'ch-12'} />
      </div>
    </div>
  );
};

export default LevelGridScreen;
