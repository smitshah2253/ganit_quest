import React, { useEffect, useState } from 'react';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { PhaserGame } from '../game/PhaserGame';
import { EventBus } from '../game/EventBus';
import { ResultScreen } from './ResultScreen';
import levels from '../data/levels.json';
import { useGameStore } from '../store/gameStore';
import { ConceptPanel } from './ConceptPanel';
import { ConceptBook } from './ConceptBook';
import { getLevelSpec } from '../data/levelSpecs';
import { AnimatePresence } from 'framer-motion';

interface GameContainerProps {
  levelId: string;
  onBack: () => void;
}

export const GameContainer: React.FC<GameContainerProps> = ({ levelId, onBack }) => {
  const levelData = levels.find(l => l.id === levelId);
  const spec = levelData ? getLevelSpec(levelData.id, levelData) : null;
  
  const [showResult, setShowResult] = useState(false);
  const [stars, setStars] = useState(0);
  const [showConceptBook, setShowConceptBook] = useState(true);
  const { addXp, addStars, unlockLevel } = useGameStore();

  useEffect(() => {
    setShowConceptBook(true);
    setShowResult(false);
  }, [levelId]);

  const handleNextLevel = () => {
    const currentIndex = levels.findIndex(l => l.id === levelId);
    if (currentIndex !== -1 && currentIndex + 1 < levels.length) {
      onBack(); // Simplest is to go back to chapters and let them pick the next unlocked
    } else {
      onBack();
    }
  };

  const handleRetry = () => {
    setShowResult(false);
    EventBus.emit('load-level', levelData);
  };

  const handleCheckAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      // Calculate stars based on some logic, or just give 3 for now since it's an exact match mostly
      const earnedStars = 3;
      setStars(earnedStars);
      setShowResult(true);
      addXp(earnedStars * 50);
      addStars(earnedStars);
      
      const currentIndex = levels.findIndex(l => l.id === levelId);
      if (currentIndex !== -1 && currentIndex + 1 < levels.length) {
        unlockLevel(levels[currentIndex + 1].id);
      }
    } else {
      // Could show a "try again" toast or animation here
      alert("That's not quite right. Try again!");
    }
  };

  if (!levelData || !spec) return <div className="text-white p-8">Level not found</div>;

  return (
    <div className="w-screen h-screen bg-[var(--color-bg)] flex flex-col overflow-hidden relative">
      
      {/* Top Header */}
      <div className="w-full px-8 py-4 flex items-center justify-between bg-white/70 backdrop-blur-md border-b border-slate-200/80 z-10 shrink-0 shadow-sm select-none">
        <button 
          onClick={onBack}
          className="flex items-center text-slate-500 hover:text-slate-800 transition-colors font-semibold text-sm uppercase tracking-wider cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 mr-1.5" />
          <span>Back to Chapters</span>
        </button>
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowConceptBook(true)}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4.5 py-2 rounded-xl shadow-md transition-all text-xs uppercase tracking-wider cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>Read Concept Book</span>
          </button>
          
          <div className="text-xs font-semibold text-slate-600 bg-white px-4 py-2 rounded-xl border border-slate-200 uppercase tracking-wider shadow-sm">
            World {levelData.world}
          </div>
        </div>
      </div>

      {/* Main Content: 40/60 Split */}
      <div className="flex flex-1 w-full p-6 gap-6 overflow-hidden">
        
        {/* Left Side (40%) - Concept Panel */}
        <div className="w-[40%] h-full flex flex-col">
          <ConceptPanel 
            levelData={levelData} 
            onCheckAnswer={handleCheckAnswer}
            onOpenBook={() => setShowConceptBook(true)}
          />
        </div>

        {/* Right Side (60%) - Animative UI (Phaser) */}
        <div className="w-[60%] h-full relative rounded-3xl overflow-hidden shadow-xl border border-slate-200 bg-[#ecf2f7]">
          <PhaserGame currentLevelData={levelData} />
        </div>

      </div>

      {/* Result Screen Overlay */}
      {showResult && (
        <ResultScreen 
          starsEarned={stars} 
          onNext={handleNextLevel} 
          onRetry={handleRetry} 
        />
      )}

      {/* Interactive Textbook Overlay */}
      <AnimatePresence>
        {showConceptBook && (
          <ConceptBook 
            spec={spec} 
            onClose={() => setShowConceptBook(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};
