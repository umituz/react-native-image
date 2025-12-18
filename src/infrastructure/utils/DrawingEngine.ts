/**
 * Infrastructure - Drawing Engine
 * 
 * Core drawing functionality for editor tools
 */

export type DrawingPath = Array<{ x: number; y: number; pressure?: number }>;

export interface DrawingContext {
  canvas: HTMLCanvasElement | any;
  ctx: CanvasRenderingContext2D | any;
  scale: number;
  offset: { x: number; y: number };
}

export interface DrawingConfig {
  color: string;
  size: number;
  opacity: number;
  style: 'normal' | 'marker' | 'spray';
  smoothing: boolean;
}

export class DrawingEngine {
  private static smoothPath(path: DrawingPath): DrawingPath {
    if (path.length < 3) return path;

    const smoothed: DrawingPath = [path[0]];

    for (let i = 1; i < path.length - 1; i++) {
      const prev = path[i - 1];
      const curr = path[i];
      const next = path[i + 1];

      smoothed.push({
        x: curr.x * 0.5 + (prev.x + next.x) * 0.25,
        y: curr.y * 0.5 + (prev.y + next.y) * 0.25,
        pressure: curr.pressure,
      });
    }

    smoothed.push(path[path.length - 1]);
    return smoothed;
  }

  private static drawMarker(
    ctx: CanvasRenderingContext2D,
    from: { x: number; y: number },
    to: { x: number; y: number },
    config: DrawingConfig
  ): void {
    ctx.globalAlpha = config.opacity * 0.3;
    const strokeWidth = (config as any).strokeWidth || config.size * 2;
    ctx.lineWidth = strokeWidth;

    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  }

  private static drawSpray(
    ctx: CanvasRenderingContext2D,
    point: { x: number; y: number },
    config: DrawingConfig
  ): void {
    const density = config.size * 2;
    const radius = config.size;

    for (let i = 0; i < density; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * radius;
      const x = point.x + Math.cos(angle) * distance;
      const y = point.y + Math.sin(angle) * distance;

      ctx.globalAlpha = config.opacity * Math.random() * 0.5;
      ctx.fillRect(x, y, 1, 1);
    }
  }

  static drawStroke(
    ctx: CanvasRenderingContext2D,
    path: DrawingPath,
    config: DrawingConfig
  ): void {
    if (path.length < 2) return;

    const smoothedPath = config.smoothing ? this.smoothPath(path) : path;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = config.color;
    ctx.globalAlpha = config.opacity;

    switch (config.style) {
      case 'marker':
        this.drawMarker(ctx, smoothedPath[0], smoothedPath[smoothedPath.length - 1], config);
        break;

      case 'spray':
        smoothedPath.forEach(point => this.drawSpray(ctx, point, config));
        break;

      default:
        ctx.lineWidth = config.size;
        ctx.beginPath();
        ctx.moveTo(smoothedPath[0].x, smoothedPath[0].y);

        for (let i = 1; i < smoothedPath.length; i++) {
          ctx.lineTo(smoothedPath[i].x, smoothedPath[i].y);
        }
        ctx.stroke();
    }
  }

  static drawShape(
    ctx: CanvasRenderingContext2D,
    type: 'rectangle' | 'circle' | 'line' | 'arrow',
    start: { x: number; y: number },
    end: { x: number; y: number },
    config: Partial<DrawingConfig>
  ): void {
    const cfg = config as any;
    const color = cfg.color || '#000000';
    const size = cfg.size || 2;
    const opacity = cfg.opacity || 1;
    const strokeWidth = cfg.strokeWidth || 2;

    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = strokeWidth;
    ctx.globalAlpha = opacity;
    ctx.lineCap = 'round';

    switch (type) {
      case 'rectangle':
        const width = end.x - start.x;
        const height = end.y - start.y;
        ctx.strokeRect(start.x, start.y, width, height);
        break;

      case 'circle':
        const radius = Math.sqrt(
          Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
        );
        ctx.beginPath();
        ctx.arc(start.x, start.y, radius, 0, 2 * Math.PI);
        ctx.stroke();
        break;

      case 'line':
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
        break;

      case 'arrow':
        const angle = Math.atan2(end.y - start.y, end.x - start.x);
        const arrowLength = 15;
        const arrowAngle = Math.PI / 6;

        // Draw line
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();

        // Draw arrowhead
        ctx.beginPath();
        ctx.moveTo(end.x, end.y);
        ctx.lineTo(
          end.x - arrowLength * Math.cos(angle - arrowAngle),
          end.y - arrowLength * Math.sin(angle - arrowAngle)
        );
        ctx.moveTo(end.x, end.y);
        ctx.lineTo(
          end.x - arrowLength * Math.cos(angle + arrowAngle),
          end.y - arrowLength * Math.sin(angle + arrowAngle)
        );
        ctx.stroke();
        break;
    }
  }

  static erase(
    ctx: CanvasRenderingContext2D,
    position: { x: number; y: number },
    size: number
  ): void {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(position.x, position.y, size, 0, 2 * Math.PI);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
  }

  static createDrawingContext(
    canvas: HTMLCanvasElement | any,
    scale: number = 1,
    offset: { x: number; y: number } = { x: 0, y: 0 }
  ): DrawingContext {
    return {
      canvas,
      ctx: canvas.getContext('2d'),
      scale,
      offset,
    };
  }
}