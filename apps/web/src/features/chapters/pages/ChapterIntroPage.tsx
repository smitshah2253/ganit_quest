import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, GraduationCap, Play, Trophy, Sparkles, Award } from 'lucide-react';

interface ChapterIntro {
  title: string;
  subtitle: string;
  description: string;
  objectives: string[];
  examWeightage: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

const CHAPTER_INTROS: Record<string, ChapterIntro> = {
  'ch-1': {
    title: 'Real Numbers',
    subtitle: 'Chapter 1 • Class X Mathematics',
    description: 'Enter The Number Kingdom — an ancient mathematical civilization with futuristic technology. Discover the fundamental building blocks of mathematics through exploration, factorization puzzles, and number machines. Master prime numbers, the Euclid Division Algorithm, HCF/LCM, and decimal expansions.',
    objectives: [
      'Understand prime, composite, and co-prime numbers',
      'Apply Euclid\'s Division Algorithm to find HCF',
      'Master the Fundamental Theorem of Arithmetic',
      'Calculate HCF and LCM using prime factorization',
      'Classify numbers as rational, irrational, and analyze decimal expansions'
    ],
    examWeightage: '6 Marks (Standard & Basic)',
    difficulty: 'Beginner'
  },
  'ch-14': {
    title: 'Probability',
    subtitle: 'Chapter 14 • Class X Mathematics',
    description: 'Enter the Probability Simulation Lab — a futuristic RNG facility where randomness meets mathematics. From coin flips and dice rolls to card draws and real-world risk, learn to quantify uncertainty using the elegant formula P(E) = n(E) / n(S).',
    objectives: [
      'Understand random experiments, outcomes, and sample spaces',
      'Identify events and count favorable outcomes accurately',
      'Apply P(E) = n(E) / n(S) for theoretical probability',
      'Use complementary events: P(Ē) = 1 − P(E)',
      'Distinguish experimental from theoretical probability'
    ],
    examWeightage: '8 Marks (Standard & Basic)',
    difficulty: 'Beginner'
  },
  'ch-5': {
    title: 'Arithmetic Progressions',
    subtitle: 'Chapter 5 • Class X Mathematics',
    description: 'Explore the elegant world of number sequences where every term follows a predictable pattern. From salary increments to staircase bricks, Arithmetic Progressions model the real world with two powerful formulas — the nth term and the sum of n terms.',
    objectives: [
      'Recognise and define an Arithmetic Progression (AP)',
      'Find the Common Difference (d) and any term using aₙ = a + (n−1)d',
      'Calculate the Sum of n terms using Sₙ = n/2 [2a + (n−1)d]',
      'Apply AP to real-world problems: salaries, population, staircases'
    ],
    examWeightage: '8 Marks (Standard & Basic)',
    difficulty: 'Intermediate'
  },
  'ch-6': {
    title: 'Triangles',
    subtitle: 'Chapter 6 • Class X Mathematics',
    description: 'Enter the Geometry Reactor — where triangles transform and scale in holographic space. Master similar triangles, the Basic Proportionality Theorem, area relationships, and Pythagorean applications through 5 interactive worlds of geometric discovery.',
    objectives: [
      'Understand triangle similarity and scale factors (k)',
      'Apply Basic Proportionality Theorem (BPT) for proportional division',
      'Discover area ratios: Area ∝ k² for similar triangles',
      'Master Pythagorean theorem and common triples (3-4-5, 5-12-13, 8-15-17)',
      'Solve multi-step geometric reasoning puzzles'
    ],
    examWeightage: '8 Marks (Standard & Basic)',
    difficulty: 'Intermediate'
  },
  'ch-7': {
    title: 'Coordinate Geometry',
    subtitle: 'Chapter 7 • Class X Mathematics',
    description: 'Explore the coordinate plane where geometry meets algebra. Discover how positions are plotted, distances are calculated using the Pythagoras theorem, and shapes are partitioned using section ratios.',
    objectives: [
      'Understand the Cartesian Coordinate System',
      'Calculate distances between points using the Distance Formula',
      'Find the coordinates dividing lines with the Section Formula',
      'Determine midpoints and solve practical exam-style challenges'
    ],
    examWeightage: '6 Marks (Standard & Basic)',
    difficulty: 'Intermediate'
  },
  'ch-8': {
    title: 'Introduction to Trigonometry',
    subtitle: 'Chapter 8 • Class X Mathematics',
    description: 'Delve into the mathematics of right-angled triangles. Connect angles with side ratios (Sine, Cosine, Tangent) and discover trigonometric identities that govern space, architecture, and waves.',
    objectives: [
      'Define Trigonometric Ratios (sin, cos, tan, cosec, sec, cot)',
      'Master values of ratios for standard angles (0°, 30°, 45°, 60°, 90°)',
      'Apply Complementary Angles properties',
      'Establish the foundational Pythagorean identity: sin²θ + cos²θ = 1'
    ],
    examWeightage: '8 Marks (Standard & Basic)',
    difficulty: 'Advanced'
  },
  'ch-9': {
    title: 'Some Applications of Trigonometry',
    subtitle: 'Chapter 9 • Class X Mathematics',
    description: 'Enter Sky Survey Command — a futuristic surveying and rescue center. Master heights, distances, line of sight, and angles of elevation & depression. Solve engineering, aiming, and rescue missions through interactive navigation systems.',
    objectives: [
      'Identify line of sight, angles of elevation, and angles of depression',
      'Understand the relationship between elevation and depression angles',
      'Calculate heights of buildings, mountains, and communication towers',
      'Measure horizontal distances and ranges between objects',
      'Apply trigonometric formulas to solve multi-point disaster response missions'
    ],
    examWeightage: '8 Marks (Standard & Basic)',
    difficulty: 'Intermediate'
  },
  'ch-12': {
    title: 'Surface Areas and Volumes',
    subtitle: 'Chapter 12 • Class X Mathematics',
    description: 'Transform mathematical solids in three-dimensional space. Learn to calculate the surface areas and volumes of combinations of cubes, cuboids, cylinders, cones, and spheres.',
    objectives: [
      'Calculate Surface Area & Volume of foundational solids',
      'Analyze combination solids (e.g., cylinder with hemispherical ends)',
      'Solve conversion problems where one solid is melted to form another',
      'Apply formula adaptations to realistic engineering simulations'
    ],
    examWeightage: '6 Marks (Standard & Basic)',
    difficulty: 'Intermediate'
  },
  'ch-10': {
    title: 'Circles',
    subtitle: 'Chapter 10 • Class X Mathematics',
    description: 'Enter the Orbital Geometry Nexus — a futuristic engineering facility where orbital shield systems, laser tangent networks, and circular energy cores teach circle geometry. Master tangents, points of contact, the radius-tangent perpendicular relationship, and equal tangent theorems visually through 30 space mechanics challenges.',
    objectives: [
      'Understand tangent intuition, secants, and points of contact',
      'Apply the theorem: tangent is perpendicular to radius at point of contact',
      'Discover that lengths of tangents from an external point are equal',
      'Construct circular shields, optimal docking routes, and laser grids',
      'Apply circle geometry to solve advanced spatial-reactor puzzles'
    ],
    examWeightage: '6 Marks (Standard & Basic)',
    difficulty: 'Intermediate'
  },
  'ch-11': {
    title: 'Areas Related to Circles',
    subtitle: 'Chapter 11 • Class X Mathematics',
    description: 'Enter the Circular Energy Nexus — a futuristic orbital geometry facility where energy cores, sector shields, and arc reactors teach circular area concepts. Master circumference, area, sectors, arcs, and combined circular regions through 30 interactive engineering challenges.',
    objectives: [
      'Understand circumference and area of circles',
      'Calculate sector areas and arc lengths',
      'Work with semicircles, quadrants, and ring regions',
      'Solve combined circular region problems',
      'Apply circle geometry to real-world engineering scenarios'
    ],
    examWeightage: '6 Marks (Standard & Basic)',
    difficulty: 'Intermediate'
  },
  'ch-13': {
    title: 'Statistics',
    subtitle: 'Chapter 13 • Class X Mathematics',
    description: 'Enter Data City — a futuristic analytics hub where data streams, frequency distributions, and statistical engines teach statistical concepts. Master mean, median, mode, cumulative frequency, and graphical representation through 30 data investigation challenges.',
    objectives: [
      'Calculate mean, median, and mode of grouped data',
      'Construct and interpret frequency distributions',
      'Work with class intervals and cumulative frequency',
      'Create and analyze ogives and histograms',
      'Apply statistical methods to real-world data analysis'
    ],
    examWeightage: '6 Marks (Standard & Basic)',
    difficulty: 'Intermediate'
  }
};

export const ChapterIntroPage: React.FC = () => {
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
    <div className="h-screen bg-[var(--color-bg)] text-slate-800 px-4 py-6 pb-24 sm:px-6 sm:py-8 sm:pb-28 md:px-12 md:py-10 md:pb-32 overflow-y-scroll overscroll-contain relative select-none flex flex-col items-center justify-start pt-20">
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
                <span className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">Class X Mathematics</span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-800 mt-1">{chapter.title}</h3>
              </div>

              <div className="w-full space-y-2 sm:space-y-3 pt-3 sm:pt-4 border-t border-slate-100">
                <div className="flex justify-between items-center text-[10px] sm:text-xs">
                  <span className="text-slate-500 font-medium">Exam Weightage:</span>
                  <span className="font-bold text-orange-600">{chapter.examWeightage}</span>
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

              <div className="pt-4 sm:pt-6 border-t border-slate-100">
                <div className="bg-gradient-to-br from-orange-50 to-indigo-50 rounded-xl overflow-hidden border border-orange-100">
                  <div className="relative min-h-40 sm:min-h-48 flex items-center justify-center p-5 sm:p-6">
                    <div className="absolute top-6 left-8 w-16 h-16 bg-orange-300/20 rounded-full animate-pulse" />
                    <div className="absolute bottom-6 right-8 w-20 h-20 bg-indigo-300/20 rounded-full animate-pulse" />
                    <div className="relative z-10 text-center space-y-3">
                      <div className="mx-auto w-16 h-16 rounded-2xl bg-white shadow-lg border border-orange-100 flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm sm:text-base">Animation-Based Learning</h4>
                        <p className="text-slate-600 text-xs sm:text-sm mt-1">Explore this chapter through interactive visual animations and guided activities.</p>
                      </div>
                      <div className="flex flex-wrap justify-center gap-2">
                        {chapter.objectives.slice(0, 4).map((topic, i) => (
                          <span key={i} className="text-[10px] sm:text-xs bg-white/80 text-indigo-700 px-2 py-1 rounded-full font-medium border border-indigo-100">
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Start Button */}
              <div className="pt-4 sm:pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-center gap-2 text-[10px] sm:text-xs font-semibold text-slate-500">
                  <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" />
                  <span className="hidden sm:inline">30 Interactive Levels & Board Exam Practicals</span>
                  <span className="sm:hidden">30 Interactive Levels</span>
                </div>
                
                <div className="flex gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => navigate(`/learn/${chapterId}`)}
                    className="group flex-1 sm:flex-none relative inline-flex items-center justify-center px-4 sm:px-6 py-3 sm:py-3.5 font-bold text-orange-700 bg-orange-100 hover:bg-orange-200 rounded-2xl overflow-hidden transition-all hover:scale-103 active:scale-98 text-[11px] sm:text-sm tracking-wide uppercase"
                  >
                    <GraduationCap className="w-4 h-4 mr-2" />
                    <span>Learn</span>
                  </button>
                  
                  <button
                    onClick={() => navigate(`/chapter/${chapterId}/levels`)}
                    className="group flex-1 sm:flex-none relative inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-3.5 font-bold text-white bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 rounded-2xl overflow-hidden transition-all hover:scale-103 active:scale-98 shadow-md shadow-orange-500/20 cursor-pointer text-[11px] sm:text-sm tracking-wide uppercase"
                  >
                    <span className="mr-2">Practice</span>
                    <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-0.5 transition-transform fill-current" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
