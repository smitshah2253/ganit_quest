import React from 'react';
import { Star, ArrowRight, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

interface ResultScreenProps {
  onNext: () => void;
  onRetry: () => void;
  starsEarned: number;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({ onNext, onRetry, starsEarned }) => {
  // Sequence delays for star scaling animation
  const starVariants = {
    hidden: { scale: 0, rotate: -30, filter: 'drop-shadow(0 0 0px rgba(250, 204, 21, 0))' },
    show: (i: number) => ({
      scale: 1.1,
      rotate: 0,
      filter: 'drop-shadow(0 0 15px rgba(250, 204, 21, 0.95))',
      transition: {
        type: 'spring' as const,
        stiffness: 260,
        damping: 15,
        delay: 0.15 * i,
      }
    })
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md select-none">
      {/* Outer wrapper container for pop in feel */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', duration: 0.5 }}
        className="bg-[#181a1c]/85 backdrop-blur-xl p-10 rounded-[2.5rem] border border-slate-800/80 shadow-[0_0_50px_rgba(6,182,212,0.18)] text-center max-w-sm w-full mx-4 relative overflow-hidden"
      >
        {/* Soft background cyan/purple ambient blobs inside the card */}
        <div className="absolute -top-16 -left-16 w-36 h-36 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-36 h-36 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Stars Container */}
        <div className="flex justify-center gap-5 mb-10 relative z-10">
          {[0, 1, 2].map((idx) => {
            const isFilled = idx < starsEarned;
            return (
              <motion.div
                key={idx}
                custom={idx}
                initial="hidden"
                animate="show"
                variants={starVariants}
                className="relative"
              >
                <Star 
                  className={`w-16 h-16 ${
                    isFilled 
                      ? 'fill-amber-400 text-amber-400 animate-pulse' 
                      : 'text-slate-700 fill-slate-800'
                  }`}
                  style={{
                    filter: isFilled ? 'drop-shadow(0 0 12px rgba(250, 204, 21, 0.7))' : 'none'
                  }}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Action Buttons Row */}
        <div className="flex gap-4 relative z-10 w-full">
          {/* Retry Icon Button */}
          <motion.button 
            whileHover={{ scale: 1.06, boxShadow: '0 0 20px rgba(6,182,212,0.55)' }}
            whileTap={{ scale: 0.96 }}
            onClick={onRetry}
            className="w-14 h-14 flex items-center justify-center rounded-full bg-[#121314] border border-cyan-500/60 shadow-[0_0_12px_rgba(6,182,212,0.3)] transition-all duration-300 cursor-pointer outline-none"
            title="Retry Level"
          >
            <RotateCcw className="w-5.5 h-5.5 text-white" />
          </motion.button>
          
          {/* Next Level Capsule Button */}
          <motion.button 
            whileHover={{ scale: 1.03, boxShadow: '0 0 22px rgba(6,182,212,0.6)' }}
            whileTap={{ scale: 0.98 }}
            onClick={onNext}
            className="flex-1 flex items-center justify-center h-14 rounded-full bg-[#121314] border border-cyan-500/60 shadow-[0_0_12px_rgba(6,182,212,0.3)] transition-all duration-300 cursor-pointer outline-none"
          >
            <span className="mr-2 uppercase tracking-wider text-xs font-black text-white">Next Level</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
