import React from 'react';
import { CheckCircle2, Award } from 'lucide-react';
import type { BoardExamLine } from '../../data/levelSpecs';

interface BoardExamNotebookProps {
  boardExamLines: BoardExamLine[];
  boardExamInputs: string[];
  isSolved: boolean;
  onInputChange: (index: number, val: string) => void;
}

export const BoardExamNotebook: React.FC<BoardExamNotebookProps> = ({
  boardExamLines,
  boardExamInputs,
  isSolved,
  onInputChange
}) => {
  return (
    <div className="flex-1 flex flex-col min-h-0 space-y-3">
      <h4 className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 shrink-0 ${
        isSolved ? 'text-emerald-600' : 'text-slate-450'
      }`}>
        {isSolved ? (
          <>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Official Board Exam Solution</span>
          </>
        ) : (
          <span>Board Exam Answer Sheet</span>
        )}
      </h4>
      
      {/* Lined notebook container with vertical red margin */}
      <div className={`flex-1 flex flex-col min-h-0 bg-[#fbfcfd] border rounded-2xl shadow-inner relative overflow-hidden ${
        isSolved ? 'border-emerald-200' : 'border-slate-200/80'
      }`}>
        <div className="absolute top-0 bottom-0 left-9 w-px bg-red-200 z-0 pointer-events-none" />
        
        <div className="flex-1 overflow-y-auto font-mono text-[13px] leading-8 p-4 relative z-10 select-text">
          {boardExamLines.map((line) => {
            if (!line.hasInput) {
              return (
                <div key={line.lineNum} className="flex items-start min-h-8 py-0.5 hover:bg-slate-200/10 rounded transition-colors pl-8 relative">
                  <span className="absolute left-0 w-7 text-right pr-2 text-slate-400 select-none text-[10px] font-bold font-sans mt-0.5">{line.lineNum}</span>
                  <span className="text-slate-700 whitespace-pre font-semibold leading-8">{line.textBefore}</span>
                </div>
              );
            }

            const inputIdx = line.inputIndex ?? 0;
            const currentVal = boardExamInputs[inputIdx] ?? '';
            
            if (isSolved) {
              return (
                <div key={line.lineNum} className="flex items-start min-h-8 py-0.5 hover:bg-slate-200/10 rounded transition-colors pl-8 relative flex-wrap items-center">
                  <span className="absolute left-0 w-7 text-right pr-2 text-slate-400 select-none text-[10px] font-bold font-sans mt-0.5">{line.lineNum}</span>
                  <span className="text-slate-700 whitespace-pre font-semibold leading-8">{line.textBefore}</span>
                  <span className="mx-1.5 px-2 py-0.5 h-6.5 text-[13px] rounded-md border text-center font-bold font-mono inline-flex items-center justify-center border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm">
                    {line.correctAnswer}
                  </span>
                  <span className="text-slate-700 whitespace-pre font-semibold leading-8">{line.textAfter}</span>
                </div>
              );
            }

            const isCorrect = currentVal.trim() === line.correctAnswer;
            const isPartial = currentVal.trim() !== '' && !isCorrect;

            return (
              <div key={line.lineNum} className="flex items-start min-h-8 py-0.5 hover:bg-slate-200/20 rounded transition-colors pl-8 relative flex-wrap items-center">
                <span className="absolute left-0 w-7 text-right pr-2 text-slate-400 select-none text-[10px] font-bold font-sans mt-0.5">{line.lineNum}</span>
                <span className="text-slate-800 whitespace-pre font-semibold leading-8">{line.textBefore}</span>
                <input
                  type="text"
                  value={currentVal}
                  onChange={(e) => onInputChange(inputIdx, e.target.value)}
                  placeholder={line.placeholder}
                  style={{ width: `${(line.widthChars || 6) * 9 + 16}px` }}
                  className={`mx-1.5 px-2 py-0.5 h-6.5 text-[13px] rounded-md border text-center font-bold font-mono transition-all outline-none focus:ring-4 focus:ring-blue-500/10 ${
                    isCorrect
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm"
                      : isPartial
                      ? "border-orange-450 bg-orange-50 text-orange-700 shadow-sm"
                      : "border-slate-300 bg-white text-slate-800 hover:border-slate-400 focus:border-blue-500"
                  }`}
                  autoComplete="off"
                />
                <span className="text-slate-800 whitespace-pre font-semibold leading-8">{line.textAfter}</span>
              </div>
            );
          })}
        </div>
      </div>

      {isSolved && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4.5 text-center flex flex-col items-center gap-1 select-none">
          <div className="flex items-center gap-2 text-emerald-700 font-extrabold text-sm uppercase tracking-wider">
            <Award className="w-5 h-5 text-amber-500 animate-bounce" />
            <span>Challenge Unlocked!</span>
          </div>
          <p className="text-xs text-slate-650 font-medium leading-relaxed max-w-sm">
            Above is the perfect step-by-step layout required to score full marks in your CBSE/NCERT Board Exams!
          </p>
        </div>
      )}
    </div>
  );
};

export default BoardExamNotebook;
