import React, { useState, useEffect, useRef } from 'react';
import { EventBus } from '../../game/EventBus';
import { getLevelSpec } from '../../data/levelSpecs';
import { useGameStore } from '../../store/gameStore';
import { HelpCircle, Lightbulb, ArrowRight, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ConceptPanelHeader from './ConceptPanelHeader';
import FormulaDisplayBox from './FormulaDisplayBox';
import BoardExamNotebook from './BoardExamNotebook';

function getLiveAnswerForLevel(levelId: string, points: Array<{x: number, y: number}>): number | null {
  if (!points || points.length === 0) return null;
  const p0 = points[0] || { x: 0, y: 0 };
  const p1 = points[1] || { x: 0, y: 0 };
  const p3 = points[3] || { x: 0, y: 0 };

  switch (levelId) {
    case 'lvl-cg-01':
      return Math.abs(p0.x);
    case 'lvl-cg-02':
      return Math.abs(p0.y);
    case 'lvl-cg-03':
      return p0.x;
    case 'lvl-cg-04':
      return p0.y;
    case 'lvl-cg-05':
      return p0.x * p0.y;
    case 'lvl-cg-06':
      return Math.round(Math.sqrt(p0.x * p0.x + p0.y * p0.y) * 10) / 10;
    case 'lvl-cg-07':
      return p0.x + p0.y;
    case 'lvl-cg-08':
      return Math.abs(p1.y - p0.y);
    case 'lvl-cg-09':
      return p0.x;
    case 'lvl-cg-10':
      return p0.x;
    case 'lvl-cg-11': {
      const length = Math.abs(p1.x - p0.x);
      const width = Math.abs(p3.y - p0.y);
      return 2 * (length + width);
    }
    case 'lvl-cg-12':
      return Math.abs(p0.x - p0.y);
    case 'lvl-cg-13':
    case 'lvl-cg-14':
    case 'lvl-cg-15':
      return Math.round(Math.sqrt((p1.x - p0.x)**2 + (p1.y - p0.y)**2) * 100) / 100;
    case 'lvl-cg-16':
      return p0.x;
    case 'lvl-cg-17':
      return p1.y;
    case 'lvl-cg-18':
      return Math.round(Math.sqrt((p1.x - p0.x)**2 + (p1.y - p0.y)**2) * 100) / 100;
    case 'lvl-cg-19':
      return p0.x;
    case 'lvl-cg-20':
      return p0.y;
    case 'lvl-cg-21':
      return p0.x;
    case 'lvl-cg-22':
      return p0.y;
    case 'lvl-cg-23':
      return p0.x;
    case 'lvl-cg-24':
      return p0.x;
    case 'lvl-cg-26':
      return p0.x;
    case 'lvl-cg-27':
      return p0.y;
    case 'lvl-cg-28':
      return p0.x;
    case 'lvl-cg-29':
      return p0.y;
    case 'lvl-cg-30':
      return p0.x;
    default:
      return null;
  }
}

const HINT_COST = 20;

interface ConceptPanelProps {
  levelData: any;
  onCheckAnswer: (isCorrect: boolean) => void;
  onOpenBook: () => void;
  onHintUsed: () => void;
  isSolved: boolean;
  onNextLevel: () => void;
}

export const ConceptPanel: React.FC<ConceptPanelProps> = ({ 
  levelData, 
  onCheckAnswer, 
  onOpenBook,
  onHintUsed,
  isSolved, 
  onNextLevel 
}) => {
  const { xp, addXp } = useGameStore();
  const [inputValue, setInputValue] = useState<string>('');
  const [showHint, setShowHint] = useState<boolean>(false);
  const [showSimpleHint, setShowSimpleHint] = useState<boolean>(false);
  const [boardExamInputs, setBoardExamInputs] = useState<string[]>([]);
  
  const spec = getLevelSpec(levelData.id, levelData);
  const pointsRef = useRef<Array<{x: number, y: number}>>([]);

  useEffect(() => {
    // Initialize pointsRef when level loads
    if (spec && spec.points) {
      pointsRef.current = spec.points.map(p => {
        let x = p.x;
        let y = p.y;
        if (p.draggable && (levelData.id.startsWith('lvl-cg-01') || 
                            levelData.id.startsWith('lvl-cg-02') ||
                            levelData.id.startsWith('lvl-cg-03') ||
                            levelData.id.startsWith('lvl-cg-04') ||
                            levelData.id.startsWith('lvl-cg-05') ||
                            levelData.id.startsWith('lvl-cg-06') ||
                            levelData.id.startsWith('lvl-cg-07') ||
                            levelData.id.startsWith('lvl-cg-12'))) {
          x = 0;
          y = 0;
        }
        return { x, y };
      });
    } else {
      pointsRef.current = [];
    }
  }, [levelData.id, spec]);

  useEffect(() => {
    const handlePointDragged = (data: { x: number, y: number, label: string, index: number, levelId: string }) => {
      if (data.levelId !== levelData.id) return;
      
      // Update points coordinates
      if (pointsRef.current) {
        pointsRef.current[data.index] = { x: data.x, y: data.y };
      }

      // Compute live answer
      const liveVal = getLiveAnswerForLevel(levelData.id, pointsRef.current);
      if (liveVal !== null) {
        if (showHint && spec.boardExamLines) {
          // If board exam hint notebook is open, fill the first input blank
          const nextInputs = [...boardExamInputs];
          nextInputs[0] = liveVal.toString();
          setBoardExamInputs(nextInputs);

          EventBus.emit('board-exam-input-changed', {
            inputs: nextInputs,
            levelId: levelData.id
          });
        } else {
          // Direct input mode
          setInputValue(liveVal.toString());

          EventBus.emit('user-input-changed', {
            value: liveVal.toString(),
            levelId: levelData.id
          });
        }
      }
    };

    EventBus.on('coordinate-point-dragged', handlePointDragged);
    return () => {
      EventBus.off('coordinate-point-dragged', handlePointDragged);
    };
  }, [levelData.id, showHint, boardExamInputs, spec.boardExamLines]);

  useEffect(() => {
    if (levelData.id.startsWith('lvl-cg-')) {
      const liveVal = getLiveAnswerForLevel(levelData.id, pointsRef.current);
      if (liveVal !== null) {
        if (showHint && spec.boardExamLines) {
          const nextInputs = [...boardExamInputs];
          if (!nextInputs[0]) {
            nextInputs[0] = liveVal.toString();
            setBoardExamInputs(nextInputs);
            EventBus.emit('board-exam-input-changed', {
              inputs: nextInputs,
              levelId: levelData.id
            });
          }
        } else {
          if (!inputValue) {
            setInputValue(liveVal.toString());
            EventBus.emit('user-input-changed', {
              value: liveVal.toString(),
              levelId: levelData.id
            });
          }
        }
      }
    }
  }, [showHint]);

  // Synchronize visual trigonometry slider and drag values from Phaser to React
  useEffect(() => {
    if (!levelData.id.startsWith('lvl-trig-')) return;

    const handleTrigLiveInput = (data: { value: string, levelId: string }) => {
      if (data.levelId !== levelData.id) return;
      setInputValue(prev => {
        if (prev === data.value) return prev;
        return data.value;
      });
    };

    const handleTrigBoardExamLiveInput = (data: { inputs: string[], levelId: string }) => {
      if (data.levelId !== levelData.id) return;
      setBoardExamInputs(prev => {
        const isSame = prev.length === data.inputs.length && prev.every((v, i) => v === data.inputs[i]);
        if (isSame) return prev;
        return data.inputs;
      });
    };

    EventBus.on('user-input-changed', handleTrigLiveInput);
    EventBus.on('board-exam-input-changed', handleTrigBoardExamLiveInput);

    return () => {
      EventBus.off('user-input-changed', handleTrigLiveInput);
      EventBus.off('board-exam-input-changed', handleTrigBoardExamLiveInput);
    };
  }, [levelData.id]);

  useEffect(() => {
    if (levelData.id.startsWith('lvl-trig-')) {
      if (showHint && spec.boardExamLines) {
        const nextInputs = [...boardExamInputs];
        if (!nextInputs[0] && inputValue) {
          nextInputs[0] = inputValue;
          setBoardExamInputs(nextInputs);
          EventBus.emit('board-exam-input-changed', {
            inputs: nextInputs,
            levelId: levelData.id
          });
        }
      }
    }
  }, [showHint, inputValue]);

  useEffect(() => {
    const handleLoadLevel = () => {
      setInputValue('');
      setShowHint(false);
      setShowSimpleHint(false);
      if (spec.boardExamLines) {
        const inputsSpec = spec.boardExamLines.filter(l => l.hasInput);
        setBoardExamInputs(new Array(inputsSpec.length).fill(''));
      } else {
        setBoardExamInputs([]);
      }
    };

    handleLoadLevel();

    // Reset when level loads or retries
    EventBus.on('load-level', handleLoadLevel);
    return () => {
      EventBus.off('load-level', handleLoadLevel);
    };
  }, [levelData, spec]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    
    // Emit to Phaser for live geometry visual scaling
    EventBus.emit('user-input-changed', {
      value: val,
      levelId: levelData.id
    });
  };

  const handleBoardExamInputChange = (index: number, val: string) => {
    const nextInputs = [...boardExamInputs];
    nextInputs[index] = val;
    setBoardExamInputs(nextInputs);

    // Emit to Phaser for multi-stage visual updates
    EventBus.emit('board-exam-input-changed', {
      inputs: nextInputs,
      levelId: levelData.id
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (showHint && spec.boardExamLines) {
      // Validate all notebook inputs in hint mode
      const inputsSpec = spec.boardExamLines.filter(l => l.hasInput);
      const allCorrect = inputsSpec.every((line, idx) => {
        const valStr = (boardExamInputs[idx] || '').trim();
        const correctStr = (line.correctAnswer || '').trim();
        const val = parseFloat(valStr);
        const correctVal = parseFloat(correctStr);
        if (isNaN(val) || isNaN(correctVal)) return valStr === correctStr;
        
        // Match with tolerance for decimals
        return Math.abs(val - correctVal) <= (correctStr.includes('.') ? 0.05 : 0.01);
      });

      onCheckAnswer(allCorrect);
    } else {
      // Validate direct input value
      const numValue = parseFloat(inputValue);
      if (isNaN(numValue)) return;

      const tolerance = spec.tolerance || 0.1;
      const isCorrect = Math.abs(numValue - spec.correctAnswer) <= tolerance;
      
      onCheckAnswer(isCorrect);
    }
  };

  if (!levelData) return null;

  // Submit eligibility check
  const isSubmitDisabled = showHint && spec.boardExamLines
    ? boardExamInputs.some(val => !val.trim())
    : !inputValue;

  return (
    <div className="flex flex-col h-full bg-white/80 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6.5 shadow-xl border border-slate-200/80 relative overflow-hidden flex-1 select-none">
      {/* Soft gradient corner background blob */}
      <div className="absolute -top-16 -right-16 sm:-top-24 sm:-right-24 w-32 h-32 sm:w-48 sm:h-48 bg-gradient-to-br from-orange-500 to-indigo-500 rounded-full opacity-5 blur-3xl pointer-events-none" />
      
      <div className="flex-1 flex flex-col min-h-0 relative z-10 space-y-3 sm:space-y-5 pr-1">
        
        {/* Header Badges */}
        <ConceptPanelHeader levelType={levelData.type} onOpenBook={onOpenBook} />
        
        {/* Level Title */}
        <h2 className="text-xl sm:text-2xl font-black text-slate-800 leading-tight shrink-0">
          {levelData.title}
        </h2>
        
        {/* Formula Display Box */}
        <FormulaDisplayBox formulaDisplay={spec.formulaDisplay} concept={spec.bookPage.concept} />
        
        {/* Dynamic Workspace content */}
        <div className="flex-1 flex flex-col min-h-0 space-y-3 sm:space-y-4 overflow-y-auto">
          <AnimatePresence initial={false}>
            
            {isSolved || (showHint && spec.boardExamLines) ? (
              <BoardExamNotebook 
                key="notebook-workspace"
                boardExamLines={spec.boardExamLines || []}
                boardExamInputs={boardExamInputs}
                isSolved={isSolved}
                onInputChange={handleBoardExamInputChange}
              />
            ) : (
              /* SCENARIO 3: DIRECT MODE ACTIVE (Default view with clear question description) */
              <motion.div
                key="direct-workspace"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col space-y-3 sm:space-y-4 shrink-0"
              >
                <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/60 shadow-sm">
                  <h4 className="text-[9px] sm:text-[10px] font-bold text-slate-400 mb-1.5 sm:mb-2 uppercase tracking-widest flex items-center gap-1.5 shrink-0">
                    <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500" />
                    Your Challenge
                  </h4>
                  <p className="text-slate-700 font-bold text-sm sm:text-base leading-relaxed">
                    {spec.question}
                  </p>
                </div>

                {/* Toggled simple text hint (if no boardExamLines) */}
                {!spec.boardExamLines && showSimpleHint && (
                  <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-3 sm:p-4 text-amber-900 shadow-sm text-[11px] sm:text-xs font-semibold leading-relaxed relative shrink-0">
                    <div className="absolute top-2 right-2 text-amber-500/10">
                      <Lightbulb className="w-6 h-6 sm:w-8 sm:h-8" />
                    </div>
                    <h5 className="font-bold text-[9px] sm:text-[10px] uppercase tracking-wider text-amber-800 mb-1 flex items-center gap-1.5">
                      <Lightbulb className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-600" />
                      Quick Hint
                    </h5>
                    <p className="pr-8">{spec.bookPage?.visualTip || "Check the Formula Book at the top right to calculate the exact size."}</p>
                  </div>
                )}

                {/* Need a hint button */}
                {spec.boardExamLines ? (
                  <button
                    type="button"
                    disabled={xp < HINT_COST}
                    onClick={() => {
                      if (xp < HINT_COST) return;
                      addXp(-HINT_COST);
                      onHintUsed();
                      setShowHint(true);
                    }}
                    className={`w-full flex items-center justify-center gap-2 py-3 sm:py-3.5 px-4 sm:px-5 rounded-2xl border border-dashed font-bold text-[11px] sm:text-xs uppercase tracking-wider transition-all shadow-sm ${
                      xp >= HINT_COST
                        ? 'border-orange-300 bg-orange-50/50 hover:bg-orange-50 text-orange-800 cursor-pointer hover:border-orange-400'
                        : 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed opacity-60'
                    }`}
                  >
                    <Lightbulb className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    {xp >= HINT_COST ? (
                      <span className="flex items-center gap-1.5">
                        💡 Hint
                        <span className="flex items-center gap-0.5 text-orange-600 bg-orange-100 px-1.5 py-0.5 rounded-md border border-orange-200">
                          <Zap className="w-2.5 h-2.5 fill-orange-500 text-orange-500" />
                          -{HINT_COST} XP
                        </span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5">
                        🔒 Hint — Need {HINT_COST} XP
                        <span className="flex items-center gap-0.5">
                          <Zap className="w-2.5 h-2.5" />
                          {xp}/{HINT_COST}
                        </span>
                      </span>
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowSimpleHint(!showSimpleHint)}
                    className="w-full flex items-center justify-center gap-2 py-3 sm:py-3.5 px-4 sm:px-5 rounded-2xl border border-dashed border-orange-300 bg-orange-50/50 hover:bg-orange-50 text-orange-800 font-bold text-[11px] sm:text-xs uppercase tracking-wider transition-all cursor-pointer hover:border-orange-400 shadow-sm"
                  >
                    <Lightbulb className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500" />
                    <span>{showSimpleHint ? "Hide Hint" : "💡 Do you want a Hint?"}</span>
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* FOOTER FORM (Answer submission & level progression navigation) */}
      <div className="mt-auto pt-4 sm:pt-5 border-t border-slate-100 relative z-10 shrink-0 select-none">
        <AnimatePresence mode="wait">
          {isSolved ? (
            
            /* SOLVED STATE BUTTON: DIRECTLY ADVANCE TO NEXT LEVEL */
            <motion.div 
              key="solved-footer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <button
                type="button"
                onClick={onNextLevel}
                className="w-full flex items-center justify-center gap-2 py-3.5 sm:py-4 px-5 sm:px-6 rounded-2xl font-black text-white bg-gradient-to-r from-orange-600 to-indigo-650 hover:from-orange-500 hover:to-indigo-550 shadow-md shadow-orange-500/20 transition-all cursor-pointer uppercase tracking-wider text-[11px] sm:text-sm active:scale-[0.98]"
              >
                <span>Go to Next Level</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
              </button>
            </motion.div>
          ) : (
            
            /* ACTIVE STATE FORM: SUBMIT BUTTON & INPUT */
            <motion.form 
              key="active-footer"
              onSubmit={handleSubmit}
              className="flex flex-col gap-2.5 sm:gap-3"
            >
              {!showHint && (
                <div className="flex justify-between items-center">
                  <label className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest" htmlFor="answer-input">
                    {spec.inputLabel}
                  </label>
                  {inputValue && (
                    <span className="text-[9px] sm:text-[10px] font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-100">
                      Live updating Phaser canvas
                    </span>
                  )}
                </div>
              )}
              
              <div className="flex gap-2 sm:gap-3 items-center">
                {!showHint ? (
                  <input
                    id="answer-input"
                    type="number"
                    step="any"
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder={spec.placeholder}
                    className="flex-1 text-sm sm:text-base font-bold bg-slate-50 border border-slate-200 rounded-2xl px-3.5 sm:px-4 py-3 sm:py-3.5 text-slate-800 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all placeholder:text-slate-400 placeholder:font-medium font-mono"
                    autoComplete="off"
                    required
                  />
                ) : (
                  <div className="flex-1 text-[10px] sm:text-xs font-bold text-slate-500 bg-slate-50 px-3.5 sm:px-4.5 py-3 sm:py-4 rounded-xl border border-slate-200 uppercase tracking-wider">
                    Solve the step blanks on the notebook!
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={isSubmitDisabled}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 sm:px-7 py-3 sm:py-3.5 rounded-2xl font-extrabold text-[11px] sm:text-sm uppercase tracking-wider hover:shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0 active:scale-[0.97]"
                >
                  Submit
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
export default ConceptPanel;
