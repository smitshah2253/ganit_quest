import React, { useState } from 'react';
import { ArrowLeft, Lock, Unlock, GraduationCap, ChevronRight, BookOpen } from 'lucide-react';
import levels from '../data/levels.json';
import { useGameStore } from '../store/gameStore';

interface ChapterScreenProps {
  onBack: () => void;
  onSelectLevel: (levelId: string) => void;
}

interface NCERTChapter {
  id: string;
  number: number;
  title: string;
  isUnlocked: boolean;
  conceptCount: string;
}

const NCERT_CHAPTERS: NCERTChapter[] = [
  { id: "ch-1", number: 1, title: "Real Numbers", isUnlocked: false, conceptCount: "4 Subtopics" },
  { id: "ch-2", number: 2, title: "Polynomials", isUnlocked: false, conceptCount: "3 Subtopics" },
  { id: "ch-3", number: 3, title: "Pair of Linear Equations in Two Variables", isUnlocked: false, conceptCount: "4 Subtopics" },
  { id: "ch-4", number: 4, title: "Quadratic Equations", isUnlocked: false, conceptCount: "3 Subtopics" },
  { id: "ch-5", number: 5, title: "Arithmetic Progressions", isUnlocked: false, conceptCount: "3 Subtopics" },
  { id: "ch-6", number: 6, title: "Triangles", isUnlocked: false, conceptCount: "5 Subtopics" },
  { id: "ch-7", number: 7, title: "Coordinate Geometry", isUnlocked: false, conceptCount: "3 Subtopics" },
  { id: "ch-8", number: 8, title: "Introduction to Trigonometry", isUnlocked: false, conceptCount: "4 Subtopics" },
  { id: "ch-9", number: 9, title: "Some Applications of Trigonometry", isUnlocked: false, conceptCount: "2 Subtopics" },
  { id: "ch-10", number: 10, title: "Circles", isUnlocked: false, conceptCount: "2 Subtopics" },
  { id: "ch-11", number: 11, title: "Areas Related to Circles", isUnlocked: false, conceptCount: "3 Subtopics" },
  { id: "ch-12", number: 12, title: "Surface Areas and Volumes", isUnlocked: true, conceptCount: "30 Math Challenges" },
  { id: "ch-13", number: 13, title: "Statistics", isUnlocked: false, conceptCount: "4 Subtopics" },
  { id: "ch-14", number: 14, title: "Probability", isUnlocked: false, conceptCount: "2 Subtopics" }
];

const WORLD_NAMES: Record<number, string> = {
  1: "World 1: Shape Basics",
  2: "World 2: Surface Area Lab",
  3: "World 3: Volume Factory",
  4: "World 4: Combination Forge",
  5: "World 5: Conversion Reactor"
};

export const ChapterScreen: React.FC<ChapterScreenProps> = ({ onBack, onSelectLevel }) => {
  const { unlockedLevels } = useGameStore();
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);

  // Group levels by world (for chapter 12)
  const levelsByWorld = levels.reduce((acc, level) => {
    if (!acc[level.world]) acc[level.world] = [];
    acc[level.world].push(level);
    return acc;
  }, {} as Record<number, typeof levels>);

  const handleChapterClick = (chapter: NCERTChapter) => {
    if (chapter.isUnlocked) {
      setSelectedChapterId(chapter.id);
    }
  };

  return (
    <div className="h-screen bg-[var(--color-bg)] text-slate-800 p-6 md:p-10 overflow-y-auto relative select-none">
      {/* Decorative ambient gradients */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-[30rem] h-[30rem] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {selectedChapterId === null ? (
        // ================= NCERT CHAPTERS GRID MODE =================
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
            <button 
              onClick={onBack}
              className="self-start flex items-center text-slate-600 hover:text-slate-900 transition-colors font-semibold bg-white/70 backdrop-blur px-5 py-2.5 rounded-xl border border-slate-200/80 shadow-sm cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span>Back to Menu</span>
            </button>
            
            <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-xl border border-blue-100">
              <GraduationCap className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-semibold text-blue-800 uppercase tracking-wider">NCERT Class 10 Syllabus Modules</span>
            </div>
          </div>

          <h2 className="text-4xl font-bold mb-3 text-slate-850 text-center tracking-tight">
            Mathematics Class X
          </h2>
          <p className="text-slate-500 text-center mb-10 max-w-md mx-auto text-sm leading-relaxed">
            Select a syllabus chapter below. Master Chapter 12 to learn advanced 3D surface calculations.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {NCERT_CHAPTERS.map((chapter) => (
              <button
                key={chapter.id}
                onClick={() => handleChapterClick(chapter)}
                disabled={!chapter.isUnlocked}
                className={`group relative p-5 rounded-2xl border text-left transition-all duration-300 overflow-hidden ${
                  chapter.isUnlocked 
                    ? 'border-blue-200 bg-white/80 backdrop-blur-md shadow-sm hover:border-blue-400 hover:shadow-blue-500/5 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer' 
                    : 'border-slate-200/80 bg-slate-100/50 opacity-40 cursor-not-allowed'
                }`}
              >
                {/* Glowing indicators on unlocked item */}
                {chapter.isUnlocked && (
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
                )}

                <div className="flex justify-between items-start mb-4">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md border ${
                    chapter.isUnlocked 
                      ? 'text-blue-600 bg-blue-50 border-blue-100' 
                      : 'text-slate-400 bg-slate-100 border-slate-200/60'
                  }`}>
                    CHAPTER {chapter.number}
                  </span>
                  
                  {chapter.isUnlocked ? (
                    <Unlock className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Lock className="w-4 h-4 text-slate-400" />
                  )}
                </div>

                <h3 className={`text-lg font-bold mb-1 leading-snug transition-colors ${
                  chapter.isUnlocked ? 'text-slate-800 group-hover:text-slate-905' : 'text-slate-450'
                }`}>
                  {chapter.title}
                </h3>
                
                <p className="text-xs text-slate-500 font-medium">
                  {chapter.conceptCount}
                </p>

                {chapter.isUnlocked && (
                  <div className="mt-4 flex items-center justify-between text-xs font-semibold text-blue-600 group-hover:text-blue-500 pt-3 border-t border-slate-100">
                    <span>Active Geometry Lab</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      ) : (
        // ================= LEVEL SELECTION MODE (FOR CHAPTER 12) =================
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <button 
              onClick={() => setSelectedChapterId(null)}
              className="self-start flex items-center text-slate-600 hover:text-slate-900 transition-colors font-semibold bg-white/70 backdrop-blur px-5 py-2.5 rounded-xl border border-slate-200/80 shadow-sm cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span>Back to Chapters</span>
            </button>
            
            <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Chapter 12: Unlocked Active Lab</span>
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-2 text-slate-850 tracking-tight">
            Surface Areas & Volumes
          </h2>
          <p className="text-slate-500 mb-10 text-sm leading-relaxed max-w-xl">
            Syllabus: Formulations and transformations of solids—cubes, cuboids, spheres, cones, hemispheres, and combination solids. Select a level challenge to begin scaling.
          </p>

          {Object.entries(levelsByWorld).map(([worldStr, worldLevels]) => {
            const worldNum = parseInt(worldStr);
            return (
              <div key={worldNum} className="mb-12">
                <h3 className="text-xl font-bold mb-5 text-slate-700 border-b border-slate-200/80 pb-2 inline-block">
                  {WORLD_NAMES[worldNum]}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {worldLevels.map((level) => {
                    const isUnlocked = unlockedLevels.includes(level.id) || true;
                    
                    return (
                      <button
                        key={level.id}
                        disabled={!isUnlocked}
                        onClick={() => onSelectLevel(level.id)}
                        className={`relative p-5 rounded-2xl border text-left transition-all duration-300 overflow-hidden ${
                          isUnlocked 
                            ? 'border-slate-200 bg-white/80 hover:border-blue-400 hover:shadow-md cursor-pointer' 
                            : 'border-slate-200/60 bg-slate-100/50 opacity-40 cursor-not-allowed'
                        }`}
                      >
                        {/* Level stripe */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500/20 to-indigo-500/20" />
                        
                        <div className="flex justify-between items-start mb-3 mt-1">
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200/60">
                            LEVEL {worldLevels.indexOf(level) + 1}
                          </span>
                          {isUnlocked ? (
                            <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Lock className="w-3.5 h-3.5 text-slate-400" />
                          )}
                        </div>
                        
                        <h3 className="text-base font-bold mb-1 leading-snug text-slate-800">
                          {level.title}
                        </h3>
                        
                        <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                          {level.type.replace('_', ' ')}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
