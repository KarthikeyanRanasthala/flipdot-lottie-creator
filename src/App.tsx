import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { FlipDotGrid } from '@/components/FlipDotGrid';
import { PlayerControls } from '@/components/PlayerControls';
import { PropertiesPanel } from '@/components/PropertiesPanel';
import { KeyboardShortcuts } from '@/components/KeyboardShortcuts';
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
  const [frames, setFrames] = useLocalStorage<AnimationFrame[]>('flipDotFrames', []);
  const [currentFrameIndex, setCurrentFrameIndex] = useLocalStorage<number>('flipDotCurrentFrame', 0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentDots, setCurrentDots] = useState<FlipDotState[][]>(() => 
    createEmptyDots(settings.gridDimensions)
  );
  const [isInitialized, setIsInitialized] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);

  // Initialize frames if empty or restore from localStorage
  useEffect(() => {
    if (!isInitialized) {
      if (frames.length === 0) {
        const initialFrame = createAnimationFrame(createEmptyDots(settings.gridDimensions));
        setFrames([initialFrame]);
        setCurrentFrameIndex(0);
        setCurrentDots(initialFrame.dots);
      } else {
        // Restore state from localStorage
        const validFrameIndex = Math.min(currentFrameIndex, frames.length - 1);
        setCurrentFrameIndex(validFrameIndex);
        
        // Ensure frames match current grid dimensions
        const updatedFrames = frames.map(frame => ({
          ...frame,
          dots: resizeDots(frame.dots, settings.gridDimensions)
        }));
        
        if (JSON.stringify(updatedFrames) !== JSON.stringify(frames)) {
          setFrames(updatedFrames);
        }
        
        setCurrentDots(updatedFrames[validFrameIndex].dots);
      }
      setIsInitialized(true);
    }
  }, [frames, currentFrameIndex, settings.gridDimensions, isInitialized, setFrames, setCurrentFrameIndex]);

  // Update current dots when frame changes
  useEffect(() => {
    if (isInitialized && frames.length > 0 && currentFrameIndex < frames.length) {
      setCurrentDots(frames[currentFrameIndex].dots);
    }
  }, [currentFrameIndex, frames, isInitialized]);

  // Handle grid dimension changes
  useEffect(() => {
    if (isInitialized && frames.length > 0) {
      const newFrames = frames.map(frame => ({
        ...frame,
        dots: resizeDots(frame.dots, settings.gridDimensions)
      }));
      
      // Only update if there's actually a change
      if (JSON.stringify(newFrames) !== JSON.stringify(frames)) {
        setFrames(newFrames);
        setCurrentDots(resizeDots(currentDots, settings.gridDimensions));
      }
    }
  }, [settings.gridDimensions, isInitialized]);

  // Animation playback
  useEffect(() => {
    if (!isPlaying || frames.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentFrameIndex(prev => (prev + 1) % frames.length);
    }, settings.frameDuration);

    return () => clearInterval(interval);
  }, [isPlaying, frames.length, settings.frameDuration, setCurrentFrameIndex]);

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
  }, [currentDots, frames, currentFrameIndex, setFrames]);

  const handlePlayPause = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const handlePreviousFrame = useCallback(() => {
    if (frames.length > 0) {
      const newIndex = currentFrameIndex > 0 ? currentFrameIndex - 1 : frames.length - 1;
      setCurrentFrameIndex(newIndex);
      setIsPlaying(false);
    }
  }, [frames.length, currentFrameIndex, setCurrentFrameIndex]);

  const handleNextFrame = useCallback(() => {
    if (frames.length > 0) {
      const newIndex = (currentFrameIndex + 1) % frames.length;
      setCurrentFrameIndex(newIndex);
      setIsPlaying(false);
    }
  }, [frames.length, currentFrameIndex, setCurrentFrameIndex]);

  const handleNewFrame = useCallback(() => {
    const newFrame = createAnimationFrame(createEmptyDots(settings.gridDimensions));
    const newFrames = [...frames];
    
    // Insert the new frame after the current frame
    const insertIndex = currentFrameIndex + 1;
    newFrames.splice(insertIndex, 0, newFrame);
    
    setFrames(newFrames);
    setCurrentFrameIndex(insertIndex);
    setIsPlaying(false);
  }, [frames, currentFrameIndex, settings.gridDimensions, setFrames, setCurrentFrameIndex]);

  const handleDeleteFrame = useCallback(() => {
    if (frames.length <= 1) return; // Don't delete if it's the last frame

    const newFrames = frames.filter((_, index) => index !== currentFrameIndex);
    setFrames(newFrames);
    
    // Adjust current frame index
    const newIndex = currentFrameIndex >= newFrames.length ? newFrames.length - 1 : currentFrameIndex;
    setCurrentFrameIndex(newIndex);
    setIsPlaying(false);
  }, [frames, currentFrameIndex, setFrames, setCurrentFrameIndex]);

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
  }, [frames, currentFrameIndex, settings.gridDimensions, setFrames]);

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
  }, [frames, currentFrameIndex, setFrames, setCurrentFrameIndex]);

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
  }, [frames, currentFrameIndex, setFrames, setCurrentFrameIndex]);

  const handleFrameSelect = useCallback((frameIndex: number) => {
    setCurrentFrameIndex(frameIndex);
    setIsPlaying(false);
  }, [setCurrentFrameIndex]);

  const handleSettingsChange = useCallback((newSettings: AppSettings) => {
    setSettings(newSettings);
  }, [setSettings]);

  // Keyboard shortcuts
  useHotkeys('ctrl+n, cmd+n', (e) => {
    e.preventDefault();
    handleNewFrame();
  }, { enableOnFormTags: false });

  useHotkeys('delete, backspace', (e) => {
    e.preventDefault();
    if (frames.length > 1) {
      handleDeleteFrame();
    }
  }, { enableOnFormTags: false });

  useHotkeys('space', (e) => {
    e.preventDefault();
    handlePlayPause();
  }, { enableOnFormTags: false });

  useHotkeys('left, a', (e) => {
    e.preventDefault();
    handlePreviousFrame();
  }, { enableOnFormTags: false });

  useHotkeys('right, d', (e) => {
    e.preventDefault();
    handleNextFrame();
  }, { enableOnFormTags: false });

  useHotkeys('?', (e) => {
    e.preventDefault();
    setShowKeyboardShortcuts(true);
  }, { enableOnFormTags: false });

  useHotkeys('escape', (e) => {
    e.preventDefault();
    setShowKeyboardShortcuts(false);
    setIsPlaying(false);
  }, { enableOnFormTags: false });

  // Don't render until initialized to prevent flash of incorrect state
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Flip Dot Animation Studio</h1>
              <p className="text-muted-foreground">
                Create stunning flip dot animations with interactive controls
              </p>
            </div>
            <button
              onClick={() => setShowKeyboardShortcuts(true)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 border border-border rounded px-2 py-1 hover:bg-accent"
            >
              Press <kbd className="px-1 py-0.5 text-xs bg-muted rounded">?</kbd> for shortcuts
            </button>
          </div>
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
              frameDuration={settings.frameDuration}
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

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcuts
        isOpen={showKeyboardShortcuts}
        onClose={() => setShowKeyboardShortcuts(false)}
      />
    </div>
  );
}

export default App;