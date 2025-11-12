/**
 * Image Domain - Core Entities
 *
 * This file defines core types and interfaces for image manipulation and viewing.
 * Handles image operations using expo-image-manipulator and react-native-image-viewing.
 */

/**
 * Image format types
 */
export enum ImageFormat {
  JPEG = 'jpeg',
  PNG = 'png',
  WEBP = 'webp',
}

/**
 * Image save format for expo-image-manipulator
 */
export type SaveFormat = 'jpeg' | 'png' | 'webp';

/**
 * Image manipulation action types
 */
export interface ImageManipulateAction {
  resize?: { width?: number; height?: number };
  crop?: { originX: number; originY: number; width: number; height: number };
  rotate?: number; // degrees
  flip?: { vertical?: boolean; horizontal?: boolean };
}

/**
 * Image save options
 */
export interface ImageSaveOptions {
  format?: SaveFormat;
  compress?: number; // 0-1
  base64?: boolean;
}

/**
 * Image manipulation result
 */
export interface ImageManipulationResult {
  uri: string;
  width: number;
  height: number;
  base64?: string;
}

/**
 * Image metadata
 */
export interface ImageMetadata {
  uri: string;
  width: number;
  height: number;
  format?: ImageFormat;
  size?: number; // bytes
  orientation?: ImageOrientation;
}

/**
 * Image orientation
 */
export enum ImageOrientation {
  PORTRAIT = 'portrait',
  LANDSCAPE = 'landscape',
  SQUARE = 'square',
}

/**
 * Image viewer item
 */
export interface ImageViewerItem {
  uri: string;
  title?: string;
  description?: string;
  width?: number;
  height?: number;
}

/**
 * Image gallery options
 */
export interface ImageGalleryOptions {
  index?: number; // Starting index
  backgroundColor?: string;
  swipeToCloseEnabled?: boolean;
  doubleTapToZoomEnabled?: boolean;
  onDismiss?: () => void;
  onIndexChange?: (index: number) => void;
}

/**
 * Image operation result
 */
export interface ImageOperationResult {
  success: boolean;
  uri?: string;
  error?: string;
  width?: number;
  height?: number;
}

/**
 * Image constants
 */
export const IMAGE_CONSTANTS = {
  MAX_WIDTH: 2048,
  MAX_HEIGHT: 2048,
  DEFAULT_QUALITY: 0.8,
  THUMBNAIL_SIZE: 200,
  COMPRESS_QUALITY: {
    LOW: 0.5,
    MEDIUM: 0.7,
    HIGH: 0.9,
  },
  FORMAT: {
    JPEG: 'jpeg' as SaveFormat,
    PNG: 'png' as SaveFormat,
    WEBP: 'webp' as SaveFormat,
  },
} as const;

/**
 * Image utilities
 */
export class ImageUtils {
  /**
   * Get image orientation from dimensions
   */
  static getOrientation(width: number, height: number): ImageOrientation {
    if (width > height) return ImageOrientation.LANDSCAPE;
    if (height > width) return ImageOrientation.PORTRAIT;
    return ImageOrientation.SQUARE;
  }

  /**
   * Calculate aspect ratio
   */
  static getAspectRatio(width: number, height: number): number {
    return width / height;
  }

  /**
   * Calculate dimensions to fit within max size while preserving aspect ratio
   */
  static fitToSize(
    width: number,
    height: number,
    maxWidth: number,
    maxHeight: number
  ): { width: number; height: number } {
    const aspectRatio = ImageUtils.getAspectRatio(width, height);

    let newWidth = width;
    let newHeight = height;

    if (width > maxWidth) {
      newWidth = maxWidth;
      newHeight = newWidth / aspectRatio;
    }

    if (newHeight > maxHeight) {
      newHeight = maxHeight;
      newWidth = newHeight * aspectRatio;
    }

    return {
      width: Math.round(newWidth),
      height: Math.round(newHeight),
    };
  }

  /**
   * Calculate thumbnail dimensions (maintains aspect ratio)
   */
  static getThumbnailSize(
    width: number,
    height: number,
    thumbnailSize: number = IMAGE_CONSTANTS.THUMBNAIL_SIZE
  ): { width: number; height: number } {
    return ImageUtils.fitToSize(width, height, thumbnailSize, thumbnailSize);
  }

  /**
   * Validate image URI
   */
  static isValidImageUri(uri: string): boolean {
    if (!uri) return false;

    // Check if it's a valid URI format
    return (
      uri.startsWith('file://') ||
      uri.startsWith('content://') ||
      uri.startsWith('http://') ||
      uri.startsWith('https://') ||
      uri.startsWith('data:image/')
    );
  }

  /**
   * Get image format from URI
   */
  static getFormatFromUri(uri: string): ImageFormat | null {
    const lowerUri = uri.toLowerCase();

    if (lowerUri.includes('.jpg') || lowerUri.includes('.jpeg')) {
      return ImageFormat.JPEG;
    }

    if (lowerUri.includes('.png')) {
      return ImageFormat.PNG;
    }

    if (lowerUri.includes('.webp')) {
      return ImageFormat.WEBP;
    }

    return null;
  }

  /**
   * Get file extension from format
   */
  static getExtensionFromFormat(format: ImageFormat): string {
    switch (format) {
      case ImageFormat.JPEG:
        return 'jpg';
      case ImageFormat.PNG:
        return 'png';
      case ImageFormat.WEBP:
        return 'webp';
      default:
        return 'jpg';
    }
  }

  /**
   * Calculate crop dimensions for square crop (centered)
   */
  static getSquareCrop(width: number, height: number): ImageManipulateAction['crop'] {
    const size = Math.min(width, height);
    const originX = (width - size) / 2;
    const originY = (height - size) / 2;

    return {
      originX: Math.round(originX),
      originY: Math.round(originY),
      width: Math.round(size),
      height: Math.round(size),
    };
  }

  /**
   * Format file size to human-readable string
   */
  static formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  /**
   * Check if image needs compression based on size
   */
  static needsCompression(bytes: number, maxSizeMB: number = 2): boolean {
    const maxBytes = maxSizeMB * 1024 * 1024;
    return bytes > maxBytes;
  }
}

