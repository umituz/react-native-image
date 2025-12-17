/**
 * Image Domain - Filter Types
 */

export enum ImageFilterType {
  BLUR = 'blur',
  SHARPEN = 'sharpen',
  BRIGHTNESS = 'brightness',
  CONTRAST = 'contrast',
  SATURATION = 'saturation',
  SEPIA = 'sepia',
  GRAYSCALE = 'grayscale',
  VINTAGE = 'vintage',
  VIGNETTE = 'vignette',
}

export interface ImageFilterOptions {
  intensity?: number;
  radius?: number;
  amount?: number;
}

export interface ImageFilter {
  type: ImageFilterType;
  options?: ImageFilterOptions;
}

export interface ImageColorAdjustment {
  brightness?: number;
  contrast?: number;
  saturation?: number;
  hue?: number;
}

export interface ImageQualityMetrics {
  sharpness: number;
  brightness: number;
  contrast: number;
  colorfulness: number;
  overallQuality: number;
}

export interface ImageColorPalette {
  dominant: string[];
  palette: Array<{
    color: string;
    percentage: number;
    population: number;
  }>;
}

export interface ImageMetadataExtended {
  format: string;
  size: number;
  dimensions: { width: number; height: number };
  colorSpace: string;
  hasAlpha: boolean;
  orientation: number;
  dpi?: number;
  creationDate?: Date;
  modificationDate?: Date;
  gps?: { latitude: number; longitude: number };
  camera?: {
    make?: string;
    model?: string;
    iso?: number;
    flash?: boolean;
    focalLength?: number;
  };
}