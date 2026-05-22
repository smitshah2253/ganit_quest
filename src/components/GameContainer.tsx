import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { PhaserGame } from '../game/PhaserGame';
import { EventBus } from '../game/EventBus';
import { ResultScreen } from './ResultScreen';
import levels from '../data/levels';
import { useGameStore } from '../store/gameStore';
import { ConceptPanel } from './concept-panel/ConceptPanel';
import { ConceptBook } from './ConceptBook';
import { getLevelSpec } from '../data/levelSpecs';
import { AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import { soundManager } from '../game/SoundManager';

export const GameContainer: React.FC = () => {
  const { chapterId, levelId } = useParams<{ chapterId: string; levelId: string }>();
  const navigate = useNavigate();

  const levelData = levels.find(l => l.id === levelId);
  const spec = levelData ? getLevelSpec(levelData.id, levelData) : null;
  
  const [showResult, setShowResult] = useState(false);
  const [stars, setStars] = useState(0);
  const [showConceptBook, setShowConceptBook] = useState(true);
  const [isSolved, setIsSolved] = useState(false);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [hintUsed, setHintUsed] = useState(false);
  const { addXp, addStars, unlockLevel, setCurrentLevel, completeLevel } = useGameStore();

  // Filter levels for the current chapter to handle progression
  const chapterLevels = levels.filter(level => {
    if (chapterId === 'ch-7') return level.id.startsWith('lvl-cg-');
    if (chapterId === 'ch-8') return level.id.startsWith('lvl-trig-');
    return !level.id.startsWith('lvl-cg-') && !level.id.startsWith('lvl-trig-');
  });

  useEffect(() => {
    setShowConceptBook(true);
    setShowResult(false);
    setIsSolved(false);
    setWrongAttempts(0);
    setHintUsed(false);
  }, [levelId]);

  const handleNextLevel = () => {
    const currentIndex = chapterLevels.findIndex(l => l.id === levelId);
    if (currentIndex !== -1 && currentIndex + 1 < chapterLevels.length) {
      const nextLevel = chapterLevels[currentIndex + 1];
      unlockLevel(nextLevel.id);
      setCurrentLevel(nextLevel.id);
      navigate(`/chapter/${chapterId}/level/${nextLevel.id}`);
      setShowResult(false);
      setIsSolved(false);
    } else {
      navigate(`/chapter/${chapterId}/levels`);
    }
  };

  const handleRetry = () => {
    setShowResult(false);
    setIsSolved(false);
    setWrongAttempts(0);
    setHintUsed(false);
    EventBus.emit('load-level', levelData);
  };

  const handleHintUsed = () => {
    setHintUsed(true);
  };

  const handleCheckAnswer = (isCorrect: boolean) => {
    if (isCorrect && levelId) {
      soundManager.playSuccess();
      EventBus.emit('answer-correct');
      let earnedStars = 1;
      if (!hintUsed && wrongAttempts === 0) earnedStars = 3;
      else if (!hintUsed || wrongAttempts <= 2) earnedStars = 2;
      setStars(earnedStars);
      setIsSolved(true);
      setShowResult(true);
      addXp(earnedStars * 50);
      addStars(earnedStars);

      const currentIndex = chapterLevels.findIndex(l => l.id === levelId);
      if (levelId) {
        completeLevel(levelId);
      }
      if (currentIndex !== -1 && currentIndex + 1 < chapterLevels.length) {
        unlockLevel(chapterLevels[currentIndex + 1].id);
      }
    } else {
      setWrongAttempts(prev => prev + 1);
      soundManager.playError();
      EventBus.emit('answer-wrong');
      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: "That's not quite right. Try again!",
        confirmButtonText: 'Retry',
        confirmButtonColor: '#f97316',
        background: '#fff',
        customClass: { popup: 'rounded-2xl' }
      });
    }
  };

  if (!levelData || !spec) return <div className="text-white p-8">Level not found</div>;

  return (
    <div className="w-screen h-screen bg-[var(--color-bg)] flex flex-col overflow-hidden relative">
      
      {/* Top Header */}
      <div className="w-full px-4 md:px-8 py-3 md:py-4 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white/70 backdrop-blur-md border-b border-slate-200/80 z-10 shrink-0 shadow-sm select-none">
        <button 
          onClick={() => navigate(`/chapter/${chapterId}/levels`)}
          className="flex items-center text-slate-500 hover:text-slate-800 transition-colors font-semibold text-xs sm:text-sm uppercase tracking-wider cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5" />
          <span className="hidden sm:inline">Back to Levels</span>
          <span className="sm:hidden">Back</span>
        </button>
        
        <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
          <button
            onClick={() => setShowConceptBook(true)}
            className="flex items-center gap-1.5 bg-gradient-to-r from-orange-600 to-indigo-650 hover:from-orange-500 hover:to-indigo-550 text-white font-semibold px-3 sm:px-4.5 py-2 rounded-xl shadow-md transition-all text-[10px] sm:text-xs uppercase tracking-wider cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Read Concept Book</span>
            <span className="sm:hidden">Concept Book</span>
          </button>
          
          <div className="text-[10px] sm:text-xs font-semibold text-slate-600 bg-white px-3 sm:px-4 py-2 rounded-xl border border-slate-200 uppercase tracking-wider shadow-sm">
            World {levelData.world}
          </div>
        </div>
      </div>

      {/* Main Content: Responsive Layout */}
      <div className="flex flex-col md:flex-row flex-1 w-full p-3 md:p-6 gap-3 md:gap-6 overflow-y-auto md:overflow-hidden">
        
        {/* Left Side - Concept Panel (Full width on mobile, 40% on desktop) */}
        <div className="w-full md:w-[40%] md:h-full flex flex-col order-2 md:order-1 min-h-0">
          <ConceptPanel 
            levelData={levelData} 
            onCheckAnswer={handleCheckAnswer}
            onHintUsed={handleHintUsed}
            onOpenBook={() => setShowConceptBook(true)}
            isSolved={isSolved}
            onNextLevel={handleNextLevel}
          />
        </div>

        {/* Right Side - Animative UI (Phaser) (Full width on mobile, 60% on desktop) */}
        <div className="w-full md:w-[60%] h-[220px] sm:h-[280px] md:h-full shrink-0 relative rounded-2xl md:rounded-3xl overflow-hidden shadow-xl border border-slate-200 bg-[#ecf2f7] order-1 md:order-2">
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
export default GameContainer;
