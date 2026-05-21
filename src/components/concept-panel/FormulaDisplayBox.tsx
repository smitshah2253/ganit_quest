import React from 'react';
import { Sparkles } from 'lucide-react';

interface FormulaDisplayBoxProps {
  formulaDisplay: string;
  concept: string;
}

export const FormulaDisplayBox: React.FC<FormulaDisplayBoxProps> = ({ 
  formulaDisplay, 
  concept 
}) => {
  return (
    <div className="bg-orange-50/40 rounded-2xl p-4.5 border border-orange-100/60 shadow-inner relative overflow-hidden shrink-0 select-none">
      <div className="absolute top-2 right-2 text-orange-500/10">
        <Sparkles className="w-8 h-8" />
      </div>
      <h3 className="text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-widest flex items-center gap-1">
        <span>Core Formula</span>
      </h3>
      <p className="text-xl font-extrabold text-orange-700 tracking-wide font-mono">
        {formulaDisplay}
      </p>
      <p className="text-xs text-slate-650 mt-2 leading-relaxed font-medium">
        {concept}
      </p>
    </div>
  );
};

export default FormulaDisplayBox;
