import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, GraduationCap, Play, Trophy, Sparkles, Award } from 'lucide-react';

interface ChapterIntro {
  title: string;
  subtitle: string;
  description: string;
  objectives: string[];
  cbseWeightage: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

const CHAPTER_INTROS: Record<string, ChapterIntro> = {
  'ch-7': {
    title: 'Coordinate Geometry',
    subtitle: 'Chapter 7 • CBSE Class X Mathematics',
    description: 'Explore the coordinate plane where geometry meets algebra. Discover how positions are plotted, distances are calculated using the Pythagoras theorem, and shapes are partitioned using section ratios.',
    objectives: [
      'Understand the Cartesian Coordinate System',
      'Calculate distances between points using the Distance Formula',
      'Find the coordinates dividing lines with the Section Formula',
      'Determine midpoints and solve practical exam-style challenges'
    ],
    cbseWeightage: '6 Marks (Standard & Basic)',
    difficulty: 'Intermediate'
  },
  'ch-8': {
    title: 'Introduction to Trigonometry',
    subtitle: 'Chapter 8 • CBSE Class X Mathematics',
    description: 'Delve into the mathematics of right-angled triangles. Connect angles with side ratios (Sine, Cosine, Tangent) and discover trigonometric identities that govern space, architecture, and waves.',
    objectives: [
      'Define Trigonometric Ratios (sin, cos, tan, cosec, sec, cot)',
      'Master values of ratios for standard angles (0°, 30°, 45°, 60°, 90°)',
      'Apply Complementary Angles properties',
      'Establish the foundational Pythagorean identity: sin²θ + cos²θ = 1'
    ],
    cbseWeightage: '8 Marks (Standard & Basic)',
    difficulty: 'Advanced'
  },
  'ch-12': {
    title: 'Surface Areas and Volumes',
    subtitle: 'Chapter 12 • CBSE Class X Mathematics',
    description: 'Transform mathematical solids in three-dimensional space. Learn to calculate the surface areas and volumes of combinations of cubes, cuboids, cylinders, cones, and spheres.',
    objectives: [
      'Calculate Surface Area & Volume of foundational solids',
      'Analyze combination solids (e.g., cylinder with hemispherical ends)',
      'Solve conversion problems where one solid is melted to form another',
      'Apply formula adaptations to realistic engineering simulations'
    ],
    cbseWeightage: '6 Marks (Standard & Basic)',
    difficulty: 'Intermediate'
  }
};

export const ChapterIntroScreen: React.FC = () => {
  const { chapterId } = useParams<{ chapterId: string }>();
  const navigate = useNavigate();

  const chapter = CHAPTER_INTROS[chapterId || 'ch-12'];

  if (!chapter) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--color-bg)] p-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Chapter not found</h2>
        <button 
          onClick={() => navigate('/chapters')} 
          className="bg-blue-600 text-white px-6 py-2 rounded-xl"
        >
          Back to Chapters
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-slate-800 p-6 md:p-12 overflow-y-auto relative select-none flex flex-col items-center justify-center">
      {/* Decorative ambient gradients with Indian branding flavor (Saffron & Indigo) */}
      <div className="absolute top-0 right-1/4 w-[32rem] h-[32rem] bg-orange-500/5 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-10 left-1/4 w-[30rem] h-[30rem] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl w-full relative z-10 space-y-6">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button 
            onClick={() => navigate('/chapters')}
            className="self-start flex items-center text-slate-600 hover:text-slate-900 transition-all font-semibold bg-white/80 backdrop-blur px-5 py-2.5 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span>Back to Chapters</span>
          </button>
          
          <div className="flex items-center gap-2 bg-gradient-to-r from-orange-50 to-amber-50 px-4 py-2 rounded-xl border border-orange-100/80">
            <Award className="w-4 h-4 text-orange-600" />
            <span className="text-xs font-bold text-orange-800 uppercase tracking-wider">NCERT Syllabus Certified</span>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-3xl p-8 md:p-10 shadow-xl relative overflow-hidden">
          {/* Subtle side glowing accent */}
          <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-orange-500 to-indigo-600" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column: Visual Icon & Meta */}
            <div className="flex flex-col items-center text-center justify-center md:border-r border-slate-100 md:pr-8 space-y-6">
              <div className="relative">
                <div className="absolute inset-0 bg-orange-400/20 rounded-full blur-2xl animate-pulse" />
                <div className="bg-gradient-to-br from-orange-500 to-amber-500 text-white p-6 rounded-full shadow-lg relative border-4 border-white">
                  <GraduationCap className="w-16 h-16" strokeWidth={1.5} />
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">CBSE Class X</span>
                <h3 className="text-2xl font-black text-slate-800 mt-1">{chapter.title}</h3>
              </div>

              <div className="w-full space-y-3 pt-4 border-t border-slate-100">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">Exam Weightage:</span>
                  <span className="font-bold text-orange-600">{chapter.cbseWeightage}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">Difficulty Level:</span>
                  <span className={`font-bold px-2 py-0.5 rounded-md ${
                    chapter.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                    chapter.difficulty === 'Intermediate' ? 'bg-blue-100 text-blue-700' :
                    'bg-red-100 text-red-700'
                  }`}>{chapter.difficulty}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Descriptions & Learning Path */}
            <div className="md:col-span-2 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{chapter.subtitle}</span>
                  <h2 className="text-3xl font-extrabold text-slate-850 tracking-tight">Overview</h2>
                </div>
                <p className="text-slate-650 leading-relaxed text-sm md:text-base font-medium">
                  {chapter.description}
                </p>

                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                    Key Learning Objectives
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium text-slate-700">
                    {chapter.objectives.map((obj, i) => (
                      <li key={i} className="flex items-start gap-2 bg-slate-50/50 p-2.5 rounded-lg border border-slate-150">
                        <span className="text-indigo-600 font-bold mt-0.5">•</span>
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Start Button */}
              <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <span>30 Interactive Levels & Board Exam Practicals</span>
                </div>
                
                <button
                  onClick={() => navigate(`/chapter/${chapterId}/levels`)}
                  className="group w-full sm:w-auto relative inline-flex items-center justify-center px-8 py-3.5 font-bold text-white bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 rounded-2xl overflow-hidden transition-all hover:scale-103 active:scale-98 shadow-md shadow-orange-500/20 cursor-pointer text-sm tracking-wide uppercase"
                >
                  <span className="mr-2">Start Learning</span>
                  <Play className="w-4 h-4 group-hover:translate-x-0.5 transition-transform fill-current" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
