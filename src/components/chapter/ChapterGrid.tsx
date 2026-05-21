import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Unlock, ChevronRight } from 'lucide-react';

export interface NCERTChapter {
  id: string;
  number: number;
  title: string;
  isUnlocked: boolean;
  conceptCount: string;
}

export const NCERT_CHAPTERS: NCERTChapter[] = [
  { id: "ch-1", number: 1, title: "Real Numbers", isUnlocked: false, conceptCount: "4 Subtopics" },
  { id: "ch-2", number: 2, title: "Polynomials", isUnlocked: false, conceptCount: "3 Subtopics" },
  { id: "ch-3", number: 3, title: "Pair of Linear Equations in Two Variables", isUnlocked: false, conceptCount: "4 Subtopics" },
  { id: "ch-4", number: 4, title: "Quadratic Equations", isUnlocked: false, conceptCount: "3 Subtopics" },
  { id: "ch-5", number: 5, title: "Arithmetic Progressions", isUnlocked: false, conceptCount: "3 Subtopics" },
  { id: "ch-6", number: 6, title: "Triangles", isUnlocked: false, conceptCount: "5 Subtopics" },
  { id: "ch-7", number: 7, title: "Coordinate Geometry", isUnlocked: true, conceptCount: "30 Math Challenges" },
  { id: "ch-8", number: 8, title: "Introduction to Trigonometry", isUnlocked: true, conceptCount: "30 Math Challenges" },
  { id: "ch-9", number: 9, title: "Some Applications of Trigonometry", isUnlocked: false, conceptCount: "2 Subtopics" },
  { id: "ch-10", number: 10, title: "Circles", isUnlocked: false, conceptCount: "2 Subtopics" },
  { id: "ch-11", number: 11, title: "Areas Related to Circles", isUnlocked: false, conceptCount: "3 Subtopics" },
  { id: "ch-12", number: 12, title: "Surface Areas and Volumes", isUnlocked: true, conceptCount: "30 Math Challenges" },
  { id: "ch-13", number: 13, title: "Statistics", isUnlocked: false, conceptCount: "4 Subtopics" },
  { id: "ch-14", number: 14, title: "Probability", isUnlocked: false, conceptCount: "2 Subtopics" }
];

export const ChapterGrid: React.FC = () => {
  const navigate = useNavigate();

  const handleChapterClick = (chapter: NCERTChapter) => {
    if (chapter.isUnlocked) {
      navigate(`/chapter/${chapter.id}`);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {NCERT_CHAPTERS.map((chapter) => (
        <button
          key={chapter.id}
          onClick={() => handleChapterClick(chapter)}
          disabled={!chapter.isUnlocked}
          className={`group relative p-5 rounded-2xl border text-left transition-all duration-300 overflow-hidden ${
            chapter.isUnlocked 
              ? 'border-blue-200 bg-white/85 backdrop-blur-md shadow-sm hover:border-orange-400 hover:shadow-orange-500/5 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer' 
              : 'border-slate-200/80 bg-slate-100/50 opacity-40 cursor-not-allowed'
          }`}
        >
          {/* Saffron accent lines on unlocked item for GanitQuest branding */}
          {chapter.isUnlocked && (
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-indigo-500" />
          )}

          <div className="flex justify-between items-start mb-4">
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md border ${
              chapter.isUnlocked 
                ? 'text-orange-600 bg-orange-50 border-orange-100' 
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
            chapter.isUnlocked ? 'text-slate-800 group-hover:text-orange-700' : 'text-slate-450'
          }`}>
            {chapter.title}
          </h3>
          
          <p className="text-xs text-slate-500 font-medium">
            {chapter.conceptCount}
          </p>

          {chapter.isUnlocked && (
            <div className="mt-4 flex items-center justify-between text-xs font-semibold text-indigo-600 group-hover:text-orange-600 pt-3 border-t border-slate-100">
              <span>Active Geometry Lab</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          )}
        </button>
      ))}
    </div>
  );
};
export default ChapterGrid;
