import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FlipDotGrid } from '@/components/FlipDotGrid';
import { PlayerControls } from '@/components/PlayerControls';
import { PropertiesPanel } from '@/components/PropertiesPanel';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { 
  createEmptyDots, 
  createAnimationFrame, 
  resizeDots, 
  clearDots 
} from '@/utils/animationUtils';
import { AppState, AppSettings, AnimationFrame, FlipDotState } from '@/types';

const defaultSettings: AppSettings = {
  gridDimensions: { rows: 6, columns: 6 },
  colors: {
    background: '#1a1a1a',
    activeDot: '#22c55e',
    inactiveDot: '#374151'
  },
  frameDuration: 500
};

function App() {
  const [settings, setSettings] = useLocalStorage<AppSettings>('flipDotSettings', defaultSettings);
  const [frames, setFrames] = useState<AnimationFrame[]>([]);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentDots, setCurrentDots] = useState<FlipDotState[][]>(() => 
    createEmptyDots(settings.gridDimensions)
  );

  // Initialize first frame if frames are empty
  useEffect(() => {
    if (frames.length === 0) {
      const initialFrame = createAnimationFrame(createEmptyDots(settings.gridDimensions));
      setFrames([initialFrame]);
      setCurrentDots(initialFrame.dots);
    }
  }, [frames.length, settings.gridDimensions]);

  // Update current dots when frame changes
  useEffect(() => {
    if (frames.length > 0 && currentFrameIndex < frames.length) {
      setCurrentDots(frames[currentFrameIndex].dots);
    }
  }, [currentFrameIndex, frames]);

  // Handle grid dimension changes
  useEffect(() => {
    if (frames.length > 0) {
      const newFrames = frames.map(frame => ({
        ...frame,
        dots: resizeDots(frame.dots, settings.gridDimensions)
      }));
      setFrames(newFrames);
      setCurrentDots(resizeDots(currentDots, settings.gridDimensions));
    } else {
      setCurrentDots(createEmptyDots(settings.gridDimensions));
    }
  }, [settings.gridDimensions]);

  // Animation playback
  useEffect(() => {
    if (!isPlaying || frames.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentFrameIndex(prev => (prev + 1) % frames.length);
    }, settings.frameDuration);

    return () => clearInterval(interval);
  }, [isPlaying, frames.length, settings.frameDuration]);

  const handleDotClick = useCallback((row: number, col: number) => {
    if (frames.length === 0) return;

    const newDots = currentDots.map((dotRow, rowIndex) =>
      dotRow.map((dot, colIndex) => {
        if (rowIndex === row && colIndex === col) {
          return { ...dot, active: !dot.active };
        }
        return dot;
      })
    );

    setCurrentDots(newDots);

    // Update the current frame
    const newFrames = [...frames];
    newFrames[currentFrameIndex] = {
      ...newFrames[currentFrameIndex],
      dots: newDots
    };
    setFrames(newFrames);
  }, [currentDots, frames, currentFrameIndex]);

  const handlePlayPause = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const handlePreviousFrame = useCallback(() => {
    if (frames.length > 0) {
      setCurrentFrameIndex(prev => prev > 0 ? prev - 1 : frames.length - 1);
      setIsPlaying(false);
    }
  }, [frames.length]);

  const handleNextFrame = useCallback(() => {
    if (frames.length > 0) {
      setCurrentFrameIndex(prev => (prev + 1) % frames.length);
      setIsPlaying(false);
    }
  }, [frames.length]);

  const handleNewFrame = useCallback(() => {
    const newFrame = createAnimationFrame(createEmptyDots(settings.gridDimensions));
    const newFrames = [...frames];
    
    // Insert the new frame after the current frame
    const insertIndex = currentFrameIndex + 1;
    newFrames.splice(insertIndex, 0, newFrame);
    
    setFrames(newFrames);
    setCurrentFrameIndex(insertIndex);
    setIsPlaying(false);
  }, [frames, currentFrameIndex, settings.gridDimensions]);

  const handleDeleteFrame = useCallback(() => {
    if (frames.length <= 1) return; // Don't delete if it's the last frame

    const newFrames = frames.filter((_, index) => index !== currentFrameIndex);
    setFrames(newFrames);
    
    // Adjust current frame index
    if (currentFrameIndex >= newFrames.length) {
      setCurrentFrameIndex(newFrames.length - 1);
    }
    
    setIsPlaying(false);
  }, [frames, currentFrameIndex]);

  const handleClearFrame = useCallback(() => {
    if (frames.length === 0) return;

    const clearedDots = clearDots(settings.gridDimensions);
    setCurrentDots(clearedDots);

    const newFrames = [...frames];
    newFrames[currentFrameIndex] = {
      ...newFrames[currentFrameIndex],
      dots: clearedDots
    };
    setFrames(newFrames);
  }, [frames, currentFrameIndex, settings.gridDimensions]);

  const handleMoveFramePrevious = useCallback(() => {
    if (currentFrameIndex === 0 || frames.length <= 1) return;

    const newFrames = [...frames];
    const currentFrame = newFrames[currentFrameIndex];
    const previousFrame = newFrames[currentFrameIndex - 1];
    
    // Swap frames
    newFrames[currentFrameIndex] = previousFrame;
    newFrames[currentFrameIndex - 1] = currentFrame;
    
    setFrames(newFrames);
    setCurrentFrameIndex(currentFrameIndex - 1);
    setIsPlaying(false);
  }, [frames, currentFrameIndex]);

  const handleMoveFrameNext = useCallback(() => {
    if (currentFrameIndex === frames.length - 1 || frames.length <= 1) return;

    const newFrames = [...frames];
    const currentFrame = newFrames[currentFrameIndex];
    const nextFrame = newFrames[currentFrameIndex + 1];
    
    // Swap frames
    newFrames[currentFrameIndex] = nextFrame;
    newFrames[currentFrameIndex + 1] = currentFrame;
    
    setFrames(newFrames);
    setCurrentFrameIndex(currentFrameIndex + 1);
    setIsPlaying(false);
  }, [frames, currentFrameIndex]);

  const handleFrameSelect = useCallback((frameIndex: number) => {
    setCurrentFrameIndex(frameIndex);
    setIsPlaying(false);
  }, []);

  const handleSettingsChange = useCallback((newSettings: AppSettings) => {
    setSettings(newSettings);
  }, [setSettings]);

  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Flip Dot Animation Studio</h1>
          <p className="text-muted-foreground">
            Create stunning flip dot animations with interactive controls
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Section - Animation Workspace */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-center min-h-[400px]">
              <FlipDotGrid
                dots={currentDots}
                dimensions={settings.gridDimensions}
                colors={settings.colors}
                onDotClick={handleDotClick}
                className="w-full max-w-2xl"
              />
            </div>
            
            <PlayerControls
              isPlaying={isPlaying}
              currentFrame={currentFrameIndex}
              totalFrames={frames.length}
              frames={frames}
              dimensions={settings.gridDimensions}
              colors={settings.colors}
              onPlayPause={handlePlayPause}
              onPreviousFrame={handlePreviousFrame}
              onNextFrame={handleNextFrame}
              onNewFrame={handleNewFrame}
              onDeleteFrame={handleDeleteFrame}
              onClearFrame={handleClearFrame}
              onMoveFramePrevious={handleMoveFramePrevious}
              onMoveFrameNext={handleMoveFrameNext}
              onFrameSelect={handleFrameSelect}
            />
          </div>

          {/* Right Section - Properties Panel */}
          <div className="lg:col-span-1">
            <PropertiesPanel
              settings={settings}
              onSettingsChange={handleSettingsChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;