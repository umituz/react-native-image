/**
 * Infrastructure - Crop Tool
 * 
 * Advanced cropping with aspect ratio and grid guides
 */

export interface CropConfig {
  aspectRatio?: number;
  lockAspectRatio?: boolean;
  showGrid?: boolean;
  minSize?: { width: number; height: number };
  maxSize?: { width: number; height: number };
}

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CropPreset {
  name: string;
  aspectRatio: number;
  icon: string;
}

export class CropTool {
  private static readonly PRESETS: CropPreset[] = [
    { name: 'Free', aspectRatio: 0, icon: 'crop-free' },
    { name: '1:1', aspectRatio: 1, icon: 'crop-square' },
    { name: '4:3', aspectRatio: 4/3, icon: 'crop-landscape' },
    { name: '3:4', aspectRatio: 3/4, icon: 'crop-portrait' },
    { name: '16:9', aspectRatio: 16/9, icon: 'crop-widescreen' },
    { name: '9:16', aspectRatio: 9/16, icon: 'crop-vertical' },
  ];

  static getPresets(): CropPreset[] {
    return this.PRESETS;
  }

  static constrainToAspectRatio(
    width: number,
    height: number,
    aspectRatio: number
  ): { width: number; height: number } {
    if (aspectRatio === 0) return { width, height };

    const currentRatio = width / height;
    
    if (currentRatio > aspectRatio) {
      // Width is too large, constrain it
      return {
        width: height * aspectRatio,
        height,
      };
    } else {
      // Height is too large, constrain it
      return {
        width,
        height: width / aspectRatio,
      };
    }
  }

  static constrainToBounds(
    area: CropArea,
    bounds: { width: number; height: number }
  ): CropArea {
    let { x, y, width, height } = area;

    // Ensure area is within bounds
    if (x < 0) {
      width += x;
      x = 0;
    }
    if (y < 0) {
      height += y;
      y = 0;
    }

    if (x + width > bounds.width) {
      width = bounds.width - x;
    }
    if (y + height > bounds.height) {
      height = bounds.height - y;
    }

    return { x, y, width, height };
  }

  static applyMinimumSize(
    area: CropArea,
    minSize: { width: number; height: number }
  ): CropArea {
    const { width, height } = area;
    
    return {
      ...area,
      width: Math.max(width, minSize.width),
      height: Math.max(height, minSize.height),
    };
  }

  static applyMaximumSize(
    area: CropArea,
    maxSize: { width: number; height: number }
  ): CropArea {
    const { width, height } = area;
    
    return {
      ...area,
      width: Math.min(width, maxSize.width),
      height: Math.min(height, maxSize.height),
    };
  }

  static centerCrop(
    imageWidth: number,
    imageHeight: number,
    targetWidth?: number,
    targetHeight?: number
  ): CropArea {
    if (!targetWidth && !targetHeight) {
      return {
        x: 0,
        y: 0,
        width: imageWidth,
        height: imageHeight,
      };
    }

    if (!targetHeight) {
      targetHeight = targetWidth! * (imageHeight / imageWidth);
    }
    if (!targetWidth) {
      targetWidth = targetHeight! * (imageWidth / imageHeight);
    }

    return {
      x: (imageWidth - targetWidth) / 2,
      y: (imageHeight - targetHeight) / 2,
      width: targetWidth,
      height: targetHeight,
    };
  }

  static drawCropOverlay(
    ctx: CanvasRenderingContext2D,
    cropArea: CropArea,
    config: CropConfig
  ): void {
    const { x, y, width, height } = cropArea;

    // Draw semi-transparent overlay outside crop area
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    
    // Top overlay
    ctx.fillRect(0, 0, ctx.canvas.width, y);
    // Bottom overlay
    ctx.fillRect(0, y + height, ctx.canvas.width, ctx.canvas.height - y - height);
    // Left overlay
    ctx.fillRect(0, y, x, height);
    // Right overlay
    ctx.fillRect(x + width, y, ctx.canvas.width - x - width, height);
    
    // Draw crop area border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(x, y, width, height);

    // Draw corner handles
    ctx.fillStyle = '#ffffff';
    const handleSize = 8;
    ctx.fillRect(x - handleSize/2, y - handleSize/2, handleSize, handleSize);
    ctx.fillRect(x + width - handleSize/2, y - handleSize/2, handleSize, handleSize);
    ctx.fillRect(x - handleSize/2, y + height - handleSize/2, handleSize, handleSize);
    ctx.fillRect(x + width - handleSize/2, y + height - handleSize/2, handleSize, handleSize);

    ctx.setLineDash([]);
    ctx.restore();

    // Draw grid if enabled
    if (config.showGrid) {
      this.drawGrid(ctx, cropArea);
    }
  }

  private static drawGrid(
    ctx: CanvasRenderingContext2D,
    cropArea: CropArea
  ): void {
    const { x, y, width, height } = cropArea;
    
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 3]);

    // Third lines
    ctx.beginPath();
    ctx.moveTo(x + width/3, y);
    ctx.lineTo(x + width/3, y + height);
    ctx.moveTo(x + 2*width/3, y);
    ctx.lineTo(x + 2*width/3, y + height);
    ctx.moveTo(x, y + height/3);
    ctx.lineTo(x + width, y + height/3);
    ctx.moveTo(x, y + 2*height/3);
    ctx.lineTo(x + width, y + 2*height/3);
    ctx.stroke();

    // Center lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.setLineDash([5, 2]);
    ctx.beginPath();
    ctx.moveTo(x + width/2, y);
    ctx.lineTo(x + width/2, y + height);
    ctx.moveTo(x, y + height/2);
    ctx.lineTo(x + width, y + height/2);
    ctx.stroke();

    ctx.restore();
  }

  static getCropFromSelection(
    startPoint: { x: number; y: number },
    endPoint: { x: number; y: number },
    config: CropConfig
  ): CropArea {
    const x = Math.min(startPoint.x, endPoint.x);
    const y = Math.min(startPoint.y, endPoint.y);
    const width = Math.abs(endPoint.x - startPoint.x);
    const height = Math.abs(endPoint.y - startPoint.y);

    let cropArea = { x, y, width, height };

    // Apply aspect ratio constraint if locked
    if (config.lockAspectRatio && config.aspectRatio) {
      const constrained = this.constrainToAspectRatio(width, height, config.aspectRatio);
      cropArea = {
        x,
        y,
        width: constrained.width,
        height: constrained.height,
      };
    }

    // Apply size constraints
    if (config.minSize) {
      cropArea = this.applyMinimumSize(cropArea, config.minSize);
    }
    if (config.maxSize) {
      cropArea = this.applyMaximumSize(cropArea, config.maxSize);
    }

    return cropArea;
  }
}