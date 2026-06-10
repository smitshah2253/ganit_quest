import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, Calculator } from 'lucide-react';
import { CoordinateGrid } from './CoordinateGrid';

interface Point {
  x: number;
  y: number;
}

export const DistanceVisualizer: React.FC = () => {
  const [pointA, setPointA] = useState<Point>({ x: 2, y: 3 });
  const [pointB, setPointB] = useState<Point>({ x: 6, y: 6 });
  const [animating, setAnimating] = useState(false);
  const [step, setStep] = useState(0);

  const GRID_SIZE = 400;
  const GRID_CENTER = GRID_SIZE / 2;
  const SCALE = 20;

  const distance = Math.sqrt(
    Math.pow(pointB.x - pointA.x, 2) + Math.pow(pointB.y - pointA.y, 2)
  );

  const dx = Math.abs(pointB.x - pointA.x);
  const dy = Math.abs(pointB.y - pointA.y);

  const startAnimation = () => {
    setAnimating(true);
    setStep(0);
    
    const interval = setInterval(() => {
      setStep(s => {
        if (s >= 4) {
          clearInterval(interval);
          setAnimating(false);
          return 4;
        }
        return s + 1;
      });
    }, 1500);
  };

  const reset = () => {
    setAnimating(false);
    setStep(0);
    setPointA({ x: 2, y: 3 });
    setPointB({ x: 6, y: 6 });
  };

  const toPixel = (coord: number, isX: boolean) => {
    return isX 
      ? GRID_CENTER + coord * SCALE 
      : GRID_CENTER - coord * SCALE;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Distance Formula Visualizer</h3>
          <p className="text-sm text-slate-600">See how the distance formula comes from the Pythagorean theorem</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={startAnimation}
            disabled={animating}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors"
          >
            <Play className="w-4 h-4" />
            {animating ? 'Playing...' : 'Animate'}
          </button>
          <button
            onClick={reset}
            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex justify-center">
        <svg width={GRID_SIZE} height={GRID_SIZE} className="bg-slate-50 rounded-lg">
          {/* Grid */}
          <CoordinateGrid points={[]} />
          
          {/* Points */}
          <motion.circle
            cx={toPixel(pointA.x, true)}
            cy={toPixel(pointA.y, false)}
            r={8}
            fill="#f97316"
            stroke="white"
            strokeWidth={2}
            drag
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            onDrag={(_, info) => {
              // Simple drag to update coordinates
              const newX = Math.round((info.point.x - GRID_CENTER) / SCALE);
              const newY = Math.round((GRID_CENTER - info.point.y) / SCALE);
              if (newX >= -10 && newX <= 10 && newY >= -10 && newY <= 10) {
                setPointA({ x: newX, y: newY });
              }
            }}
          />
          <motion.circle
            cx={toPixel(pointB.x, true)}
            cy={toPixel(pointB.y, false)}
            r={8}
            fill="#6366f1"
            stroke="white"
            strokeWidth={2}
          />

          {/* Labels */}
          <text
            x={toPixel(pointA.x, true) - 20}
            y={toPixel(pointA.y, false) - 15}
            className="text-sm font-bold fill-orange-600"
          >
            A({pointA.x}, {pointA.y})
          </text>
          <text
            x={toPixel(pointB.x, true) + 15}
            y={toPixel(pointB.y, false) - 15}
            className="text-sm font-bold fill-indigo-600"
          >
            B({pointB.x}, {pointB.y})
          </text>

          {/* Triangle construction animation */}
          <AnimatePresence>
            {step >= 1 && (
              <>
                {/* Horizontal line */}
                <motion.line
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  x1={toPixel(pointA.x, true)}
                  y1={toPixel(pointA.y, false)}
                  x2={toPixel(pointB.x, true)}
                  y2={toPixel(pointA.y, false)}
                  stroke="#22c55e"
                  strokeWidth={3}
                  strokeDasharray="5 5"
                />
                <motion.text
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  x={(toPixel(pointA.x, true) + toPixel(pointB.x, true)) / 2}
                  y={toPixel(pointA.y, false) + 20}
                  textAnchor="middle"
                  className="text-xs font-semibold fill-green-600"
                >
                  Δx = {dx}
                </motion.text>
              </>
            )}

            {step >= 2 && (
              <>
                {/* Vertical line */}
                <motion.line
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  x1={toPixel(pointB.x, true)}
                  y1={toPixel(pointA.y, false)}
                  x2={toPixel(pointB.x, true)}
                  y2={toPixel(pointB.y, false)}
                  stroke="#22c55e"
                  strokeWidth={3}
                  strokeDasharray="5 5"
                />
                <motion.text
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  x={toPixel(pointB.x, true) + 25}
                  y={(toPixel(pointA.y, false) + toPixel(pointB.y, false)) / 2}
                  className="text-xs font-semibold fill-green-600"
                >
                  Δy = {dy}
                </motion.text>
              </>
            )}

            {step >= 3 && (
              <>
                {/* Hypotenuse / Distance line */}
                <motion.line
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  x1={toPixel(pointA.x, true)}
                  y1={toPixel(pointA.y, false)}
                  x2={toPixel(pointB.x, true)}
                  y2={toPixel(pointB.y, false)}
                  stroke="#dc2626"
                  strokeWidth={4}
                />
                <motion.text
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  x={(toPixel(pointA.x, true) + toPixel(pointB.x, true)) / 2}
                  y={(toPixel(pointA.y, false) + toPixel(pointB.y, false)) / 2 - 20}
                  textAnchor="middle"
                  className="text-sm font-bold fill-red-600"
                >
                  d = {distance.toFixed(2)}
                </motion.text>
              </>
            )}
          </AnimatePresence>
        </svg>
      </div>

      {/* Formula Explanation */}
      <AnimatePresence>
        {step >= 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-50 rounded-lg p-4 space-y-2"
          >
            <div className="flex items-center gap-2 text-slate-700">
              <Calculator className="w-5 h-5 text-orange-600" />
              <span className="font-semibold">Distance Formula:</span>
            </div>
            <div className="flex items-center justify-center gap-4 text-lg">
              <span className="font-mono bg-white px-3 py-1 rounded border">
                d = √[(x₂-x₁)² + (y₂-y₁)²]
              </span>
            </div>
            
            {step >= 2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-slate-600 space-y-1"
              >
                <p>= √[({pointB.x}-{pointA.x})² + ({pointB.y}-{pointA.y})²]</p>
                <p>= √[{dx}² + {dy}²]</p>
                <p>= √[{dx * dx} + {dy * dy}]</p>
              </motion.div>
            )}
            
            {step >= 3 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <span className="text-2xl font-bold text-orange-600">
                  d = √{dx * dx + dy * dy} = {distance.toFixed(2)}
                </span>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-orange-50 rounded-lg p-3">
          <label className="text-xs font-semibold text-orange-700 uppercase">Point A</label>
          <div className="flex gap-2 mt-1">
            <input
              type="number"
              value={pointA.x}
              onChange={(e) => setPointA({ ...pointA, x: Number(e.target.value) })}
              className="w-16 px-2 py-1 text-sm border rounded"
              min={-10}
              max={10}
            />
            <input
              type="number"
              value={pointA.y}
              onChange={(e) => setPointA({ ...pointA, y: Number(e.target.value) })}
              className="w-16 px-2 py-1 text-sm border rounded"
              min={-10}
              max={10}
            />
          </div>
        </div>
        <div className="bg-indigo-50 rounded-lg p-3">
          <label className="text-xs font-semibold text-indigo-700 uppercase">Point B</label>
          <div className="flex gap-2 mt-1">
            <input
              type="number"
              value={pointB.x}
              onChange={(e) => setPointB({ ...pointB, x: Number(e.target.value) })}
              className="w-16 px-2 py-1 text-sm border rounded"
              min={-10}
              max={10}
            />
            <input
              type="number"
              value={pointB.y}
              onChange={(e) => setPointB({ ...pointB, y: Number(e.target.value) })}
              className="w-16 px-2 py-1 text-sm border rounded"
              min={-10}
              max={10}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
