import React from 'react';

interface FormulaDisplayBoxProps {
  formulaDisplay: string;
  concept: string;
}

export const FormulaDisplayBox: React.FC<FormulaDisplayBoxProps> = ({ 
  formulaDisplay, 
  concept 
}) => {
  return (
    <div className="bg-gradient-to-br from-orange-50 to-indigo-50 rounded-2xl p-3 sm:p-5 border border-slate-200/80 shadow-sm">
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <span className="text-[9px] sm:text-[10px] font-bold text-indigo-600 uppercase tracking-wider bg-indigo-100 px-2 sm:px-2.5 py-1 rounded-md">
          Formula
        </span>
        <span className="text-[9px] sm:text-[10px] font-semibold text-slate-500">
          {concept}
        </span>
      </div>
      <div className="text-xl sm:text-2xl font-bold text-slate-800 text-center py-2 sm:py-3">
        {formulaDisplay}
      </div>
    </div>
  );
};

export default FormulaDisplayBox;
