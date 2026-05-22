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
  'ch-14': {
    title: 'Probability',
    subtitle: 'Chapter 14 • CBSE Class X Mathematics',
    description: 'Enter the Probability Simulation Lab — a futuristic RNG facility where randomness meets mathematics. From coin flips and dice rolls to card draws and real-world risk, learn to quantify uncertainty using the elegant formula P(E) = n(E) / n(S).',
    objectives: [
      'Understand random experiments, outcomes, and sample spaces',
      'Identify events and count favorable outcomes accurately',
      'Apply P(E) = n(E) / n(S) for theoretical probability',
      'Use complementary events: P(Ē) = 1 − P(E)',
      'Distinguish experimental from theoretical probability'
    ],
    cbseWeightage: '8 Marks (Standard & Basic)',
    difficulty: 'Beginner'
  },
  'ch-5': {
    title: 'Arithmetic Progressions',
    subtitle: 'Chapter 5 • CBSE Class X Mathematics',
    description: 'Explore the elegant world of number sequences where every term follows a predictable pattern. From salary increments to staircase bricks, Arithmetic Progressions model the real world with two powerful formulas — the nth term and the sum of n terms.',
    objectives: [
      'Recognise and define an Arithmetic Progression (AP)',
      'Find the Common Difference (d) and any term using aₙ = a + (n−1)d',
      'Calculate the Sum of n terms using Sₙ = n/2 [2a + (n−1)d]',
      'Apply AP to real-world problems: salaries, population, staircases'
    ],
    cbseWeightage: '8 Marks (Standard & Basic)',
    difficulty: 'Intermediate'
  },
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
    <div className="min-h-screen bg-[var(--color-bg)] text-slate-800 p-4 sm:p-6 md:p-12 overflow-y-auto relative select-none flex flex-col items-center justify-center">
      {/* Decorative ambient gradients with Indian branding flavor (Saffron & Indigo) */}
      <div className="absolute top-0 right-1/4 w-24 h-24 sm:w-[32rem] sm:h-[32rem] bg-orange-500/5 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-10 left-1/4 w-24 h-24 sm:w-[30rem] sm:h-[30rem] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl w-full relative z-10 space-y-4 sm:space-y-6">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <button 
            onClick={() => navigate('/chapters')}
            className="self-start flex items-center text-slate-600 hover:text-slate-900 transition-all font-semibold bg-white/80 backdrop-blur px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 text-xs sm:text-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
            <span className="hidden sm:inline">Back to Chapters</span>
            <span className="sm:hidden">Back</span>
          </button>
          
          <div className="flex items-center gap-2 bg-gradient-to-r from-orange-50 to-amber-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border border-orange-100/80">
            <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-600" />
            <span className="text-[10px] sm:text-xs font-bold text-orange-800 uppercase tracking-wider">NCERT Syllabus Certified</span>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 shadow-xl relative overflow-hidden">
          {/* Subtle side glowing accent */}
          <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-orange-500 to-indigo-600" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8">
            {/* Left Column: Visual Icon & Meta */}
            <div className="flex flex-col items-center text-center justify-center md:border-r border-slate-100 md:pr-6 sm:md:pr-8 space-y-4 sm:space-y-6">
              <div className="relative">
                <div className="absolute inset-0 bg-orange-400/20 rounded-full blur-2xl animate-pulse" />
                <div className="bg-gradient-to-br from-orange-500 to-amber-500 text-white p-4 sm:p-6 rounded-full shadow-lg relative border-4 border-white">
                  <GraduationCap className="w-12 h-12 sm:w-16 sm:h-16" strokeWidth={1.5} />
                </div>
              </div>

              <div>
                <span className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">CBSE Class X</span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-800 mt-1">{chapter.title}</h3>
              </div>

              <div className="w-full space-y-2 sm:space-y-3 pt-3 sm:pt-4 border-t border-slate-100">
                <div className="flex justify-between items-center text-[10px] sm:text-xs">
                  <span className="text-slate-500 font-medium">Exam Weightage:</span>
                  <span className="font-bold text-orange-600">{chapter.cbseWeightage}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] sm:text-xs">
                  <span className="text-slate-500 font-medium">Difficulty Level:</span>
                  <span className={`font-bold px-2 py-0.5 rounded-md text-[10px] sm:text-xs ${
                    chapter.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                    chapter.difficulty === 'Intermediate' ? 'bg-blue-100 text-blue-700' :
                    'bg-red-100 text-red-700'
                  }`}>{chapter.difficulty}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Descriptions & Learning Path */}
            <div className="md:col-span-2 space-y-4 sm:space-y-6 flex flex-col justify-between">
              <div className="space-y-3 sm:space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] sm:text-xs font-bold text-indigo-600 uppercase tracking-wider">{chapter.subtitle}</span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-850 tracking-tight">Overview</h2>
                </div>
                <p className="text-slate-650 leading-relaxed text-xs sm:text-sm md:text-base font-medium">
                  {chapter.description}
                </p>

                <div className="space-y-2 sm:space-y-3 pt-2">
                  <h4 className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-orange-500" />
                    Key Learning Objectives
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] sm:text-xs font-medium text-slate-700">
                    {chapter.objectives.map((obj, i) => (
                      <li key={i} className="flex items-start gap-2 bg-slate-50/50 p-2 sm:p-2.5 rounded-lg border border-slate-150">
                        <span className="text-indigo-600 font-bold mt-0.5">•</span>
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Start Button */}
              <div className="pt-4 sm:pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-center gap-2 text-[10px] sm:text-xs font-semibold text-slate-500">
                  <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" />
                  <span className="hidden sm:inline">30 Interactive Levels & Board Exam Practicals</span>
                  <span className="sm:hidden">30 Interactive Levels</span>
                </div>
                
                <button
                  onClick={() => navigate(`/chapter/${chapterId}/levels`)}
                  className="group w-full sm:w-auto relative inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-3.5 font-bold text-white bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 rounded-2xl overflow-hidden transition-all hover:scale-103 active:scale-98 shadow-md shadow-orange-500/20 cursor-pointer text-[11px] sm:text-sm tracking-wide uppercase"
                >
                  <span className="mr-2">Start Learning</span>
                  <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-0.5 transition-transform fill-current" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
