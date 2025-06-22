import { FlipDotState, AnimationFrame, GridDimensions } from '@/types';

export const createEmptyDots = (dimensions: GridDimensions): FlipDotState[][] => {
  return Array(dimensions.rows).fill(null).map(() =>
    Array(dimensions.columns).fill(null).map(() => ({ active: false }))
  );
};

export const createAnimationFrame = (dots: FlipDotState[][]): AnimationFrame => {
  return {
    id: Math.random().toString(36).substring(2, 15),
    dots: dots.map(row => row.map(dot => ({ ...dot }))),
    timestamp: Date.now()
  };
};

export const resizeDots = (
  currentDots: FlipDotState[][],
  newDimensions: GridDimensions
): FlipDotState[][] => {
  const newDots = createEmptyDots(newDimensions);
  
  for (let row = 0; row < Math.min(currentDots.length, newDimensions.rows); row++) {
    for (let col = 0; col < Math.min(currentDots[row].length, newDimensions.columns); col++) {
      newDots[row][col] = { ...currentDots[row][col] };
    }
  }
  
  return newDots;
};

export const clearDots = (dimensions: GridDimensions): FlipDotState[][] => {
  return createEmptyDots(dimensions);
};