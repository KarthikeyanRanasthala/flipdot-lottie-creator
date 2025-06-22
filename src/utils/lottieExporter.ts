import { AnimationFrame, GridDimensions, ColorSettings } from '@/types';

interface LottieAnimation {
  v: string;
  fr: number;
  ip: number;
  op: number;
  w: number;
  h: number;
  nm: string;
  ddd: number;
  assets: any[];
  layers: LottieLayer[];
}

interface LottieLayer {
  ddd: number;
  ind: number;
  ty: number;
  nm: string;
  sr: number;
  ks: LottieTransform;
  ao: number;
  shapes: LottieShape[];
  ip: number;
  op: number;
  st: number;
}

interface LottieTransform {
  o: LottieProperty; // opacity
  r: LottieProperty; // rotation
  p: LottieProperty; // position
  a: LottieProperty; // anchor
  s: LottieProperty; // scale
}

interface LottieProperty {
  a: number;
  k: number | number[] | LottieKeyframe[];
}

interface LottieShape {
  ty: string;
  nm: string;
  it: LottieShapeItem[];
}

interface LottieShapeItem {
  ty: string;
  nm?: string;
  d?: number;
  s?: LottieProperty;
  p?: LottieProperty;
  r?: LottieProperty;
  c?: LottieProperty;
  o?: LottieProperty;
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
  e?: number[];
}

// Convert hex color to RGB array (0-1 range)
function hexToRgb(hex: string): number[] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [0, 0, 0, 1];
  
  return [
    parseInt(result[1], 16) / 255,
    parseInt(result[2], 16) / 255,
    parseInt(result[3], 16) / 255,
    1
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

  // Calculate timing
  const frameRate = 30; // Standard frame rate for smooth animation
  const durationPerFrame = frameDuration / 1000; // Convert to seconds
  const totalDuration = frames.length * durationPerFrame;
  const totalFrames = Math.ceil(totalDuration * frameRate);
  
  // Calculate canvas dimensions
  const dotSize = 40;
  const gap = 8;
  const padding = 40;
  const canvasWidth = dimensions.columns * dotSize + (dimensions.columns - 1) * gap + padding * 2;
  const canvasHeight = dimensions.rows * dotSize + (dimensions.rows - 1) * gap + padding * 2;

  const layers: LottieLayer[] = [];
  const activeColor = hexToRgb(colors.activeDot);
  const inactiveColor = hexToRgb(colors.inactiveDot);

  // Create a layer for each dot
  for (let row = 0; row < dimensions.rows; row++) {
    for (let col = 0; col < dimensions.columns; col++) {
      const dotX = padding + col * (dotSize + gap) + dotSize / 2;
      const dotY = padding + row * (dotSize + gap) + dotSize / 2;
      
      let colorProperty: LottieProperty;
      
      if (frames.length === 1) {
        // Single frame - static color
        const isActive = frames[0].dots[row][col].active;
        colorProperty = {
          a: 0,
          k: isActive ? activeColor : inactiveColor
        };
      } else {
        // Multiple frames - animated color
        const colorKeyframes: LottieKeyframe[] = [];
        
        for (let frameIndex = 0; frameIndex < frames.length; frameIndex++) {
          const isActive = frames[frameIndex].dots[row][col].active;
          const frameTime = frameIndex * (totalFrames / frames.length);
          const color = isActive ? activeColor : inactiveColor;
          
          // Add keyframe for this frame
          colorKeyframes.push({
            i: { x: [1], y: [1] }, // Hold interpolation (step function)
            o: { x: [0], y: [0] },
            t: frameTime,
            s: [...color],
            e: [...color] // End value same as start for hold
          });
        }
        
        // Add final keyframe to loop back to first frame
        const firstFrameActive = frames[0].dots[row][col].active;
        const firstColor = firstFrameActive ? activeColor : inactiveColor;
        colorKeyframes.push({
          i: { x: [1], y: [1] },
          o: { x: [0], y: [0] },
          t: totalFrames,
          s: [...firstColor],
          e: [...firstColor]
        });
        
        colorProperty = {
          a: 1,
          k: colorKeyframes
        };
      }

      const layer: LottieLayer = {
        ddd: 0,
        ind: row * dimensions.columns + col + 1,
        ty: 4, // Shape layer
        nm: `Dot_${row}_${col}`,
        sr: 1,
        ks: {
          o: { a: 0, k: 100 }, // Opacity
          r: { a: 0, k: 0 },   // Rotation
          p: { a: 0, k: [dotX, dotY, 0] }, // Position
          a: { a: 0, k: [0, 0, 0] },       // Anchor
          s: { a: 0, k: [100, 100, 100] }  // Scale
        },
        ao: 0,
        shapes: [
          {
            ty: "gr", // Group
            nm: "Dot",
            it: [
              {
                ty: "el", // Ellipse
                nm: "Ellipse Path",
                d: 1,
                s: { a: 0, k: [dotSize, dotSize] },
                p: { a: 0, k: [0, 0] }
              },
              {
                ty: "fl", // Fill
                nm: "Fill",
                c: colorProperty,
                o: { a: 0, k: 100 }
              },
              {
                ty: "tr", // Transform
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

      layers.push(layer);
    }
  }

  // Add background layer
  const backgroundLayer: LottieLayer = {
    ddd: 0,
    ind: layers.length + 1,
    ty: 4,
    nm: "Background",
    sr: 1,
    ks: {
      o: { a: 0, k: 100 },
      r: { a: 0, k: 0 },
      p: { a: 0, k: [canvasWidth / 2, canvasHeight / 2, 0] },
      a: { a: 0, k: [0, 0, 0] },
      s: { a: 0, k: [100, 100, 100] }
    },
    ao: 0,
    shapes: [
      {
        ty: "gr",
        nm: "Background",
        it: [
          {
            ty: "rc", // Rectangle
            nm: "Rectangle Path",
            d: 1,
            s: { a: 0, k: [canvasWidth, canvasHeight] },
            p: { a: 0, k: [0, 0] },
            r: { a: 0, k: 0 }
          },
          {
            ty: "fl", // Fill
            nm: "Fill",
            c: { a: 0, k: hexToRgb(colors.background) },
            o: { a: 0, k: 100 }
          },
          {
            ty: "tr", // Transform
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

  // Add background as the first layer (bottom)
  layers.unshift(backgroundLayer);

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