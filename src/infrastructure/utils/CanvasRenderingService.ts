/**
 * Image Infrastructure - Canvas Rendering Service
 * 
 * Canvas-based rendering utilities for annotations and filters
 */

export class CanvasRenderingService {
  static renderTextOnCanvas(
    ctx: CanvasRenderingContext2D,
    overlay: import('../services/ImageAnnotationService').TextOverlay
  ): void {
    ctx.save();
    
    ctx.font = `${overlay.fontSize || 16}px ${overlay.fontFamily || 'Arial'}`;
    ctx.fillStyle = overlay.color || '#000000';
    
    if (overlay.backgroundColor) {
      const metrics = ctx.measureText(overlay.text);
      const padding = 4;
      ctx.fillStyle = overlay.backgroundColor;
      ctx.fillRect(
        overlay.x - padding,
        overlay.y - (overlay.fontSize || 16) - padding,
        metrics.width + padding * 2,
        (overlay.fontSize || 16) + padding * 2
      );
      ctx.fillStyle = overlay.color || '#000000';
    }
    
    if (overlay.rotation) {
      ctx.translate(overlay.x, overlay.y);
      ctx.rotate((overlay.rotation * Math.PI) / 180);
      ctx.fillText(overlay.text, 0, 0);
    } else {
      ctx.fillText(overlay.text, overlay.x, overlay.y);
    }
    
    ctx.restore();
  }

  static renderDrawingOnCanvas(
    ctx: CanvasRenderingContext2D,
    drawing: import('../services/ImageAnnotationService').DrawingElement
  ): void {
    ctx.save();
    ctx.strokeStyle = drawing.color || '#000000';
    ctx.lineWidth = drawing.strokeWidth || 2;
    
    if (drawing.fillColor) {
      ctx.fillStyle = drawing.fillColor;
    }

    switch (drawing.type) {
      case 'line':
        if (drawing.points.length >= 2) {
          ctx.beginPath();
          ctx.moveTo(drawing.points[0].x, drawing.points[0].y);
          for (let i = 1; i < drawing.points.length; i++) {
            ctx.lineTo(drawing.points[i].x, drawing.points[i].y);
          }
          ctx.stroke();
        }
        break;

      case 'rectangle':
        if (drawing.points.length >= 2) {
          const width = drawing.points[1].x - drawing.points[0].x;
          const height = drawing.points[1].y - drawing.points[0].y;
          if (drawing.fillColor) {
            ctx.fillRect(drawing.points[0].x, drawing.points[0].y, width, height);
          }
          ctx.strokeRect(drawing.points[0].x, drawing.points[0].y, width, height);
        }
        break;

      case 'circle':
        if (drawing.points.length >= 2) {
          const radius = Math.sqrt(
            Math.pow(drawing.points[1].x - drawing.points[0].x, 2) +
            Math.pow(drawing.points[1].y - drawing.points[0].y, 2)
          );
          ctx.beginPath();
          ctx.arc(drawing.points[0].x, drawing.points[0].y, radius, 0, 2 * Math.PI);
          if (drawing.fillColor) {
            ctx.fill();
          }
          ctx.stroke();
        }
        break;

      case 'arrow':
        if (drawing.points.length >= 2) {
          // Draw line
          ctx.beginPath();
          ctx.moveTo(drawing.points[0].x, drawing.points[0].y);
          ctx.lineTo(drawing.points[1].x, drawing.points[1].y);
          ctx.stroke();
          
          // Draw arrowhead
          const angle = Math.atan2(
            drawing.points[1].y - drawing.points[0].y,
            drawing.points[1].x - drawing.points[0].x
          );
          const arrowLength = 10;
          ctx.beginPath();
          ctx.moveTo(drawing.points[1].x, drawing.points[1].y);
          ctx.lineTo(
            drawing.points[1].x - arrowLength * Math.cos(angle - Math.PI / 6),
            drawing.points[1].y - arrowLength * Math.sin(angle - Math.PI / 6)
          );
          ctx.moveTo(drawing.points[1].x, drawing.points[1].y);
          ctx.lineTo(
            drawing.points[1].x - arrowLength * Math.cos(angle + Math.PI / 6),
            drawing.points[1].y - arrowLength * Math.sin(angle + Math.PI / 6)
          );
          ctx.stroke();
        }
        break;

      case 'freehand':
        if (drawing.points.length >= 2) {
          ctx.beginPath();
          ctx.moveTo(drawing.points[0].x, drawing.points[0].y);
          for (let i = 1; i < drawing.points.length; i++) {
            ctx.lineTo(drawing.points[i].x, drawing.points[i].y);
          }
          ctx.stroke();
        }
        break;
    }
    
    ctx.restore();
  }
}