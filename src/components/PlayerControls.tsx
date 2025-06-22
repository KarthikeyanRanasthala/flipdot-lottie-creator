import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { FramePreview } from '@/components/FramePreview';
import { exportToLottie, downloadLottieFile } from '@/utils/lottieExporter';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Plus, 
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  Eraser,
  Download
} from 'lucide-react';
import { AnimationFrame, GridDimensions, ColorSettings } from '@/types';

interface PlayerControlsProps {
  isPlaying: boolean;
  currentFrame: number;
  totalFrames: number;
  frames: AnimationFrame[];
  dimensions: GridDimensions;
  colors: ColorSettings;
  frameDuration: number;
  onPlayPause: () => void;
  onPreviousFrame: () => void;
  onNextFrame: () => void;
  onNewFrame: () => void;
  onDeleteFrame: () => void;
  onClearFrame: () => void;
  onMoveFramePrevious: () => void;
  onMoveFrameNext: () => void;
  onFrameSelect: (frameIndex: number) => void;
}

export const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying,
  currentFrame,
  totalFrames,
  frames,
  dimensions,
  colors,
  frameDuration,
  onPlayPause,
  onPreviousFrame,
  onNextFrame,
  onNewFrame,
  onDeleteFrame,
  onClearFrame,
  onMoveFramePrevious,
  onMoveFrameNext,
  onFrameSelect
}) => {
  const handleDownloadLottie = () => {
    try {
      const lottieJson = exportToLottie(frames, dimensions, colors, frameDuration);
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      downloadLottieFile(lottieJson, `flipdot-animation-${timestamp}.json`);
    } catch (error) {
      console.error('Error exporting Lottie:', error);
      // You could add a toast notification here
    }
  };

  return (
    <TooltipProvider>
      <Card className="mt-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1">
              {/* Playback Controls */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onPreviousFrame}
                    disabled={totalFrames === 0}
                    className="hover:bg-blue-500/10"
                  >
                    <SkipBack className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-black text-white border-gray-600">
                  <p>Previous Frame <kbd className="ml-2 px-1 py-0.5 text-xs bg-gray-800 text-white rounded">←</kbd></p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onPlayPause}
                    disabled={totalFrames === 0}
                    className="hover:bg-green-500/10"
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-black text-white border-gray-600">
                  <p>{isPlaying ? 'Pause Animation' : 'Play Animation'} <kbd className="ml-2 px-1 py-0.5 text-xs bg-gray-800 text-white rounded">Space</kbd></p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onNextFrame}
                    disabled={totalFrames === 0}
                    className="hover:bg-blue-500/10"
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-black text-white border-gray-600">
                  <p>Next Frame <kbd className="ml-2 px-1 py-0.5 text-xs bg-gray-800 text-white rounded">→</kbd></p>
                </TooltipContent>
              </Tooltip>

              {/* Separator */}
              <div className="w-px h-6 bg-border mx-2" />

              {/* Frame Management */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onNewFrame}
                    className="hover:bg-emerald-500/10"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-black text-white border-gray-600">
                  <p>Add New Frame <kbd className="ml-2 px-1 py-0.5 text-xs bg-gray-800 text-white rounded">Ctrl+N</kbd></p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onDeleteFrame}
                    disabled={totalFrames <= 1}
                    className="hover:bg-red-500/10"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-black text-white border-gray-600">
                  <p>Delete Current Frame <kbd className="ml-2 px-1 py-0.5 text-xs bg-gray-800 text-white rounded">Del</kbd></p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onClearFrame}
                    disabled={totalFrames === 0}
                    className="hover:bg-orange-500/10"
                  >
                    <Eraser className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-black text-white border-gray-600">
                  <p>Clear Current Frame</p>
                </TooltipContent>
              </Tooltip>

              {/* Separator */}
              <div className="w-px h-6 bg-border mx-2" />

              {/* Frame Movement */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onMoveFramePrevious}
                    disabled={currentFrame === 0 || totalFrames <= 1}
                    className="hover:bg-purple-500/10"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-black text-white border-gray-600">
                  <p>Move Frame Left</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onMoveFrameNext}
                    disabled={currentFrame === totalFrames - 1 || totalFrames <= 1}
                    className="hover:bg-purple-500/10"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-black text-white border-gray-600">
                  <p>Move Frame Right</p>
                </TooltipContent>
              </Tooltip>
            </div>

            {/* Export Controls */}
            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative group">
                    {/* Static gradient border with scale effect */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-lg opacity-75 group-hover:opacity-100 blur-sm group-hover:blur-none transition-all duration-300 group-hover:scale-105"></div>
                    
                    {/* Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownloadLottie}
                      disabled={totalFrames === 0}
                      className="relative bg-background border-0 hover:bg-background/90 transition-all duration-300 group-hover:scale-105"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download as Lottie
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="bg-black text-white border-gray-600">
                  <p>Export animation as Lottie JSON file</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Frame Previews */}
          {frames.length > 0 && (
            <div className="border-t pt-4">
              <ScrollArea className="w-full">
                <div className="flex gap-3 pb-2 flex-wrap">
                  {frames.map((frame, index) => (
                    <FramePreview
                      key={frame.id}
                      dots={frame.dots}
                      dimensions={dimensions}
                      colors={colors}
                      isSelected={index === currentFrame}
                      isPlaying={isPlaying}
                      frameNumber={index + 1}
                      onClick={() => onFrameSelect(index)}
                      className="flex-shrink-0"
                    />
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};