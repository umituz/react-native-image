/**
 * Infrastructure - Text Editor
 * 
 * Advanced text editing with rich formatting
 */

export interface TextFormatting {
  fontSize: number;
  fontFamily: string;
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  textAlign: 'left' | 'center' | 'right';
  color: string;
  backgroundColor?: string;
  opacity: number;
  lineHeight?: number;
  letterSpacing?: number;
  textShadow?: {
    color: string;
    blur: number;
    offsetX: number;
    offsetY: number;
  };
  textStroke?: {
    color: string;
    width: number;
  };
}

export interface TextMeasurement {
  width: number;
  height: number;
  baseline: number;
}

export class TextEditor {
  private static systemFonts = [
    'Arial',
    'Helvetica',
    'Times New Roman',
    'Georgia',
    'Courier New',
    'Verdana',
    'Comic Sans MS',
    'Impact',
    'Palatino',
    'Garamond',
    'Bookman',
    'Trebuchet MS',
  ];

  private static getFontFamily(fontFamily: string): string {
    // Check if font is available, fallback to system font
    return this.systemFonts.includes(fontFamily) ? fontFamily : 'Arial';
  }

  static measureText(
    text: string,
    formatting: TextFormatting,
    ctx: CanvasRenderingContext2D
  ): TextMeasurement {
    const {
      fontSize,
      fontFamily,
      fontWeight,
      fontStyle,
      lineHeight = 1.2,
    } = formatting;

    // Build font string
    const fontString = `${fontStyle} ${fontWeight} ${fontSize}px ${this.getFontFamily(fontFamily)}`;
    ctx.font = fontString;

    // Measure text
    const metrics = ctx.measureText(text);
    const width = metrics.width;
    const height = fontSize * lineHeight;
    const baseline = fontSize * 0.8;

    return { width, height, baseline };
  }

  static renderText(
    ctx: CanvasRenderingContext2D,
    text: string,
    position: { x: number; y: number },
    formatting: TextFormatting,
    maxWidth?: number
  ): TextMeasurement {
    const measurement = this.measureText(text, formatting, ctx);

    ctx.save();

    // Set text properties
    const fontString = `${formatting.fontStyle} ${formatting.fontWeight} ${formatting.fontSize}px ${this.getFontFamily(formatting.fontFamily)}`;
    ctx.font = fontString;
    ctx.fillStyle = formatting.color;
    ctx.globalAlpha = formatting.opacity;
    ctx.textAlign = formatting.textAlign;
    ctx.textBaseline = 'alphabetic';

    // Apply text shadow
    if (formatting.textShadow) {
      ctx.shadowColor = formatting.textShadow.color;
      ctx.shadowBlur = formatting.textShadow.blur;
      ctx.shadowOffsetX = formatting.textShadow.offsetX;
      ctx.shadowOffsetY = formatting.textShadow.offsetY;
    }

    // Draw background if specified
    if (formatting.backgroundColor) {
      const padding = 4;
      let x = position.x;
      let y = position.y - measurement.baseline - padding;

      if (formatting.textAlign === 'center') {
        x -= measurement.width / 2;
      } else if (formatting.textAlign === 'right') {
        x -= measurement.width;
      }

      ctx.fillStyle = formatting.backgroundColor;
      ctx.fillRect(
        x - padding,
        y - padding,
        measurement.width + padding * 2,
        measurement.height + padding * 2
      );

      // Reset fill style for text
      ctx.fillStyle = formatting.color;
    }

    // Draw text
    let drawX = position.x;
    if (formatting.textAlign === 'center') {
      drawX = position.x;
    } else if (formatting.textAlign === 'right') {
      drawX = position.x;
    }

    if (maxWidth && measurement.width > maxWidth) {
      // Text wrapping
      const words = text.split(' ');
      let currentLine = '';
      let currentY = position.y;

      for (const word of words) {
        const testLine = currentLine + (currentLine ? ' ' : '') + word;
        const testMetrics = this.measureText(testLine, formatting, ctx);

        if (testMetrics.width > maxWidth && currentLine) {
          ctx.fillText(currentLine, drawX, currentY);
          currentLine = word;
          currentY += measurement.height;
        } else {
          currentLine = testLine;
        }
      }
      ctx.fillText(currentLine, drawX, currentY);
    } else {
      ctx.fillText(text, drawX, position.y);
    }

    // Apply text stroke if specified
    if (formatting.textStroke) {
      ctx.strokeStyle = formatting.textStroke.color;
      ctx.lineWidth = formatting.textStroke.width;
      ctx.strokeText(text, drawX, position.y);
    }

    ctx.restore();

    return measurement;
  }

  static wrapText(
    text: string,
    maxWidth: number,
    formatting: TextFormatting,
    ctx: CanvasRenderingContext2D
  ): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const testMetrics = this.measureText(testLine, formatting, ctx);

      if (testMetrics.width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
  }

  static getAvailableFonts(): string[] {
    return [...this.systemFonts];
  }

  static calculateTextBounds(
    text: string,
    formatting: TextFormatting,
    ctx: CanvasRenderingContext2D,
    maxWidth?: number
  ): {
    x: number;
    y: number;
    width: number;
    height: number;
  } {
    const measurement = this.measureText(text, formatting, ctx);

    if (maxWidth && measurement.width > maxWidth) {
      const lines = this.wrapText(text, maxWidth, formatting, ctx);
      const lineHeight = measurement.height;
      const totalHeight = lines.length * lineHeight;

      return {
        x: 0,
        y: 0,
        width: maxWidth,
        height: totalHeight,
      };
    }

    return {
      x: 0,
      y: 0,
      width: measurement.width,
      height: measurement.height,
    };
  }

  static createTextPath(
    text: string,
    position: { x: number; y: number },
    formatting: TextFormatting,
    ctx: CanvasRenderingContext2D
  ): Path2D | any {
    const measurement = this.measureText(text, formatting, ctx);
    
    ctx.save();
    const fontString = `${formatting.fontStyle} ${formatting.fontWeight} ${formatting.fontSize}px ${this.getFontFamily(formatting.fontFamily)}`;
    ctx.font = fontString;

    let x = position.x;
    if (formatting.textAlign === 'center') {
      x = position.x;
    } else if (formatting.textAlign === 'right') {
      x = position.x;
    }

    const path = new Path2D();
    path.moveTo(x, position.y);

    // This is a simplified version - in a real implementation,
    // you would use more sophisticated text-to-path conversion
    path.rect(x - measurement.width/2, position.y - measurement.baseline, measurement.width, measurement.height);

    ctx.restore();
    return path;
  }
}