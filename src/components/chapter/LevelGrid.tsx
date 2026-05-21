import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Unlock } from 'lucide-react';
import levels from '../../data/levels';
import type { LevelData } from '../../data/levels';
import { useGameStore } from '../../store/gameStore';

export const CHAPTER_WORLD_NAMES: Record<string, Record<number, string>> = {
  'ch-7': {
    1: "World 1: Understanding Coordinates",
    2: "World 2: Plotting Mechanics",
    3: "World 3: Distance Formula",
    4: "World 4: Midpoint & Section Formula",
    5: "World 5: Mastery Challenges"
  },
  'ch-8': {
    1: "World 1: Angle Foundations",
    2: "World 2: Trigonometric Ratios",
    3: "World 3: Trigonometric Identity Lab",
    4: "World 4: Complementary Angles",
    5: "World 5: Heights & Distances"
  },
  'ch-12': {
    1: "World 1: Shape Basics",
    2: "World 2: Surface Area Lab",
    3: "World 3: Volume Factory",
    4: "World 4: Combination Forge",
    5: "World 5: Conversion Reactor"
  }
};

interface LevelGridProps {
  chapterId: string;
}

export const LevelGrid: React.FC<LevelGridProps> = ({ chapterId }) => {
  const navigate = useNavigate();
  const { unlockedLevels } = useGameStore();

  // Filter levels by selected chapter
  const selectedLevels = levels.filter(level => {
    if (chapterId === 'ch-7') {
      return level.id.startsWith('lvl-cg-');
    }
    if (chapterId === 'ch-8') {
      return level.id.startsWith('lvl-trig-');
    }
    if (chapterId === 'ch-12') {
      return !level.id.startsWith('lvl-cg-') && !level.id.startsWith('lvl-trig-');
    }
    return false;
  });

  // Group levels by world
  const levelsByWorld = selectedLevels.reduce((acc, level) => {
    if (!acc[level.world]) acc[level.world] = [];
    acc[level.world].push(level);
    return acc;
  }, {} as Record<number, LevelData[]>);

  const worldNames = CHAPTER_WORLD_NAMES[chapterId] || CHAPTER_WORLD_NAMES['ch-12'];

  const handleLevelClick = (levelId: string) => {
    navigate(`/chapter/${chapterId}/level/${levelId}`);
  };

  return (
    <div className="space-y-8 sm:space-y-12">
      {Object.entries(levelsByWorld).map(([worldStr, worldLevels]) => {
        const worldNum = parseInt(worldStr);
        return (
          <div key={worldNum} className="space-y-4 sm:space-y-5">
            <h3 className="text-lg sm:text-xl font-bold text-slate-700 border-b border-slate-200/80 pb-1.5 sm:pb-2 inline-block">
              {worldNames[worldNum] || `World ${worldNum}`}
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {worldLevels.map((level) => {
                const isUnlocked = unlockedLevels.includes(level.id);
                
                return (
                  <button
                    key={level.id}
                    disabled={!isUnlocked}
                    onClick={() => handleLevelClick(level.id)}
                    className={`relative p-4 sm:p-5 rounded-2xl border text-left transition-all duration-300 overflow-hidden ${
                      isUnlocked 
                        ? 'border-slate-200 bg-white/80 hover:border-orange-400 hover:shadow-md cursor-pointer hover:-translate-y-0.5' 
                        : 'border-slate-200/60 bg-slate-100/50 opacity-40 cursor-not-allowed'
                    }`}
                  >
                    {/* Level stripe */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500/20 to-indigo-500/20" />
                    
                    <div className="flex justify-between items-start mb-2.5 sm:mb-3 mt-1">
                      <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 bg-slate-50 px-2 sm:px-2.5 py-1 rounded-md border border-slate-200/60">
                        LEVEL {worldLevels.indexOf(level) + 1}
                      </span>
                      {isUnlocked ? (
                        <Unlock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600" />
                      ) : (
                        <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400" />
                      )}
                    </div>
                    
                    <h3 className="text-sm sm:text-base font-bold mb-1 leading-snug text-slate-800">
                      {level.title}
                    </h3>
                    
                    <p className="text-[10px] sm:text-xs font-semibold text-indigo-600 uppercase tracking-wider">
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
  );
};
export default LevelGrid;
