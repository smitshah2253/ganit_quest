import React from 'react';
import { motion } from 'framer-motion';

interface CoordinateGridProps {
  onPointClick?: (x: number, y: number) => void;
  points?: Array<{ x: number; y: number; label?: string }>;
  highlightedPoint?: { x: number; y: number } | null;
}

const GRID_SIZE = 400;
const GRID_CENTER = GRID_SIZE / 2;
const SCALE = 20; // pixels per unit

export const CoordinateGrid: React.FC<CoordinateGridProps> = ({
  onPointClick,
  points = [],
  highlightedPoint
}) => {
  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!onPointClick) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Convert pixel coordinates to grid coordinates
    const gridX = Math.round((x - GRID_CENTER) / SCALE);
    const gridY = Math.round((GRID_CENTER - y) / SCALE);
    
    onPointClick(gridX, gridY);
  };

  // Generate grid lines
  const gridLines = [];
  for (let i = -10; i <= 10; i++) {
    const pos = GRID_CENTER + i * SCALE;
    
    // Vertical lines
    gridLines.push(
      <line
        key={`v${i}`}
        x1={pos}
        y1={0}
        x2={pos}
        y2={GRID_SIZE}
        stroke={i === 0 ? '#f97316' : '#e2e8f0'}
        strokeWidth={i === 0 ? 2 : 1}
      />
    );
    
    // Horizontal lines
    gridLines.push(
      <line
        key={`h${i}`}
        x1={0}
        y1={pos}
        x2={GRID_SIZE}
        y2={pos}
        stroke={i === 0 ? '#f97316' : '#e2e8f0'}
        strokeWidth={i === 0 ? 2 : 1}
      />
    );
  }

  return (
    <svg
      width={GRID_SIZE}
      height={GRID_SIZE}
      className="bg-white rounded-lg shadow-inner cursor-crosshair"
      onClick={handleClick}
    >
      {/* Grid background */}
      <rect width={GRID_SIZE} height={GRID_SIZE} fill="#fafafa" />
      
      {/* Grid lines with animation */}
      {gridLines.map((line, i) => (
        <motion.g
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.01, duration: 0.3 }}
        >
          {line}
        </motion.g>
      ))}

      {/* Axis labels */}
      <text x={GRID_SIZE - 20} y={GRID_CENTER - 10} className="text-xs fill-slate-500 font-semibold">X</text>
      <text x={GRID_CENTER + 10} y={20} className="text-xs fill-slate-500 font-semibold">Y</text>
      
      {/* Number labels on axes */}
      {[-10, -5, 5, 10].map(num => (
        <React.Fragment key={num}>
          <text
            x={GRID_CENTER + num * SCALE}
            y={GRID_CENTER + 20}
            textAnchor="middle"
            className="text-[10px] fill-slate-400"
          >
            {num}
          </text>
          <text
            x={GRID_CENTER - 20}
            y={GRID_CENTER - num * SCALE + 4}
            textAnchor="middle"
            className="text-[10px] fill-slate-400"
          >
            {num}
          </text>
        </React.Fragment>
      ))}

      {/* Quadrant labels */}
      <text x={GRID_CENTER + 80} y={GRID_CENTER - 80} className="text-xs fill-slate-300 font-semibold">I</text>
      <text x={GRID_CENTER - 80} y={GRID_CENTER - 80} className="text-xs fill-slate-300 font-semibold">II</text>
      <text x={GRID_CENTER - 80} y={GRID_CENTER + 80} className="text-xs fill-slate-300 font-semibold">III</text>
      <text x={GRID_CENTER + 80} y={GRID_CENTER + 80} className="text-xs fill-slate-300 font-semibold">IV</text>

      {/* Plotted points */}
      {points.map((point, i) => (
        <motion.g
          key={i}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <circle
            cx={GRID_CENTER + point.x * SCALE}
            cy={GRID_CENTER - point.y * SCALE}
            r={6}
            fill="#f97316"
            stroke="white"
            strokeWidth={2}
          />
          {point.label && (
            <text
              x={GRID_CENTER + point.x * SCALE + 12}
              y={GRID_CENTER - point.y * SCALE - 8}
              className="text-xs fill-slate-700 font-semibold"
            >
              {point.label}({point.x}, {point.y})
            </text>
          )}
        </motion.g>
      ))}

      {/* Highlighted point */}
      {highlightedPoint && (
        <motion.g
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        >
          <circle
            cx={GRID_CENTER + highlightedPoint.x * SCALE}
            cy={GRID_CENTER - highlightedPoint.y * SCALE}
            r={10}
            fill="none"
            stroke="#f97316"
            strokeWidth={3}
            strokeDasharray="4 2"
          />
          <text
            x={GRID_CENTER + highlightedPoint.x * SCALE + 15}
            y={GRID_CENTER - highlightedPoint.y * SCALE - 15}
            className="text-sm fill-orange-600 font-bold"
          >
            ({highlightedPoint.x}, {highlightedPoint.y})
          </text>
        </motion.g>
      )}
    </svg>
  );
};
