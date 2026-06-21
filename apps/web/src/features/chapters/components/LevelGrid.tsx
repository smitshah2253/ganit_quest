import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Unlock, CheckCircle2 } from 'lucide-react';
import levels from '@/data/levels';
import type { LevelData } from '@/data/levels';
import { useGameStore } from '@/store/game.store';

export const CHAPTER_WORLD_NAMES: Record<string, Record<number, string>> = {
  'ch-1': {
    1: "World 1: Factor Forest",
    2: "World 2: Euclid's Temple",
    3: "World 3: Prime Factorization Caverns",
    4: "World 4: HCF & LCM Factory",
    5: "World 5: Decimal Dimension"
  },
  'ch-2': {
    1: "World 1: Polynomial Factory Foundations",
    2: "World 2: Degree Control Systems",
    3: "World 3: Zero Hunters",
    4: "World 4: Graph Reactor Lab",
    5: "World 5: Coefficient Mastery Center"
  },
  'ch-3': {
    1: "World 1: Equation Foundations",
    2: "World 2: Graphical Solutions",
    3: "World 3: Substitution Lab",
    4: "World 4: Elimination Engine",
    5: "World 5: Real-World Command Center"
  },
  'ch-6': {
    1: "World 1: Triangle Foundations",
    2: "World 2: Similar Triangles",
    3: "World 3: Basic Proportionality Theorem",
    4: "World 4: Areas & Scaling",
    5: "World 5: Pythagoras & Mastery"
  },
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
  'ch-9': {
    1: "World 1: Observation Basics (Levels 1–6)",
    2: "World 2: Angle of Elevation (Levels 7–12)",
    3: "World 3: Angle of Depression (Levels 13–18)",
    4: "World 4: Heights & Distances (Levels 19–24)",
    5: "World 5: Survey Commander (Levels 25–30)"
  },
  'ch-12': {
    1: "World 1: Shape Basics",
    2: "World 2: Surface Area Lab",
    3: "World 3: Volume Factory",
    4: "World 4: Combination Forge",
    5: "World 5: Conversion Reactor"
  },
  'ch-5': {
    1: "World 1: Pattern Discovery",
    2: "World 2: Common Difference Mechanics",
    3: "World 3: Nth Term Engine",
    4: "World 4: Sum of AP Factory",
    5: "World 5: Real World Simulation"
  },
  'ch-14': {
    1: "World 1: Random Experiment Basics",
    2: "World 2: Sample Space Construction",
    3: "World 3: Events & Probability Intuition",
    4: "World 4: Probability Formula Engine",
    5: "World 5: Real-World Probability Systems"
  },
  'ch-10': {
    1: "World 1: Circle & Tangent Foundations",
    2: "World 2: Radius & Tangent Mechanics",
    3: "World 3: Equal Tangent Systems",
    4: "World 4: Circle Construction",
    5: "World 5: Orbital Mastery"
  },
  'ch-11': {
    1: "World 1: Circle Foundations",
    2: "World 2: Area Mechanics",
    3: "World 3: Sectors & Arcs",
    4: "World 4: Circular Region Combinations",
    5: "World 5: Real-World Engineering"
  },
  'ch-13': {
    1: "World 1: Data Collection Unit",
    2: "World 2: Frequency Analysis Lab",
    3: "World 3: Class Interval Systems",
    4: "World 4: Cumulative Frequency Engine",
    5: "World 5: Median Investigation Headquarters"
  }
};

interface LevelGridProps {
  chapterId: string;
}

export const LevelGrid: React.FC<LevelGridProps> = ({ chapterId }) => {
  const navigate = useNavigate();
  const { unlockedLevels, completedLevels } = useGameStore();

  // Filter levels by selected chapter
  const selectedLevels = levels.filter(level => {
    if (chapterId === 'ch-1') {
      return level.id.startsWith('lvl-rn-');
    }
    if (chapterId === 'ch-2') {
      return level.id.startsWith('lvl-poly-');
    }
    if (chapterId === 'ch-3') {
      return level.id.startsWith('lvl-le-');
    }
    if (chapterId === 'ch-6') {
      return level.id.startsWith('lvl-tri-');
    }
    if (chapterId === 'ch-7') {
      return level.id.startsWith('lvl-cg-');
    }
    if (chapterId === 'ch-8') {
      return level.id.startsWith('lvl-trig-');
    }
    if (chapterId === 'ch-9') {
      return level.id.startsWith('lvl-apptrig-');
    }
    if (chapterId === 'ch-5') {
      return level.id.startsWith('lvl-ap-');
    }
    if (chapterId === 'ch-14') {
      return level.id.startsWith('lvl-prob-');
    }
    if (chapterId === 'ch-10') {
      return level.id.startsWith('lvl-circle-');
    }
    if (chapterId === 'ch-11') {
      return level.id.startsWith('lvl-areas-c-');
    }
    if (chapterId === 'ch-13') {
      return level.id.startsWith('lvl-stats-');
    }
    if (chapterId === 'ch-12') {
      return !level.id.startsWith('lvl-cg-') && !level.id.startsWith('lvl-trig-') && !level.id.startsWith('lvl-ap-') && !level.id.startsWith('lvl-prob-') && !level.id.startsWith('lvl-tri-') && !level.id.startsWith('lvl-circle-') && !level.id.startsWith('lvl-areas-c-') && !level.id.startsWith('lvl-stats-') && !level.id.startsWith('lvl-rn-') && !level.id.startsWith('lvl-poly-') && !level.id.startsWith('lvl-le-');
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
                const isCompleted = completedLevels.includes(level.id);
                
                return (
                  <button
                    key={level.id}
                    disabled={!isUnlocked}
                    onClick={() => handleLevelClick(level.id)}
                    className={`relative p-4 sm:p-5 rounded-2xl border text-left transition-all duration-300 overflow-hidden ${
                      isCompleted
                        ? 'border-emerald-300 bg-emerald-50/60 hover:border-emerald-400 hover:shadow-md cursor-pointer hover:-translate-y-0.5'
                        : isUnlocked 
                        ? 'border-slate-200 bg-white/80 hover:border-orange-400 hover:shadow-md cursor-pointer hover:-translate-y-0.5' 
                        : 'border-slate-200/60 bg-slate-100/50 opacity-40 cursor-not-allowed'
                    }`}
                  >
                    {/* Level stripe */}
                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${
                      isCompleted ? 'from-emerald-400 to-teal-400' : 'from-orange-500/20 to-indigo-500/20'
                    }`} />
                    
                    <div className="flex justify-between items-start mb-2.5 sm:mb-3 mt-1">
                      <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 bg-slate-50 px-2 sm:px-2.5 py-1 rounded-md border border-slate-200/60">
                        LEVEL {worldLevels.indexOf(level) + 1}
                      </span>
                      {isCompleted ? (
                        <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500" />
                      ) : isUnlocked ? (
                        <Unlock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-500" />
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
