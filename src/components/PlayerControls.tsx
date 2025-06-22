import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Plus, 
  Trash2 
} from 'lucide-react';

interface PlayerControlsProps {
  isPlaying: boolean;
  currentFrame: number;
  totalFrames: number;
  onPlayPause: () => void;
  onPreviousFrame: () => void;
  onNextFrame: () => void;
  onNewFrame: () => void;
  onClearFrame: () => void;
}

export const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying,
  currentFrame,
  totalFrames,
  onPlayPause,
  onPreviousFrame,
  onNextFrame,
  onNewFrame,
  onClearFrame
}) => {
  return (
    <Card className="mt-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-sm">
              Frame {currentFrame + 1} of {totalFrames}
            </Badge>
          </div>
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
      </CardContent>
    </Card>
  );
};