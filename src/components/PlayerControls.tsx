import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FramePreview } from '@/components/FramePreview';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Plus, 
  Trash2 
} from 'lucide-react';
import { AnimationFrame, GridDimensions, ColorSettings } from '@/types';

interface PlayerControlsProps {
  isPlaying: boolean;
  currentFrame: number;
  totalFrames: number;
  frames: AnimationFrame[];
  dimensions: GridDimensions;
  colors: ColorSettings;
  showBackground: boolean;
  onPlayPause: () => void;
  onPreviousFrame: () => void;
  onNextFrame: () => void;
  onNewFrame: () => void;
  onClearFrame: () => void;
  onFrameSelect: (frameIndex: number) => void;
}

export const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying,
  currentFrame,
  totalFrames,
  frames,
  dimensions,
  colors,
  showBackground,
  onPlayPause,
  onPreviousFrame,
  onNextFrame,
  onNewFrame,
  onClearFrame,
  onFrameSelect
}) => {
  return (
    <Card className="mt-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={onPreviousFrame}
              disabled={totalFrames === 0}
              className="hover:bg-blue-500/10"
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onPlayPause}
              disabled={totalFrames === 0}
              className="hover:bg-green-500/10"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onNextFrame}
              disabled={totalFrames === 0}
              className="hover:bg-blue-500/10"
            >
              <SkipForward className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onNewFrame}
              className="hover:bg-emerald-500/10"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFrame}
              disabled={totalFrames === 0}
              className="hover:bg-red-500/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Frame Previews */}
        {frames.length > 0 && (
          <div className="border-t pt-4">
            <ScrollArea className="w-full">
              <div className="flex gap-3 pb-2">
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
                    showBackground={showBackground}
                    className="flex-shrink-0"
                  />
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
};