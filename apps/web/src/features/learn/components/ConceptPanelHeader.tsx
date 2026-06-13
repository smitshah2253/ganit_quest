import React from 'react';
import { GraduationCap, BookOpen } from 'lucide-react';

interface ConceptPanelHeaderProps {
  levelType: string;
  onOpenBook: () => void;
}

export const ConceptPanelHeader: React.FC<ConceptPanelHeaderProps> = ({ 
  levelType, 
  onOpenBook 
}) => {
  return (
    <div className="flex items-center justify-between shrink-0 select-none">
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-55 border border-slate-200 text-slate-600 font-bold text-xs uppercase tracking-wider">
        <GraduationCap className="w-3.5 h-3.5 text-orange-500 animate-bounce" />
        <span>{levelType.replace('_', ' ')}</span>
      </div>
      
      <button
        onClick={onOpenBook}
        className="flex items-center gap-1.5 text-xs font-bold text-indigo-650 hover:text-orange-600 transition-colors uppercase tracking-wider cursor-pointer"
      >
        <BookOpen className="w-3.5 h-3.5" />
        <span>View Formula Book</span>
      </button>
    </div>
  );
};

export default ConceptPanelHeader;
