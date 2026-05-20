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
    
    const spec = currentLevelData ? getLevelSpec(currentLevelData.id, currentLevelData) : null;

    useLayoutEffect(() => {
        if (game.current === null) {
            game.current = new Phaser.Game({ ...config, parent: 'game-container' });

            EventBus.on('game-ready', () => {
                if (currentLevelData) {
                    EventBus.emit('load-level', currentLevelData);
                }
            });
        }

        return () => {
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
        }
    }, [currentLevelData]);

    useEffect(() => {
        const handleLiveInput = (data: { value: string, levelId: string }) => {
            const val = parseFloat(data.value);
            if (!isNaN(val) && val > 0) {
                setInputValue(val);
            } else {
                setInputValue(0);
            }
        };

        EventBus.on('user-input-changed', handleLiveInput);
        return () => {
            EventBus.off('user-input-changed', handleLiveInput);
        };
    }, []);

    if (!currentLevelData || !spec) return null;

    // Calculate current volume/area based on live typing
    const calculatedVal = inputValue > 0 ? spec.calculateValue(inputValue) : 0;
    const targetVal = currentLevelData.targetValue;
    
    // Status text details
    let matchStatus = 'awaiting_input'; // 'too_small' | 'too_big' | 'correct'
    if (inputValue > 0) {
        if (Math.abs(inputValue - spec.correctAnswer) <= spec.tolerance) {
            matchStatus = 'correct';
        } else if (calculatedVal < targetVal) {
            matchStatus = 'too_small';
        } else {
            matchStatus = 'too_big';
        }
    }

    const accuracy = inputValue > 0 ? Math.max(0, Math.min(100, Math.round((1 - Math.abs(calculatedVal - targetVal) / targetVal) * 100))) : 0;

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
                            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Target Size</span>
                            <span className="text-xl font-bold text-emerald-600">
                                {targetVal.toLocaleString()}
                            </span>
                            <span className="text-[9px] font-semibold text-slate-400 block uppercase">units³</span>
                        </div>

                        {/* Divider */}
                        <div className="w-px h-10 bg-slate-200 self-center" />

                        {/* Live Calculated Display */}
                        <div>
                            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Live Volume</span>
                            <span className={`text-xl font-bold transition-colors duration-200 ${
                                matchStatus === 'correct' 
                                    ? 'text-emerald-600' 
                                    : matchStatus === 'too_big' 
                                    ? 'text-rose-600' 
                                    : inputValue > 0 
                                    ? 'text-amber-600' 
                                    : 'text-slate-400'
                            }`}>
                                {calculatedVal > 0 ? calculatedVal.toLocaleString(undefined, {maximumFractionDigits: 1}) : '---'}
                            </span>
                            <span className="text-[9px] font-semibold text-slate-400 block uppercase">units³</span>
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
