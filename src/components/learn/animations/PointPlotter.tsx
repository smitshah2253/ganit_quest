import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MousePointer, Trash2, Info } from 'lucide-react';
import { CoordinateGrid } from './CoordinateGrid';

interface PlottedPoint {
  x: number;
  y: number;
  id: number;
}

export const PointPlotter: React.FC = () => {
  const [points, setPoints] = useState<PlottedPoint[]>([]);
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number } | null>(null);
  const [showInstructions, setShowInstructions] = useState(true);
  const [nextId, setNextId] = useState(1);

  const handlePointClick = (x: number, y: number) => {
    // Check if point already exists
    const exists = points.some(p => p.x === x && p.y === y);
    if (exists) return;

    setPoints([...points, { x, y, id: nextId }]);
    setNextId(nextId + 1);
    setShowInstructions(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Convert to grid coordinates (approximate for preview)
    const gridX = Math.round((x - 200) / 20);
    const gridY = Math.round((200 - y) / 20);
    
    if (gridX >= -10 && gridX <= 10 && gridY >= -10 && gridY <= 10) {
      setHoveredPoint({ x: gridX, y: gridY });
    } else {
      setHoveredPoint(null);
    }
  };

  const clearPoints = () => {
    setPoints([]);
    setNextId(1);
    setShowInstructions(true);
  };

  const removePoint = (id: number) => {
    setPoints(points.filter(p => p.id !== id));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Interactive Point Plotter</h3>
          <p className="text-sm text-slate-600">Click anywhere on the grid to plot points</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowInstructions(!showInstructions)}
            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Info className="w-5 h-5" />
          </button>
          <button
            onClick={clearPoints}
            className="flex items-center gap-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showInstructions && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-4"
          >
            <div className="flex items-start gap-3">
              <MousePointer className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">How to use:</p>
                <ul className="list-disc list-inside space-y-1 text-blue-700">
                  <li>Click anywhere on the grid to plot a point</li>
                  <li>Each point shows its coordinates (x, y)</li>
                  <li>Try plotting points in different quadrants</li>
                  <li>Observe how coordinates change based on position</li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div 
        className="flex justify-center"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredPoint(null)}
      >
        <CoordinateGrid
          onPointClick={handlePointClick}
          points={points.map(p => ({ x: p.x, y: p.y, label: `P${p.id}` }))}
          highlightedPoint={hoveredPoint}
        />
      </div>

      {points.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-50 rounded-lg p-4"
        >
          <h4 className="font-semibold text-slate-800 mb-3">Plotted Points</h4>
          <div className="flex flex-wrap gap-2">
            {points.map((point) => (
              <motion.button
                key={point.id}
                layout
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                onClick={() => removePoint(point.id)}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-colors group"
              >
                <span className="w-3 h-3 rounded-full bg-orange-500" />
                <span className="text-sm font-medium text-slate-700">
                  P{point.id}({point.x}, {point.y})
                </span>
                <span className="text-xs text-slate-400 group-hover:text-red-500">
                  ×
                </span>
              </motion.button>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-2">Click on a point to remove it</p>
        </motion.div>
      )}

      {points.length >= 2 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-orange-50 border border-orange-200 rounded-lg p-4"
        >
          <p className="text-sm text-orange-800">
            <span className="font-semibold">Try this:</span> You have plotted {points.length} points. 
            Try the Distance Formula or Midpoint Formula tools below to explore relationships between these points!
          </p>
        </motion.div>
      )}
    </div>
  );
};
