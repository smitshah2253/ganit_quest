import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Sparkles, Lightbulb, Play, ArrowRight, HelpCircle, Award, CheckCircle } from 'lucide-react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import type { LevelSpecification } from '../data/levelSpecs';

interface ConceptBookProps {
  spec: LevelSpecification;
  onClose: () => void;
}

const KaTeXFormula: React.FC<{ latex: string; className?: string }> = ({ latex, className }) => {
  const html = useMemo(() => {
    try {
      return katex.renderToString(latex, { throwOnError: false, displayMode: true });
    } catch {
      return latex;
    }
  }, [latex]);

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export const ConceptBook: React.FC<ConceptBookProps> = ({ spec, onClose }) => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const page = spec.bookPage;

  const containerVariants: any = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { duration: 0.4, ease: "easeOut", staggerChildren: 0.05 }
    },
    exit: { opacity: 0, scale: 0.98, y: -10, transition: { duration: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/40 backdrop-blur-md select-none">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="w-full max-w-5xl h-[90vh] sm:h-[85vh] bg-white/95 border border-slate-200/80 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col relative"
      >
        {/* Soft elegant ambient glows */}
        <div className="absolute top-10 left-10 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        
        {/* Header Bar */}
        <div className="px-4 sm:px-8 py-3 sm:py-4.5 bg-slate-50 border-b border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="bg-blue-500/10 p-2 sm:p-2.5 rounded-xl text-blue-600 border border-blue-500/20">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <span className="text-[9px] sm:text-[10px] font-semibold text-blue-600 uppercase tracking-widest block">interactive guide</span>
              <h1 className="text-lg sm:text-xl font-bold text-slate-800">{page.title}</h1>
            </div>
          </div>
          
          <div className="flex gap-1 sm:gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 w-full sm:w-auto justify-center">
            {page.stepByStep.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-lg font-bold text-[10px] sm:text-xs transition-all flex items-center justify-center cursor-pointer ${
                  activeStep === idx 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Two-Page Book Workspace */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden p-3 sm:p-6 md:p-8 gap-3 sm:gap-6">
          
          {/* Left Page: Concept & Formula */}
          <div className="flex-1 bg-slate-50/50 rounded-2xl p-4 sm:p-6 border border-slate-200 flex flex-col justify-between overflow-y-auto">
            <motion.div variants={itemVariants} className="space-y-4 sm:space-y-6">
              <div>
                <h3 className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 sm:mb-2.5 flex items-center gap-1.5 border-b border-slate-200 pb-1 sm:pb-1.5">
                  <Lightbulb className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-500" />
                  the core idea
                </h3>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
                  {page.concept}
                </p>
              </div>

              {/* High Contrast Formula Card */}
              <div className="relative group bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 text-slate-800 overflow-hidden shadow-md">
                <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 text-blue-500/5 group-hover:scale-105 transition-transform duration-300">
                  <Sparkles className="w-16 h-16 sm:w-24 sm:h-24 fill-current" />
                </div>
                
                <span className="text-[8px] sm:text-[9px] uppercase font-bold tracking-wider text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">
                  Formula Breakdown
                </span>
                
                <div className="mt-2 sm:mt-3 mb-1 sm:mb-1.5">
                  <KaTeXFormula
                    latex={spec.formulaDisplay}
                    className="text-blue-600 text-lg sm:text-xl"
                  />
                </div>
                <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed font-medium">
                  {page.formulaBreakdown}
                </p>
              </div>

              {/* Conceptual Analogy */}
              <div className="bg-white rounded-xl p-3 sm:p-4.5 border border-slate-200 flex gap-3 sm:gap-4 items-start shadow-sm">
                <div className="p-1.5 sm:p-2 bg-slate-50 border border-slate-200 text-slate-500 rounded-lg shrink-0">
                  <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-700 text-[11px] sm:text-xs mb-1">Visual Analogy</h4>
                  <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed font-medium">
                    Think of volume as the amount of sand or fluid needed to fill a solid. Surface area represents the precise size of outer sheets enclosing it.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Practical tips */}
            <motion.div 
              variants={itemVariants} 
              className="mt-4 sm:mt-6 p-3 sm:p-4 rounded-xl bg-white border border-slate-200 text-slate-600 flex gap-2 sm:gap-3 items-center shadow-sm"
            >
              <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500 shrink-0" />
              <p className="text-[11px] sm:text-xs font-semibold leading-relaxed">{page.visualTip}</p>
            </motion.div>
          </div>

          {/* Right Page: Guided problem solver */}
          <div className="flex-1 bg-slate-50/50 rounded-2xl p-4 sm:p-6 border border-slate-200 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-4 sm:space-y-5">
              <h3 className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-200 pb-1 sm:pb-1.5">
                <CheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-500" />
                step-by-step example
              </h3>
              
              <div className="space-y-2 sm:space-y-3">
                {page.stepByStep.map((step, index) => {
                  const isPast = index < activeStep;
                  const isActive = index === activeStep;
                  
                  return (
                    <motion.div
                      key={index}
                      onClick={() => setActiveStep(index)}
                      className={`p-3 sm:p-4 rounded-xl border transition-all cursor-pointer flex gap-3 sm:gap-4 items-start ${
                        isActive
                          ? 'border-blue-500/50 bg-blue-500/10 shadow-md ring-1 ring-blue-500/20'
                          : isPast
                          ? 'border-emerald-500/20 bg-emerald-500/5'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                      whileHover={{ x: 3 }}
                    >
                      <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-md font-bold text-[10px] sm:text-xs flex items-center justify-center shrink-0 border ${
                        isPast
                          ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
                          : isActive
                          ? 'bg-blue-600 text-white border-blue-500'
                          : 'bg-slate-50 text-slate-400 border-slate-200'
                      }`}>
                        {index + 1}
                      </div>
                      
                      <div className="space-y-1">
                        <p className={`text-[11px] sm:text-xs font-semibold leading-relaxed ${
                          isActive ? 'text-slate-800 font-bold' : isPast ? 'text-slate-500' : 'text-slate-400'
                        }`}>
                          {step}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Dynamic Controls */}
            <div className="mt-6 sm:mt-8 flex gap-3 sm:gap-4 shrink-0">
              {activeStep < page.stepByStep.length - 1 ? (
                <button
                  onClick={() => setActiveStep(prev => prev + 1)}
                  className="w-full py-3 sm:py-3.5 rounded-xl font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all flex items-center justify-center gap-2 group text-[11px] sm:text-xs uppercase tracking-wider cursor-pointer"
                >
                  <span>Next Step</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              ) : (
                <button
                  onClick={onClose}
                  className="w-full py-3 sm:py-3.5 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all flex items-center justify-center gap-2 text-[11px] sm:text-xs uppercase tracking-wider cursor-pointer"
                >
                  <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
                  <span>Let's Start!</span>
                </button>
              )}
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
};
