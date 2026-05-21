import React from 'react';
import { Star, ArrowRight, RotateCcw, Trophy, Zap, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface ResultScreenProps {
  onNext: () => void;
  onRetry: () => void;
  starsEarned: number;
}

const ConfettiParticle: React.FC<{ delay: number; x: number; color: string }> = ({ delay, x, color }) => (
  <motion.div
    className="absolute w-2 h-2 rounded-full pointer-events-none"
    style={{ backgroundColor: color, left: `${x}%`, top: '40%' }}
    initial={{ opacity: 0, y: 0, scale: 0 }}
    animate={{
      opacity: [0, 1, 1, 0],
      y: [0, -80, -40, 60],
      x: [0, (Math.random() - 0.5) * 120],
      scale: [0, 1.2, 0.8, 0],
      rotate: [0, 360, 720],
    }}
    transition={{ duration: 2, delay, ease: 'easeOut' }}
  />
);

export const ResultScreen: React.FC<ResultScreenProps> = ({ onNext, onRetry, starsEarned }) => {
  const xpEarned = starsEarned * 50;
  const confettiColors = ['#f97316', '#6366f1', '#10b981', '#f59e0b', '#ec4899', '#06b6d4', '#8b5cf6'];

  const starVariants = {
    hidden: { scale: 0, rotate: -45, opacity: 0 },
    show: (i: number) => ({
      scale: 1,
      rotate: 0,
      opacity: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 300,
        damping: 12,
        delay: 0.3 + 0.2 * i,
      }
    })
  };

  const getMessage = () => {
    if (starsEarned === 3) return { title: 'Perfect!', subtitle: 'You nailed it! Flawless victory!' };
    if (starsEarned === 2) return { title: 'Great Job!', subtitle: 'Almost perfect — keep going!' };
    return { title: 'Good Try!', subtitle: 'You can do even better next time!' };
  };

  const { title, subtitle } = getMessage();

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center select-none">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onNext}
      />

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="relative bg-white rounded-3xl sm:rounded-[2rem] shadow-2xl border border-slate-200/80 text-center max-w-md w-[92%] sm:w-full mx-auto overflow-hidden"
      >
        {/* Confetti Particles */}
        {starsEarned >= 2 && confettiColors.map((color, i) => (
          <React.Fragment key={i}>
            <ConfettiParticle delay={0.1 * i} x={10 + i * 12} color={color} />
            <ConfettiParticle delay={0.15 * i + 0.3} x={15 + i * 11} color={confettiColors[(i + 3) % confettiColors.length]} />
          </React.Fragment>
        ))}

        {/* Top Gradient Banner */}
        <div className="relative bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-400 px-6 pt-8 pb-14 sm:pt-10 sm:pb-16">
          {/* Decorative circles */}
          <div className="absolute top-4 right-6 w-16 h-16 rounded-full bg-white/10 blur-lg" />
          <div className="absolute bottom-6 left-8 w-12 h-12 rounded-full bg-white/10 blur-lg" />

          {/* Trophy Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 250, damping: 15, delay: 0.1 }}
            className="mx-auto w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 border border-white/30"
          >
            <Trophy className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
          </motion.div>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl sm:text-3xl font-black text-white tracking-tight"
          >
            {title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="text-white/80 text-xs sm:text-sm font-medium mt-1.5"
          >
            {subtitle}
          </motion.p>
        </div>

        {/* Stars Row - overlapping the banner */}
        <div className="flex justify-center gap-3 sm:gap-4 -mt-8 sm:-mt-10 relative z-10 mb-5 sm:mb-6">
          {[0, 1, 2].map((idx) => {
            const isFilled = idx < starsEarned;
            return (
              <motion.div
                key={idx}
                custom={idx}
                initial="hidden"
                animate="show"
                variants={starVariants}
                className={`relative w-14 h-14 sm:w-[4.5rem] sm:h-[4.5rem] rounded-2xl flex items-center justify-center ${
                  isFilled
                    ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-400/40 border-2 border-amber-300/60'
                    : 'bg-slate-100 border-2 border-slate-200'
                }`}
              >
                <Star
                  className={`w-7 h-7 sm:w-9 sm:h-9 ${
                    isFilled
                      ? 'fill-white text-white drop-shadow-sm'
                      : 'text-slate-300 fill-slate-200'
                  }`}
                />
                {isFilled && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 + idx * 0.2, type: 'spring' }}
                    className="absolute -top-1 -right-1"
                  >
                    <Sparkles className="w-4 h-4 text-amber-500" />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* XP Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, type: 'spring' }}
          className="mx-auto mb-6 sm:mb-8 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 rounded-xl px-5 py-2.5 w-fit shadow-sm"
        >
          <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 fill-emerald-600" />
          <span className="text-sm sm:text-base font-bold text-emerald-700">+{xpEarned} XP</span>
          <span className="text-[10px] sm:text-xs font-semibold text-emerald-500 uppercase tracking-wider">earned</span>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex gap-3 px-5 sm:px-8 pb-6 sm:pb-8 relative z-10">
          {/* Retry Button */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onRetry}
            className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-xl sm:rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors duration-200 cursor-pointer outline-none shrink-0"
            title="Retry Level"
          >
            <RotateCcw className="w-5 h-5 text-slate-600" />
          </motion.button>

          {/* Next Level Button */}
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(249, 115, 22, 0.35)' }}
            whileTap={{ scale: 0.98 }}
            onClick={onNext}
            className="flex-1 flex items-center justify-center gap-2 h-12 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-500/25 transition-all duration-200 cursor-pointer outline-none"
          >
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider">Next Level</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
