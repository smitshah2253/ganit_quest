import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { config } from './config';
import { EventBus } from './EventBus';
import { getLevelSpec } from '../data/levelSpecs';
import { Sparkles, HelpCircle, Activity, Crosshair } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PhaserGameProps {
    currentLevelData: any;
}

export const PhaserGame: React.FC<PhaserGameProps> = ({ currentLevelData }) => {
    const game = useRef<Phaser.Game | null>(null);
    const [inputValue, setInputValue] = useState<number>(0);
    const [boardExamInputs, setBoardExamInputs] = useState<string[]>([]);
    
    const spec = currentLevelData ? getLevelSpec(currentLevelData.id, currentLevelData) : null;

    useLayoutEffect(() => {
        let onGameReady: (() => void) | null = null;
        if (game.current === null) {
            game.current = new Phaser.Game({ ...config, parent: 'game-container' });

            onGameReady = () => {
                if (currentLevelData) {
                    EventBus.emit('load-level', currentLevelData);
                }
            };
            EventBus.on('game-ready', onGameReady);
        }

        return () => {
            if (onGameReady) {
                EventBus.off('game-ready', onGameReady);
            }
            if (game.current) {
                game.current.destroy(true);
                game.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (currentLevelData && game.current) {
            EventBus.emit('load-level', currentLevelData);
            setInputValue(0); // Reset live HUD
            setBoardExamInputs([]);
        }
    }, [currentLevelData]);

    useEffect(() => {
        const handleLiveInput = (data: { value: string, levelId: string }) => {
            const val = parseFloat(data.value);
            if (!isNaN(val)) {
                setInputValue(val);
            } else {
                setInputValue(0);
            }
        };

        const handleBoardExamLiveInput = (data: { inputs: string[], levelId: string }) => {
            setBoardExamInputs(data.inputs);
        };

        EventBus.on('user-input-changed', handleLiveInput);
        EventBus.on('board-exam-input-changed', handleBoardExamLiveInput);
        
        return () => {
            EventBus.off('user-input-changed', handleLiveInput);
            EventBus.off('board-exam-input-changed', handleBoardExamLiveInput);
        };
    }, []);


    if (!currentLevelData || !spec) return null;

    const isCG = currentLevelData.id.startsWith('lvl-cg-');
    const isTrig = currentLevelData.id.startsWith('lvl-trig-');

    let calculatedVal = 0;
    let targetVal = currentLevelData.targetValue;
    let matchStatus = 'awaiting_input';
    let accuracy = 0;

    if (isCG || isTrig) {
        let activeVal: number | null = null;
        if (spec.boardExamLines) {
            const val = parseFloat(boardExamInputs[0]);
            if (!isNaN(val)) {
                activeVal = val;
            }
        } else {
            activeVal = inputValue;
        }

        targetVal = spec.correctAnswer;
        calculatedVal = activeVal !== null ? activeVal : 0;

        if (activeVal !== null && !isNaN(activeVal)) {
            if (Math.abs(activeVal - spec.correctAnswer) <= (spec.tolerance || 0)) {
                matchStatus = 'correct';
            } else if (activeVal < spec.correctAnswer) {
                matchStatus = 'too_small';
            } else {
                matchStatus = 'too_big';
            }
            
            if (matchStatus === 'correct') {
                accuracy = 100;
            } else {
                const divisor = spec.correctAnswer === 0 ? 1 : Math.abs(spec.correctAnswer);
                accuracy = Math.max(0, Math.min(99, Math.round((1 - Math.abs(activeVal - spec.correctAnswer) / divisor) * 100)));
            }
        } else {
            matchStatus = 'awaiting_input';
            accuracy = 0;
        }
    } else if (spec.boardExamLines && currentLevelData.id === 'lvl-25') {
        const vSphereStr = boardExamInputs[0] || '';
        const hCylinderStr = boardExamInputs[1] || '';
        const vSphere = parseFloat(vSphereStr);
        const hCylinder = parseFloat(hCylinderStr);

        targetVal = 113.04;

        if (vSphereStr.trim() !== "113.04") {
            calculatedVal = !isNaN(vSphere) ? vSphere : 0;
            if (vSphereStr.trim() !== '') {
                if (vSphere === 113.04) {
                    matchStatus = 'correct';
                } else if (vSphere < 113.04) {
                    matchStatus = 'too_small';
                } else {
                    matchStatus = 'too_big';
                }
                accuracy = Math.max(0, Math.min(100, Math.round((1 - Math.abs(vSphere - 113.04) / 113.04) * 100)));
            }
        } else {
            calculatedVal = !isNaN(hCylinder) ? 12.56 * hCylinder : 0;
            if (hCylinderStr.trim() !== '') {
                const filledVolume = 12.56 * hCylinder;
                if (hCylinder === 9) {
                    matchStatus = 'correct';
                } else if (filledVolume < 113.04) {
                    matchStatus = 'too_small';
                } else {
                    matchStatus = 'too_big';
                }
                accuracy = Math.max(0, Math.min(100, Math.round((1 - Math.abs(filledVolume - 113.04) / 113.04) * 100)));
            } else {
                matchStatus = 'awaiting_input';
                accuracy = 50;
            }
        }
    } else {
        // Generic logic for other levels (both standard/easy and multi-step board exams)
        let activeVal = 0;
        if (spec.boardExamLines) {
            // Find the last valid numeric input in boardExamInputs
            for (let i = boardExamInputs.length - 1; i >= 0; i--) {
                const val = parseFloat(boardExamInputs[i]);
                if (!isNaN(val) && val > 0) {
                    activeVal = val;
                    break;
                }
            }
        } else {
            activeVal = inputValue;
        }

        calculatedVal = activeVal > 0 ? spec.calculateValue(activeVal) : 0;
        if (activeVal > 0) {
            if (Math.abs(activeVal - spec.correctAnswer) <= spec.tolerance) {
                matchStatus = 'correct';
            } else if (calculatedVal < targetVal) {
                matchStatus = 'too_small';
            } else {
                matchStatus = 'too_big';
            }
            accuracy = Math.max(0, Math.min(100, Math.round((1 - Math.abs(calculatedVal - targetVal) / targetVal) * 100)));
        } else {
            matchStatus = 'awaiting_input';
            accuracy = 0;
        }
    }


    return (
        <div className="relative w-full h-full overflow-hidden flex flex-col">
            
            {/* Phaser Game Canvas Wrapper */}
            <div id="game-container" className="absolute inset-0 w-full h-full" />

            {/* REAL-TIME PREMIUM HUD OVERLAY */}
            <div className="absolute inset-x-0 top-0 p-6 flex justify-between items-start pointer-events-none z-10 select-none">
                
                {/* Shape title badge */}
                <div className="bg-white/80 backdrop-blur-md px-5 py-3 rounded-2xl border border-slate-200/80 shadow-md flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
                    <div>
                        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">interactive model</span>
                        <span className="text-sm font-bold text-slate-800 uppercase tracking-wider">{currentLevelData.shape}</span>
                    </div>
                </div>

                {/* Target vs Current Live board */}
                <div className="flex flex-col gap-3 items-end">
                    <div className="bg-white/80 backdrop-blur-md px-5 py-4.5 rounded-2xl border border-slate-200/80 shadow-md flex gap-6">
                        
                        {/* Target Display */}
                        <div className="text-right">
                            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                                {isCG ? "Target Answer" : isTrig ? (isTrig && (spec.trigMode === 'angle' || spec.trigMode === 'complementary' || spec.trigMode === 'identity') ? "Target Angle" : "Target Ratio") : "Target Size"}
                            </span>
                            <span className="text-xl font-bold text-emerald-600">
                                {targetVal.toLocaleString(undefined, {maximumFractionDigits: 3})}
                            </span>
                            <span className="text-[9px] font-semibold text-slate-400 block uppercase">
                                {isCG ? "units" : isTrig ? (isTrig && (spec.trigMode === 'angle' || spec.trigMode === 'complementary' || spec.trigMode === 'identity') ? "degrees" : "ratio") : "units³"}
                            </span>
                        </div>

                        {/* Divider */}
                        <div className="w-px h-10 bg-slate-200 self-center" />

                        {/* Live Calculated Display */}
                        <div>
                            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                                {isCG ? "Live Answer" : isTrig ? (isTrig && (spec.trigMode === 'angle' || spec.trigMode === 'complementary' || spec.trigMode === 'identity') ? "Live Angle" : "Live Ratio") : "Live Volume"}
                            </span>
                            <span className={`text-xl font-bold transition-colors duration-200 ${
                                matchStatus === 'correct' 
                                    ? 'text-emerald-600' 
                                    : matchStatus === 'too_big' 
                                    ? 'text-rose-600' 
                                    : matchStatus !== 'awaiting_input'
                                    ? 'text-amber-600' 
                                    : 'text-slate-400'
                            }`}>
                                {matchStatus !== 'awaiting_input' ? calculatedVal.toLocaleString(undefined, {maximumFractionDigits: isTrig && (spec.trigMode === 'angle' || spec.trigMode === 'complementary' || spec.trigMode === 'identity') ? 1 : 3}) : '---'}
                            </span>
                            <span className="text-[9px] font-semibold text-slate-400 block uppercase">
                                {isCG ? "units" : isTrig ? (isTrig && (spec.trigMode === 'angle' || spec.trigMode === 'complementary' || spec.trigMode === 'identity') ? "degrees" : "ratio") : "units³"}
                            </span>
                        </div>
                    </div>

                    {/* Live Match State Badge */}
                    <AnimatePresence mode="wait">
                        {matchStatus === 'correct' && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.8, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8, y: -10 }}
                                className="bg-emerald-600/90 backdrop-blur text-white text-xs font-semibold px-4 py-2 rounded-xl border border-emerald-500 shadow-lg flex items-center gap-1.5"
                            >
                                <Sparkles className="w-4 h-4 animate-spin text-emerald-300" />
                                <span>Perfect Match! Ready to Submit 🎉</span>
                            </motion.div>
                        )}
                        {matchStatus === 'too_small' && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.8, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8, y: -10 }}
                                className="bg-amber-600/90 backdrop-blur text-white text-xs font-semibold px-4 py-2 rounded-xl border border-amber-500 shadow-lg flex items-center gap-1.5"
                            >
                                <HelpCircle className="w-4 h-4 text-amber-200" />
                                <span>Too Small! Increase values 🔍</span>
                            </motion.div>
                        )}
                        {matchStatus === 'too_big' && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.8, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8, y: -10 }}
                                className="bg-rose-600/90 backdrop-blur text-white text-xs font-semibold px-4 py-2 rounded-xl border border-rose-500 shadow-lg flex items-center gap-1.5"
                            >
                                <Activity className="w-4 h-4 text-rose-200" />
                                <span>Too Large! Reduce values 💥</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Bottom Real-time Accuracy Progress bar */}
            <div className="absolute inset-x-0 bottom-6 px-6 pointer-events-none z-10 w-full select-none">
                <div className="w-full bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/80 p-4 flex items-center gap-4.5 shadow-lg">
                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-200 text-blue-600 shrink-0 shadow-sm">
                        <Crosshair className="w-4.5 h-4.5" />
                    </div>
                    
                    <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-center text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                            <span>accuracy rate</span>
                            <span className={accuracy >= 95 ? 'text-emerald-600 font-bold' : 'text-slate-600'}>
                                {accuracy}%
                            </span>
                        </div>
                        
                        <div className="w-full bg-slate-100 rounded-full h-2.5 border border-slate-200 overflow-hidden p-0.5">
                            <motion.div 
                                className={`h-full rounded-full ${
                                    matchStatus === 'correct' 
                                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-lg shadow-emerald-400/50' 
                                        : matchStatus === 'too_big' 
                                        ? 'bg-gradient-to-r from-rose-500 to-orange-400' 
                                        : 'bg-gradient-to-r from-blue-500 to-sky-400'
                                    }`}
                                initial={{ width: 0 }}
                                animate={{ width: `${accuracy}%` }}
                                transition={{ type: "spring", stiffness: 80 }}
                            />
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};
