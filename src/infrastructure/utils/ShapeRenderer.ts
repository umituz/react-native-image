/**
 * Infrastructure - Shape Renderer
 * 
 * Advanced shape drawing with different styles
 */

export interface ShapeStyle {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  dash?: number[];
  opacity?: number;
}

export class ShapeRenderer {
  static drawRoundedRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
    style: ShapeStyle
  ): void {
    ctx.save();
    
    ctx.globalAlpha = style.opacity || 1;
    ctx.strokeStyle = style.stroke || '#000000';
    ctx.fillStyle = style.fill || 'transparent';
    ctx.lineWidth = style.strokeWidth || 2;
    
    if (style.dash) {
      ctx.setLineDash(style.dash);
    }

    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();

    if (style.fill) ctx.fill();
    if (style.stroke) ctx.stroke();

    ctx.restore();
  }

  static drawStar(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    outerRadius: number,
    innerRadius: number,
    points: number,
    style: ShapeStyle
  ): void {
    ctx.save();
    
    ctx.globalAlpha = style.opacity || 1;
    ctx.strokeStyle = style.stroke || '#000000';
    ctx.fillStyle = style.fill || 'transparent';
    ctx.lineWidth = style.strokeWidth || 2;

    ctx.beginPath();
    for (let i = 0; i < points * 2; i++) {
      const angle = (Math.PI * i) / points - Math.PI / 2;
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();

    if (style.fill) ctx.fill();
    if (style.stroke) ctx.stroke();

    ctx.restore();
  }

  static drawHeart(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    style: ShapeStyle
  ): void {
    ctx.save();
    
    ctx.globalAlpha = style.opacity || 1;
    ctx.strokeStyle = style.stroke || '#000000';
    ctx.fillStyle = style.fill || 'transparent';
    ctx.lineWidth = style.strokeWidth || 2;

    ctx.beginPath();
    const topCurveHeight = size * 0.3;
    ctx.moveTo(x, y + topCurveHeight);

    // Top left curve
    ctx.bezierCurveTo(
      x, y,
      x - size / 2, y,
      x - size / 2, y + topCurveHeight
    );

    // Bottom left curve
    ctx.bezierCurveTo(
      x - size / 2, y + (size + topCurveHeight) / 2,
      x, y + (size + topCurveHeight) / 1.5,
      x, y + size
    );

    // Bottom right curve
    ctx.bezierCurveTo(
      x, y + (size + topCurveHeight) / 1.5,
      x + size / 2, y + (size + topCurveHeight) / 2,
      x + size / 2, y + topCurveHeight
    );

    // Top right curve
    ctx.bezierCurveTo(
      x + size / 2, y,
      x, y,
      x, y + topCurveHeight
    );

    ctx.closePath();

    if (style.fill) ctx.fill();
    if (style.stroke) ctx.stroke();

    ctx.restore();
  }

  static drawTriangle(
    ctx: CanvasRenderingContext2D,
    points: Array<{ x: number; y: number }>,
    style: ShapeStyle
  ): void {
    ctx.save();
    
    ctx.globalAlpha = style.opacity || 1;
    ctx.strokeStyle = style.stroke || '#000000';
    ctx.fillStyle = style.fill || 'transparent';
    ctx.lineWidth = style.strokeWidth || 2;

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    ctx.lineTo(points[1].x, points[1].y);
    ctx.lineTo(points[2].x, points[2].y);
    ctx.closePath();

    if (style.fill) ctx.fill();
    if (style.stroke) ctx.stroke();

    ctx.restore();
  }
}