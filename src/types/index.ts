export interface FlipDotState {
  active: boolean;
}

export interface AnimationFrame {
  id: string;
  dots: FlipDotState[][];
  timestamp: number;
}

export interface GridDimensions {
  rows: number;
  columns: number;
}

export interface ColorSettings {
  background: string;
  activeDot: string;
  inactiveDot: string;
}

export interface AppSettings {
  gridDimensions: GridDimensions;
  colors: ColorSettings;
  frameDuration: number;
  includeBackground: boolean;
}

export interface AppState {
  frames: AnimationFrame[];
  currentFrameIndex: number;
  isPlaying: boolean;
  settings: AppSettings;
}