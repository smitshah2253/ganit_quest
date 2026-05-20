import React from 'react';
import { Star, ArrowRight, RotateCcw } from 'lucide-react';

interface ResultScreenProps {
  onNext: () => void;
  onRetry: () => void;
  starsEarned: number;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({ onNext, onRetry, starsEarned }) => {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-[var(--color-dark-surface)] p-8 rounded-3xl border border-[var(--color-neon-blue)]/30 shadow-[0_0_50px_rgba(0,240,255,0.15)] text-center max-w-md w-full transform transition-all scale-100 animate-in zoom-in-95">
        <h2 className="text-4xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-neon-blue)] to-[var(--color-neon-purple)]">
          Level Complete!
        </h2>
        
        <div className="flex justify-center gap-4 mb-8">
          {[1, 2, 3].map((star) => (
            <Star 
              key={star}
              className={`w-16 h-16 transition-all duration-500 delay-${star * 100} ${
                star <= starsEarned 
                  ? 'fill-yellow-400 text-yellow-400 scale-110 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]' 
                  : 'text-gray-600 scale-90'
              }`} 
            />
          ))}
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <button 
            onClick={onRetry}
            className="flex items-center justify-center p-4 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors border border-gray-600 hover:border-gray-400"
          >
            <RotateCcw className="w-6 h-6 text-white" />
          </button>
          
          <button 
            onClick={onNext}
            className="flex-1 flex items-center justify-center py-4 px-6 rounded-full font-bold text-black bg-[var(--color-neon-blue)] hover:bg-[var(--color-neon-blue)]/90 transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)]"
          >
            <span className="mr-2">NEXT LEVEL</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
