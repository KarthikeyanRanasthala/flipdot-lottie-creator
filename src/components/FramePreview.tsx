import React from 'react';
import { cn } from '@/lib/utils';
import { FlipDotState, GridDimensions, ColorSettings } from '@/types';

interface FramePreviewProps {
  dots: FlipDotState[][];
  dimensions: GridDimensions;
  colors: ColorSettings;
  isSelected: boolean;
  isPlaying: boolean;
  frameNumber: number;
  onClick: () => void;
  className?: string;
}

export const FramePreview: React.FC<FramePreviewProps> = ({
  dots,
  dimensions,
  colors,
  isSelected,
  isPlaying,
  frameNumber,
  onClick,
  className
}) => {
  // Calculate appropriate size for preview (much smaller than main grid)
  const previewSize = 80;
  const padding = 8;
  const availableSize = previewSize - padding;
  
  // Calculate gap and dot size for preview
  const baseGap = Math.max(1, Math.floor(availableSize / (Math.max(dimensions.rows, dimensions.columns) * 6)));
  const totalGapSize = baseGap * (Math.max(dimensions.rows, dimensions.columns) - 1);
  const dotSize = Math.max(2, Math.floor((availableSize - totalGapSize) / Math.max(dimensions.rows, dimensions.columns)));
  
  const gridStyle = {
    gridTemplateRows: `repeat(${dimensions.rows}, ${dotSize}px)`,
    gridTemplateColumns: `repeat(${dimensions.columns}, ${dotSize}px)`,
    backgroundColor: colors.background,
    gap: `${baseGap}px`,
    width: 'fit-content',
    height: 'fit-content',
  };

  return (
    <div className={cn("relative", className)}>
      <button
        onClick={onClick}
        className={cn(
          "relative rounded-lg border-2 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400",
          isSelected 
            ? "border-blue-500 bg-blue-500/10" 
            : "border-border hover:border-blue-300",
          isPlaying && isSelected && "ring-2 ring-blue-400 ring-opacity-50"
        )}
        style={{ width: previewSize, height: previewSize }}
      >
        <div className="flex items-center justify-center w-full h-full p-1">
          <div 
            className="grid rounded"
            style={gridStyle}
          >
            {dots.map((row, rowIndex) =>
              row.map((dot, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className="rounded-full"
                  style={{
                    width: `${dotSize}px`,
                    height: `${dotSize}px`,
                    backgroundColor: dot.active ? colors.activeDot : colors.inactiveDot,
                  }}
                />
              ))
            )}
          </div>
        </div>
        
        {/* Frame number badge */}
        <div className="absolute -top-2 -right-2 bg-background border rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium">
          {frameNumber}
        </div>
        
        {/* Playing indicator */}
        {isPlaying && isSelected && (
          <div className="absolute top-1 left-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        )}
      </button>
    </div>
  );
};