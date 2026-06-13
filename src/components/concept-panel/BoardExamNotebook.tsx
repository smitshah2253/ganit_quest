import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import type { BoardExamLine } from '../../data/levelSpecs';

interface BoardExamNotebookProps {
  boardExamLines: BoardExamLine[];
  boardExamInputs: string[];
  isSolved: boolean;
  onInputChange: (index: number, val: string) => void;
  isMobilePortrait?: boolean;
}

export const BoardExamNotebook: React.FC<BoardExamNotebookProps> = ({
  boardExamLines,
  boardExamInputs,
  isSolved,
  onInputChange,
  isMobilePortrait = false
}) => {
  return (
    <div className={`flex flex-col space-y-2 ${
      isMobilePortrait ? 'flex-none' : 'flex-1 min-h-0 sm:space-y-3'
    }`}>
      <h4 className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 shrink-0 ${
        isSolved ? 'text-emerald-600' : 'text-slate-450'
      }`}>
        {isSolved ? (
          <>
            <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-500" />
            <span className="hidden sm:inline">Official Board Exam Solution</span>
            <span className="sm:hidden">Board Exam Solution</span>
          </>
        ) : (
          <span>Board Exam Answer Sheet</span>
        )}
      </h4>
      
      {/* Lined notebook container with vertical red margin */}
      <div className={`flex flex-col bg-[#fbfcfd] border rounded-2xl shadow-inner relative ${
        isSolved ? 'border-emerald-200' : 'border-slate-200/80'
      } ${
        isMobilePortrait ? 'flex-none overflow-visible' : 'flex-1 min-h-0 overflow-hidden'
      }`}>
        <div className="absolute top-0 bottom-0 left-7 sm:left-9 w-px bg-red-200 z-0 pointer-events-none" />
        
        <div className={`font-mono text-[11px] sm:text-[13px] leading-7 sm:leading-8 p-3 sm:p-4 relative z-10 select-text ${
          isMobilePortrait ? 'h-auto overflow-visible' : 'flex-1 overflow-y-auto'
        }`}>
          {boardExamLines.map((line) => {
            if (!line.hasInput) {
              return (
                <div key={line.lineNum} className="flex items-start min-h-7 sm:min-h-8 py-0.5 hover:bg-slate-200/10 rounded transition-colors pl-6 sm:pl-8 relative">
                  <span className="absolute left-0 w-6 sm:w-7 text-right pr-1.5 sm:pr-2 text-slate-400 select-none text-[9px] sm:text-[10px] font-bold font-sans mt-0.5">{line.lineNum}</span>
                  <span className="text-slate-700 whitespace-pre font-semibold leading-7 sm:leading-8 text-[11px] sm:text-[13px]">{line.textBefore}</span>
                </div>
              );
            }

            const inputIdx = line.inputIndex ?? 0;
            const currentVal = boardExamInputs[inputIdx] ?? '';

            return (
              <div key={line.lineNum} className="flex items-start min-h-7 sm:min-h-8 py-0.5 hover:bg-slate-200/10 rounded transition-colors pl-6 sm:pl-8 relative">
                <span className="absolute left-0 w-6 sm:w-7 text-right pr-1.5 sm:pr-2 text-slate-400 select-none text-[9px] sm:text-[10px] font-bold font-sans mt-0.5">{line.lineNum}</span>
                <span className="text-slate-700 whitespace-pre font-semibold leading-7 sm:leading-8 text-[11px] sm:text-[13px]">{line.textBefore}</span>
                
                {isSolved ? (
                  <span className="font-bold px-1.5 sm:px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 text-[11px] sm:text-sm">
                    {line.correctAnswer}
                  </span>
                ) : (
                  <input
                    type="text"
                    inputMode="decimal"
                    value={currentVal}
                    onChange={e => onInputChange(inputIdx, e.target.value)}
                    className={`font-mono font-bold px-2 py-1.5 sm:py-1 rounded-lg border-2 outline-none transition-all ${
                      currentVal 
                        ? 'border-blue-300 bg-blue-50 text-blue-700' 
                        : 'border-slate-200 bg-slate-50 text-slate-600'
                    }`}
                    style={{ 
                      fontSize: '16px', 
                      width: `${(line.widthChars || 6) * 9 + 16}px`, 
                      minWidth: '3.5ch',
                      height: '32px',
                      display: 'inline-block',
                      verticalAlign: 'middle',
                      margin: '2px 4px'
                    }}
                    placeholder="?"
                  />
                )}
                
                <span className="text-slate-700 whitespace-pre font-semibold leading-7 sm:leading-8 text-[11px] sm:text-[13px]">{line.textAfter}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BoardExamNotebook;
