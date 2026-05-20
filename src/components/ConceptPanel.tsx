import React, { useState, useEffect } from 'react';
import { EventBus } from '../game/EventBus';
import { getLevelSpec } from '../data/levelSpecs';
import { BookOpen, Sparkles, HelpCircle, GraduationCap } from 'lucide-react';

interface ConceptPanelProps {
  levelData: any;
  onCheckAnswer: (isCorrect: boolean) => void;
  onOpenBook: () => void;
}

export const ConceptPanel: React.FC<ConceptPanelProps> = ({ levelData, onCheckAnswer, onOpenBook }) => {
  const [inputValue, setInputValue] = useState<string>('');
  const spec = getLevelSpec(levelData.id, levelData);

  useEffect(() => {
    // Reset input when level changes
    setInputValue('');
  }, [levelData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    
    // Emit to Phaser for the right-side animation
    EventBus.emit('user-input-changed', {
      value: val,
      levelId: levelData.id
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numValue = parseFloat(inputValue);
    
    if (isNaN(numValue)) return;

    // Validate using the level spec's correctAnswer
    const tolerance = spec.tolerance || 0.1;
    const isCorrect = Math.abs(numValue - spec.correctAnswer) <= tolerance;
    
    onCheckAnswer(isCorrect);
  };

  if (!levelData) return null;

  return (
    <div className="flex flex-col h-full bg-white/80 backdrop-blur-md rounded-3xl p-6.5 shadow-xl border border-slate-200/80 relative overflow-hidden flex-1 select-none">
      {/* Decorative gradient corner blob */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full opacity-5 blur-3xl pointer-events-none" />
      
      <div className="flex-1 relative z-10 overflow-y-auto space-y-6 pr-2">
        {/* Modern clean Badge and view book link */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-50 text-slate-600 font-semibold text-xs border border-slate-200 uppercase tracking-wider">
            <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
            <span>{levelData.type.replace('_', ' ')}</span>
          </div>
          
          <button
            onClick={onOpenBook}
            className="flex items-center gap-1.5 text-xs font-semibold text-indigo-650 hover:text-indigo-550 transition-colors uppercase tracking-wider cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>View Formula Book</span>
          </button>
        </div>
        
        {/* Title */}
        <h2 className="text-2xl font-bold text-slate-850 leading-tight">
          {levelData.title}
        </h2>
        
        {/* Concept Card */}
        <div className="bg-blue-50/40 rounded-2xl p-5 border border-blue-100/70 shadow-inner relative overflow-hidden">
          <div className="absolute top-2 right-2 text-blue-500/10">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest flex items-center gap-1">
            <span>formula card</span>
          </h3>
          <p className="text-xl font-bold text-blue-700 tracking-wide font-display">
            {spec.formulaDisplay}
          </p>
          <p className="text-xs text-slate-600 mt-2.5 leading-relaxed font-medium">
            {spec.bookPage.concept}
          </p>
        </div>
        
        {/* Modern Challenge Card */}
        <div className="bg-slate-50 rounded-xl p-4.5 border border-slate-200/60">
          <h4 className="text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-widest flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-blue-500" />
            your challenge
          </h4>
          <p className="text-slate-700 font-medium text-sm leading-relaxed">
            {spec.question}
          </p>
        </div>
      </div>

      {/* Answer Form */}
      <form onSubmit={handleSubmit} className="mt-auto pt-5 border-t border-slate-100 relative z-10 shrink-0">
        <div className="flex justify-between items-center mb-2">
          <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest" htmlFor="answer-input">
            {spec.inputLabel}
          </label>
          {inputValue && (
            <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
              Live updates active
            </span>
          )}
        </div>
        
        <div className="flex gap-3">
          <input
            id="answer-input"
            type="number"
            step="any"
            value={inputValue}
            onChange={handleInputChange}
            placeholder={spec.placeholder}
            className="flex-1 text-lg font-bold bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-800 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-slate-400 placeholder:font-medium font-display"
            autoComplete="off"
            required
          />
          
          <button
            type="submit"
            disabled={!inputValue}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider hover:shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};
