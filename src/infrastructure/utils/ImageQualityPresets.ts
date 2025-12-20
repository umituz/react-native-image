/**
 * Image Infrastructure - Quality Presets
 * 
 * Predefined quality settings for different use cases
 */

import type { SaveFormat } from '../../domain/entities/ImageTypes';
import { IMAGE_CONSTANTS } from '../../domain/entities/ImageConstants';

export interface QualityPreset {
  format: SaveFormat;
  quality: number;
  maxWidth?: number;
  maxHeight?: number;
  description: string;
}

export interface QualityPresets {
  web: QualityPreset;
  mobile: QualityPreset;
  print: QualityPreset;
  thumbnail: QualityPreset;
  preview: QualityPreset;
  archive: QualityPreset;
}

export const IMAGE_QUALITY_PRESETS: QualityPresets = {
  web: {
    format: 'jpeg',
    quality: 0.8,
    maxWidth: 1920,
    maxHeight: 1080,
    description: 'Optimized for web use with good balance of quality and size',
  },
  mobile: {
    format: 'jpeg',
    quality: 0.7,
    maxWidth: 1080,
    maxHeight: 1920,
    description: 'Optimized for mobile devices with smaller file size',
  },
  print: {
    format: 'png',
    quality: 1.0,
    maxWidth: 3000,
    maxHeight: 3000,
    description: 'High quality for printing with maximum detail',
  },
  thumbnail: {
    format: 'jpeg',
    quality: 0.6,
    maxWidth: IMAGE_CONSTANTS.thumbnailSize,
    maxHeight: IMAGE_CONSTANTS.thumbnailSize,
    description: 'Small thumbnail for preview use',
  },
  preview: {
    format: 'jpeg',
    quality: 0.5,
    maxWidth: 800,
    maxHeight: 600,
    description: 'Quick preview with very small file size',
  },
  archive: {
    format: 'png',
    quality: 0.9,
    description: 'High quality archival storage with lossless compression',
  },
};

export class ImageQualityPresetService {
  static getPreset(name: keyof QualityPresets): QualityPreset {
    return IMAGE_QUALITY_PRESETS[name];
  }

  static getAllPresets(): QualityPresets {
    return IMAGE_QUALITY_PRESETS;
  }

  static getCustomPreset(options: {
    format?: SaveFormat;
    quality?: number;
    maxWidth?: number;
    maxHeight?: number;
  }): QualityPreset {
    return {
      format: options.format || 'jpeg',
      quality: options.quality || IMAGE_CONSTANTS.defaultQuality,
      maxWidth: options.maxWidth,
      maxHeight: options.maxHeight,
      description: 'Custom quality preset',
    };
  }

  static optimizeForUseCase(
    useCase: 'web' | 'mobile' | 'print' | 'thumbnail' | 'preview' | 'archive',
    customOptions?: Partial<QualityPreset>
  ): QualityPreset {
    const preset = IMAGE_QUALITY_PRESETS[useCase];
    
    if (!customOptions) {
      return preset;
    }

    return {
      ...preset,
      ...customOptions,
      description: `${preset.description} (modified)`,
    };
  }
}