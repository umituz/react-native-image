/**
 * Infrastructure - Filter Utils
 * 
 * Low-level filter implementations for raw pixel data
 */

export class ImageFilterUtils {
  static applyBrightness(
    data: Uint8ClampedArray,
    brightness: number
  ): Uint8ClampedArray {
    const result = new Uint8ClampedArray(data);
    const adjustment = brightness * 2.55;

    for (let i = 0; i < result.length; i += 4) {
      result[i] = Math.min(255, Math.max(0, result[i] + adjustment));
      result[i + 1] = Math.min(255, Math.max(0, result[i + 1] + adjustment));
      result[i + 2] = Math.min(255, Math.max(0, result[i + 2] + adjustment));
    }

    return result;
  }

  static applyContrast(
    data: Uint8ClampedArray,
    contrast: number
  ): Uint8ClampedArray {
    const result = new Uint8ClampedArray(data);
    const factor = (259 * (contrast * 2.55 + 255)) / (255 * (259 - contrast * 2.55));

    for (let i = 0; i < result.length; i += 4) {
      result[i] = Math.min(255, Math.max(0, factor * (result[i] - 128) + 128));
      result[i + 1] = Math.min(255, Math.max(0, factor * (result[i + 1] - 128) + 128));
      result[i + 2] = Math.min(255, Math.max(0, factor * (result[i + 2] - 128) + 128));
    }

    return result;
  }

  static applySaturation(
    data: Uint8ClampedArray,
    saturation: number
  ): Uint8ClampedArray {
    const result = new Uint8ClampedArray(data);
    const adjustment = 1 + (saturation / 100);

    for (let i = 0; i < result.length; i += 4) {
      const r = result[i];
      const g = result[i + 1];
      const b = result[i + 2];

      const gray = 0.299 * r + 0.587 * g + 0.114 * b;

      result[i] = Math.min(255, Math.max(0, gray + adjustment * (r - gray)));
      result[i + 1] = Math.min(255, Math.max(0, gray + adjustment * (g - gray)));
      result[i + 2] = Math.min(255, Math.max(0, gray + adjustment * (b - gray)));
    }

    return result;
  }

  static applyVintage(
    data: Uint8ClampedArray,
    intensity: number,
    warmth: number
  ): Uint8ClampedArray {
    const result = new Uint8ClampedArray(data);
    const factor = intensity / 100;
    const warmFactor = warmth / 100;

    for (let i = 0; i < result.length; i += 4) {
      let r = result[i];
      let g = result[i + 1];
      let b = result[i + 2];

      const tr = 0.393 * r + 0.769 * g + 0.189 * b;
      const tg = 0.349 * r + 0.686 * g + 0.168 * b;
      const tb = 0.272 * r + 0.534 * g + 0.131 * b;

      r = r * (1 - factor) + tr * factor;
      g = g * (1 - factor) + tg * factor;
      b = b * (1 - factor) + tb * factor;

      if (warmFactor > 0) {
        result[i] = Math.min(255, r + warmFactor * 20);
        result[i + 1] = Math.min(255, g + warmFactor * 10);
        result[i + 2] = Math.min(255, b * (1 - warmFactor * 0.3));
      } else {
        result[i] = r;
        result[i + 1] = g;
        result[i + 2] = Math.min(255, b * (1 - Math.abs(warmFactor) * 0.3));
      }
    }

    return result;
  }

  static applyBlur(
    data: Uint8ClampedArray,
    radius: number,
    width: number,
    height: number
  ): Uint8ClampedArray {
    const result = new Uint8ClampedArray(data);
    const size = Math.floor(radius) || 1;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let r = 0, g = 0, b = 0, a = 0;
        let count = 0;

        for (let dy = -size; dy <= size; dy++) {
          for (let dx = -size; dx <= size; dx++) {
            const ny = y + dy;
            const nx = x + dx;

            if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
              const idx = (ny * width + nx) * 4;
              r += data[idx];
              g += data[idx + 1];
              b += data[idx + 2];
              a += data[idx + 3];
              count++;
            }
          }
        }

        const idx = (y * width + x) * 4;
        result[idx] = r / count;
        result[idx + 1] = g / count;
        result[idx + 2] = b / count;
        result[idx + 3] = a / count;
      }
    }

    return result;
  }

  static applyIntensity(
    originalData: Uint8ClampedArray,
    processedData: Uint8ClampedArray,
    intensity: number
  ): Uint8ClampedArray {
    const result = new Uint8ClampedArray(originalData.length);

    for (let i = 0; i < originalData.length; i++) {
      result[i] = originalData[i] * (1 - intensity) + processedData[i] * intensity;
    }

    return result;
  }
}
