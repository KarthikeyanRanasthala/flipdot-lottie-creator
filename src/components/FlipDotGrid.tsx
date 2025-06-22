import React from 'react';
import { cn } from '@/lib/utils';
import { FlipDotState, GridDimensions, ColorSettings } from '@/types';

interface FlipDotGridProps {
  dots: FlipDotState[][];
  dimensions: GridDimensions;
  colors: ColorSettings;
  onDotClick: (row: number, col: number) => void;
  className?: string;
}

export const FlipDotGrid: React.FC<FlipDotGridProps> = ({
  dots,
  dimensions,
  colors,
  onDotClick,
  className
}) => {
  // Calculate the appropriate size for the grid container
  const maxSize = 500;
  const padding = 48; // 6 * 8px (p-6 = 1.5rem = 24px on each side)
  
  // For mobile, use screen width with padding
  const mobileHorizontalPadding = 32; // 16px on each side for mobile
  const availableSize = Math.min(maxSize - padding, window.innerWidth - mobileHorizontalPadding - padding);
  
  // Calculate gap size based on grid dimensions (smaller grids get larger gaps)
  const baseGap = Math.max(4, Math.min(12, Math.floor(availableSize / (Math.max(dimensions.rows, dimensions.columns) * 8))));
  const totalGapSize = baseGap * (Math.max(dimensions.rows, dimensions.columns) - 1);
  
  // Calculate dot size to fit within the available space
  const dotSize = Math.floor((availableSize - totalGapSize) / Math.max(dimensions.rows, dimensions.columns));
  
  const gridStyle = {
    gridTemplateRows: `repeat(${dimensions.rows}, ${dotSize}px)`,
    gridTemplateColumns: `repeat(${dimensions.columns}, ${dotSize}px)`,
    backgroundColor: colors.background,
    gap: `${baseGap}px`,
    width: 'fit-content',
    height: 'fit-content',
    maxWidth: `${Math.min(maxSize, window.innerWidth - mobileHorizontalPadding)}px`,
    maxHeight: `${Math.min(maxSize, window.innerWidth - mobileHorizontalPadding)}px`,
  };

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <div 
        className="grid p-6 rounded-lg border"
        style={gridStyle}
      >
        {dots.map((row, rowIndex) =>
          row.map((dot, colIndex) => (
            <button
              key={`${rowIndex}-${colIndex}`}
              onClick={() => onDotClick(rowIndex, colIndex)}
              className={cn(
                "rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400",
                "transform-gpu will-change-transform"
              )}
              style={{
                width: `${dotSize}px`,
                height: `${dotSize}px`,
                backgroundColor: dot.active ? colors.activeDot : colors.inactiveDot,
                boxShadow: dot.active 
                  ? `0 0 20px ${colors.activeDot}40, inset 0 0 10px ${colors.activeDot}20`
                  : `inset 0 2px 4px rgba(0,0,0,0.3)`,
              }}
              aria-label={`Dot at row ${rowIndex + 1}, column ${colIndex + 1}, ${dot.active ? 'active' : 'inactive'}`}
            />
          ))
        )}
      </div>
    </div>
  );
};