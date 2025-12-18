/**
 * Infrastructure - Filter Processor
 * 
 * Real-time filter processing with preview
 */

export interface FilterPreset {
  id: string;
  name: string;
  category: 'basic' | 'color' | 'artistic' | 'vintage';
  parameters: FilterParameter[];
  preview?: string;
}

export interface FilterParameter {
  name: string;
  type: 'slider' | 'color' | 'boolean';
  min?: number;
  max?: number;
  value: number | string | boolean;
  step?: number;
  label: string;
}

export interface FilterState {
  id: string;
  intensity: number;
  parameters: Record<string, any>;
  enabled: boolean;
}

export class FilterProcessor {
  private static readonly PRESETS: FilterPreset[] = [
    {
      id: 'brightness',
      name: 'Brightness',
      category: 'basic',
      parameters: [
        {
          name: 'brightness',
          type: 'slider',
          min: -100,
          max: 100,
          value: 0,
          label: 'Brightness',
        },
      ],
    },
    {
      id: 'contrast',
      name: 'Contrast',
      category: 'basic',
      parameters: [
        {
          name: 'contrast',
          type: 'slider',
          min: -100,
          max: 100,
          value: 0,
          label: 'Contrast',
        },
      ],
    },
    {
      id: 'saturation',
      name: 'Saturation',
      category: 'color',
      parameters: [
        {
          name: 'saturation',
          type: 'slider',
          min: -100,
          max: 100,
          value: 0,
          label: 'Saturation',
        },
      ],
    },
    {
      id: 'vintage',
      name: 'Vintage',
      category: 'vintage',
      parameters: [
        {
          name: 'intensity',
          type: 'slider',
          min: 0,
          max: 100,
          value: 50,
          label: 'Intensity',
        },
        {
          name: 'warmth',
          type: 'slider',
          min: 0,
          max: 100,
          value: 30,
          label: 'Warmth',
        },
      ],
    },
    {
      id: 'blur',
      name: 'Blur',
      category: 'artistic',
      parameters: [
        {
          name: 'radius',
          type: 'slider',
          min: 0,
          max: 20,
          value: 0,
          label: 'Blur Radius',
        },
      ],
    },
  ];

  static getPresets(category?: string): FilterPreset[] {
    if (category) {
      return this.PRESETS.filter(preset => preset.category === category);
    }
    return this.PRESETS;
  }

  static getPreset(id: string): FilterPreset | undefined {
    return this.PRESETS.find(preset => preset.id === id);
  }

  static createFilterState(presetId: string): FilterState {
    const preset = this.getPreset(presetId);
    if (!preset) {
      throw new Error(`Filter preset not found: ${presetId}`);
    }

    const parameters: Record<string, any> = {};
    preset.parameters.forEach(param => {
      parameters[param.name] = param.value;
    });

    return {
      id: presetId,
      intensity: 100,
      parameters,
      enabled: true,
    };
  }

  static applyFilter(
    imageData: ImageData,
    filterState: FilterState
  ): ImageData {
    const preset = this.getPreset(filterState.id);
    if (!preset || !filterState.enabled) {
      return imageData;
    }

    let processedData = new Uint8ClampedArray(imageData.data);

    // Apply filter based on preset type
    switch (filterState.id) {
      case 'brightness':
        processedData = this.applyBrightness(processedData, filterState.parameters.brightness) as any;
        break;
      case 'contrast':
        processedData = this.applyContrast(processedData, filterState.parameters.contrast) as any;
        break;
      case 'saturation':
        processedData = this.applySaturation(processedData, filterState.parameters.saturation) as any;
        break;
      case 'vintage':
        processedData = this.applyVintage(processedData, filterState.parameters.intensity, filterState.parameters.warmth) as any;
        break;
      case 'blur':
        processedData = this.applyBlur(processedData, filterState.parameters.radius) as any;
        break;
    }

    // Apply intensity
    if (filterState.intensity < 100) {
      processedData = this.applyIntensity(imageData.data, processedData, filterState.intensity / 100) as any;
    }

    return {
      ...imageData,
      data: processedData,
    };
  }

  private static applyBrightness(
    data: Uint8ClampedArray,
    brightness: number
  ): Uint8ClampedArray {
    const result = new Uint8ClampedArray(data);
    const adjustment = brightness * 2.55; // Convert -100 to 100 to -255 to 255

    for (let i = 0; i < result.length; i += 4) {
      result[i] = Math.min(255, Math.max(0, result[i] + adjustment));
      result[i + 1] = Math.min(255, Math.max(0, result[i + 1] + adjustment));
      result[i + 2] = Math.min(255, Math.max(0, result[i + 2] + adjustment));
    }

    return result;
  }

  private static applyContrast(
    data: Uint8ClampedArray,
    contrast: number
  ): Uint8ClampedArray {
    const result = new Uint8ClampedArray(data);
    const factor = (259 * (contrast * 255 + 255)) / (255 * (259 - contrast * 255));

    for (let i = 0; i < result.length; i += 4) {
      result[i] = Math.min(255, Math.max(0, factor * (result[i] - 128) + 128));
      result[i + 1] = Math.min(255, Math.max(0, factor * (result[i + 1] - 128) + 128));
      result[i + 2] = Math.min(255, Math.max(0, factor * (result[i + 2] - 128) + 128));
    }

    return result;
  }

  private static applySaturation(
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

  private static applyVintage(
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

      // Apply sepia effect
      const tr = 0.393 * r + 0.769 * g + 0.189 * b;
      const tg = 0.349 * r + 0.686 * g + 0.168 * b;
      const tb = 0.272 * r + 0.534 * g + 0.131 * b;

      // Mix with original based on intensity
      r = r * (1 - factor) + tr * factor;
      g = g * (1 - factor) + tg * factor;
      b = b * (1 - factor) + tb * factor;

      // Apply warmth
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

  private static applyBlur(
    data: Uint8ClampedArray,
    radius: number
  ): Uint8ClampedArray {
    // Simple box blur implementation
    const result = new Uint8ClampedArray(data);
    const width = Math.sqrt(data.length / 4);
    const height = width;
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

  private static applyIntensity(
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

  static createPreview(
    imageData: ImageData,
    filterState: FilterState,
    previewSize: { width: number; height: number }
  ): ImageData {
    // Create a smaller preview version
    const previewCanvas = document.createElement('canvas') || {} as any;
    previewCanvas.width = previewSize.width;
    previewCanvas.height = previewSize.height;
    const ctx = previewCanvas.getContext('2d');

    if (!ctx) return imageData;

    // Scale down the image for preview
    ctx.drawImage(
      {} as HTMLImageElement, // Would be the actual image
      0, 0, previewSize.width, previewSize.height
    );

    const previewImageData = ctx.getImageData(0, 0, previewSize.width, previewSize.height);
    return this.applyFilter(previewImageData, filterState);
  }
}