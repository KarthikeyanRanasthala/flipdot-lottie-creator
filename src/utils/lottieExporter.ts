import { AnimationFrame, GridDimensions, ColorSettings } from '@/types';

interface LottieAnimation {
  v: string; // version
  fr: number; // frame rate
  ip: number; // in point
  op: number; // out point
  w: number; // width
  h: number; // height
  nm: string; // name
  ddd: number; // 3d flag
  assets: any[];
  layers: LottieLayer[];
}

interface LottieLayer {
  ddd: number;
  ind: number;
  ty: number; // layer type (4 = shape layer)
  nm: string;
  sr: number;
  ks: {
    o: { a: number; k: number }; // opacity
    r: { a: number; k: number }; // rotation
    p: { a: number; k: number[] }; // position
    a: { a: number; k: number[] }; // anchor
    s: { a: number; k: number[] }; // scale
  };
  ao: number;
  shapes: LottieShape[];
  ip: number;
  op: number;
  st: number;
}

interface LottieShape {
  ty: string; // shape type
  nm: string; // name
  it: LottieShapeItem[];
}

interface LottieShapeItem {
  ty: string;
  nm?: string;
  d?: number;
  s?: {
    a: number;
    k: LottieKeyframe[];
  };
  p?: {
    a: number;
    k: LottieKeyframe[];
  };
  r?: {
    a: number;
    k: number;
  };
  c?: {
    a: number;
    k: number[];
  };
  o?: {
    a: number;
    k: number;
  };
  lc?: number;
  lj?: number;
  ml?: number;
}

interface LottieKeyframe {
  i: {
    x: number[];
    y: number[];
  };
  o: {
    x: number[];
    y: number[];
  };
  t: number;
  s: number[];
}

// Convert hex color to RGB array (0-1 range)
function hexToRgb(hex: string): number[] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [0, 0, 0];
  
  return [
    parseInt(result[1], 16) / 255,
    parseInt(result[2], 16) / 255,
    parseInt(result[3], 16) / 255
  ];
}

export function exportToLottie(
  frames: AnimationFrame[],
  dimensions: GridDimensions,
  colors: ColorSettings,
  frameDuration: number
): string {
  if (frames.length === 0) {
    throw new Error('No frames to export');
  }

  const frameRate = 1000 / frameDuration; // Convert ms to fps
  const totalFrames = frames.length;
  
  // Calculate canvas dimensions based on grid
  const dotSize = 20;
  const gap = 4;
  const padding = 20;
  const canvasWidth = dimensions.columns * dotSize + (dimensions.columns - 1) * gap + padding * 2;
  const canvasHeight = dimensions.rows * dotSize + (dimensions.rows - 1) * gap + padding * 2;

  const layers: LottieLayer[] = [];

  // Create a layer for each dot position
  for (let row = 0; row < dimensions.rows; row++) {
    for (let col = 0; col < dimensions.columns; col++) {
      const dotX = padding + col * (dotSize + gap) + dotSize / 2;
      const dotY = padding + row * (dotSize + gap) + dotSize / 2;
      
      // Create keyframes for this dot's opacity based on active state across frames
      const opacityKeyframes: LottieKeyframe[] = [];
      
      frames.forEach((frame, frameIndex) => {
        const isActive = frame.dots[row][col].active;
        const frameTime = frameIndex * (frameRate / totalFrames) * totalFrames;
        
        opacityKeyframes.push({
          i: { x: [0.833], y: [0.833] },
          o: { x: [0.167], y: [0.167] },
          t: frameTime,
          s: [isActive ? 100 : 0]
        });
      });

      // Add final keyframe
      if (opacityKeyframes.length > 0) {
        const lastFrame = opacityKeyframes[opacityKeyframes.length - 1];
        opacityKeyframes.push({
          i: { x: [0.833], y: [0.833] },
          o: { x: [0.167], y: [0.167] },
          t: totalFrames,
          s: lastFrame.s
        });
      }

      const layer: LottieLayer = {
        ddd: 0,
        ind: row * dimensions.columns + col + 1,
        ty: 4, // shape layer
        nm: `Dot_${row}_${col}`,
        sr: 1,
        ks: {
          o: { a: 1, k: opacityKeyframes.length > 1 ? 100 : (frames[0].dots[row][col].active ? 100 : 0) },
          r: { a: 0, k: 0 },
          p: { a: 0, k: [dotX, dotY, 0] },
          a: { a: 0, k: [0, 0, 0] },
          s: { a: 0, k: [100, 100, 100] }
        },
        ao: 0,
        shapes: [
          {
            ty: "gr", // group
            nm: "Ellipse",
            it: [
              {
                ty: "el", // ellipse
                nm: "Ellipse Path",
                d: 1,
                s: { a: 0, k: [dotSize, dotSize] },
                p: { a: 0, k: [0, 0] }
              },
              {
                ty: "fl", // fill
                nm: "Fill",
                c: { a: 0, k: hexToRgb(colors.activeDot) },
                o: { a: 0, k: 100 }
              },
              {
                ty: "tr", // transform
                nm: "Transform",
                p: { a: 0, k: [0, 0] },
                a: { a: 0, k: [0, 0] },
                s: { a: 0, k: [100, 100] },
                r: { a: 0, k: 0 },
                o: { a: 0, k: 100 }
              }
            ]
          }
        ],
        ip: 0,
        op: totalFrames,
        st: 0
      };

      // Add animated opacity if there are multiple frames
      if (opacityKeyframes.length > 1) {
        layer.ks.o = {
          a: 1,
          k: opacityKeyframes
        };
      }

      layers.push(layer);
    }
  }

  const lottieAnimation: LottieAnimation = {
    v: "5.7.4",
    fr: frameRate,
    ip: 0,
    op: totalFrames,
    w: canvasWidth,
    h: canvasHeight,
    nm: "FlipDot Animation",
    ddd: 0,
    assets: [],
    layers: layers
  };

  return JSON.stringify(lottieAnimation, null, 2);
}

export function downloadLottieFile(lottieJson: string, filename: string = 'flipdot-animation.json') {
  const blob = new Blob([lottieJson], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}