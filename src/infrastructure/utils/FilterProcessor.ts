/**
 * Infrastructure - Filter Processor
 * 
 * Filter processing with preset management
 */

import { ImageFilterUtils } from './ImageFilterUtils';

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
      parameters: [{ name: 'brightness', type: 'slider', min: -100, max: 100, value: 0, label: 'Brightness' }],
    },
    {
      id: 'contrast',
      name: 'Contrast',
      category: 'basic',
      parameters: [{ name: 'contrast', type: 'slider', min: -100, max: 100, value: 0, label: 'Contrast' }],
    },
    {
      id: 'saturation',
      name: 'Saturation',
      category: 'color',
      parameters: [{ name: 'saturation', type: 'slider', min: -100, max: 100, value: 0, label: 'Saturation' }],
    },
    {
      id: 'vintage',
      name: 'Vintage',
      category: 'vintage',
      parameters: [
        { name: 'intensity', type: 'slider', min: 0, max: 100, value: 50, label: 'Intensity' },
        { name: 'warmth', type: 'slider', min: 0, max: 100, value: 30, label: 'Warmth' },
      ],
    },
    {
      id: 'blur',
      name: 'Blur',
      category: 'artistic',
      parameters: [{ name: 'radius', type: 'slider', min: 0, max: 20, value: 0, label: 'Blur Radius' }],
    },
  ];

  static getPresets(category?: string): FilterPreset[] {
    return category ? this.PRESETS.filter(preset => preset.category === category) : this.PRESETS;
  }

  static getPreset(id: string): FilterPreset | undefined {
    return this.PRESETS.find(preset => preset.id === id);
  }

  static createFilterState(presetId: string): FilterState {
    const preset = this.getPreset(presetId);
    if (!preset) throw new Error(`Filter preset not found: ${presetId}`);

    const parameters: Record<string, any> = {};
    preset.parameters.forEach(param => { parameters[param.name] = param.value; });

    return { id: presetId, intensity: 100, parameters, enabled: true };
  }

  static applyFilter(
    imageData: Uint8ClampedArray,
    width: number,
    height: number,
    filterState: FilterState
  ): Uint8ClampedArray {
    const preset = this.getPreset(filterState.id);
    if (!preset || !filterState.enabled) return imageData;

    let processedData = new Uint8ClampedArray(imageData);

    switch (filterState.id) {
      case 'brightness':
        processedData = ImageFilterUtils.applyBrightness(processedData, filterState.parameters.brightness) as any;
        break;
      case 'contrast':
        processedData = ImageFilterUtils.applyContrast(processedData, filterState.parameters.contrast) as any;
        break;
      case 'saturation':
        processedData = ImageFilterUtils.applySaturation(processedData, filterState.parameters.saturation) as any;
        break;
      case 'vintage':
        processedData = ImageFilterUtils.applyVintage(processedData, filterState.parameters.intensity, filterState.parameters.warmth) as any;
        break;
      case 'blur':
        processedData = ImageFilterUtils.applyBlur(processedData, filterState.parameters.radius, width, height) as any;
        break;
    }

    if (filterState.intensity < 100) {
      processedData = ImageFilterUtils.applyIntensity(imageData, processedData, filterState.intensity / 100) as any;
    }

    return processedData as any;
  }
}