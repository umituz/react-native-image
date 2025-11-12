/**
 * Image Domain - Image Service
 *
 * Service for image manipulation using expo-image-manipulator.
 * Provides abstraction layer for resizing, cropping, rotating images.
 *
 * NOTE: File operations use @umituz/react-native-filesystem (centralized)
 */

import * as ImageManipulator from 'expo-image-manipulator';
import { FileSystemService } from '@umituz/react-native-filesystem';
import type {
  ImageManipulateAction,
  ImageSaveOptions,
  ImageManipulationResult,
  SaveFormat,
} from '../../domain/entities/Image';
import { IMAGE_CONSTANTS, ImageUtils } from '../../domain/entities/Image';

/**
 * Image manipulation service
 */
export class ImageService {
  /**
   * Resize image to specified dimensions
   */
  static async resize(
    uri: string,
    width?: number,
    height?: number,
    options?: ImageSaveOptions
  ): Promise<ImageManipulationResult | null> {
    try {
      const result = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width, height } }],
        {
          compress: options?.compress || IMAGE_CONSTANTS.DEFAULT_QUALITY,
          format: ImageService.mapFormatToManipulator(options?.format),
          base64: options?.base64,
        }
      );

      return result;
    } catch (error) {
      return null;
    }
  }

  /**
   * Crop image to specified area
   */
  static async crop(
    uri: string,
    cropArea: { originX: number; originY: number; width: number; height: number },
    options?: ImageSaveOptions
  ): Promise<ImageManipulationResult | null> {
    try {
      const result = await ImageManipulator.manipulateAsync(
        uri,
        [{ crop: cropArea }],
        {
          compress: options?.compress || IMAGE_CONSTANTS.DEFAULT_QUALITY,
          format: ImageService.mapFormatToManipulator(options?.format),
          base64: options?.base64,
        }
      );

      return result;
    } catch (error) {
      return null;
    }
  }

  /**
   * Rotate image by degrees
   */
  static async rotate(
    uri: string,
    degrees: number,
    options?: ImageSaveOptions
  ): Promise<ImageManipulationResult | null> {
    try {
      const result = await ImageManipulator.manipulateAsync(
        uri,
        [{ rotate: degrees }],
        {
          compress: options?.compress || IMAGE_CONSTANTS.DEFAULT_QUALITY,
          format: ImageService.mapFormatToManipulator(options?.format),
          base64: options?.base64,
        }
      );

      return result;
    } catch (error) {
      return null;
    }
  }

  /**
   * Flip image horizontally or vertically
   */
  static async flip(
    uri: string,
    flip: { horizontal?: boolean; vertical?: boolean },
    options?: ImageSaveOptions
  ): Promise<ImageManipulationResult | null> {
    try {
      const actions: ImageManipulator.Action[] = [];

      if (flip.horizontal) {
        actions.push({ flip: ImageManipulator.FlipType.Horizontal });
      }

      if (flip.vertical) {
        actions.push({ flip: ImageManipulator.FlipType.Vertical });
      }

      const result = await ImageManipulator.manipulateAsync(
        uri,
        actions,
        {
          compress: options?.compress || IMAGE_CONSTANTS.DEFAULT_QUALITY,
          format: ImageService.mapFormatToManipulator(options?.format),
          base64: options?.base64,
        }
      );

      return result;
    } catch (error) {
      return null;
    }
  }

  /**
   * Perform multiple image manipulations
   */
  static async manipulate(
    uri: string,
    action: ImageManipulateAction,
    options?: ImageSaveOptions
  ): Promise<ImageManipulationResult | null> {
    try {
      const manipulatorActions: ImageManipulator.Action[] = [];

      if (action.resize) {
        manipulatorActions.push({ resize: action.resize });
      }

      if (action.crop) {
        manipulatorActions.push({ crop: action.crop });
      }

      if (action.rotate) {
        manipulatorActions.push({ rotate: action.rotate });
      }

      if (action.flip) {
        if (action.flip.horizontal) {
          manipulatorActions.push({ flip: ImageManipulator.FlipType.Horizontal });
        }
        if (action.flip.vertical) {
          manipulatorActions.push({ flip: ImageManipulator.FlipType.Vertical });
        }
      }

      const result = await ImageManipulator.manipulateAsync(
        uri,
        manipulatorActions,
        {
          compress: options?.compress || IMAGE_CONSTANTS.DEFAULT_QUALITY,
          format: ImageService.mapFormatToManipulator(options?.format),
          base64: options?.base64,
        }
      );

      return result;
    } catch (error) {
      return null;
    }
  }

  /**
   * Compress image to reduce file size
   */
  static async compress(
    uri: string,
    quality: number = IMAGE_CONSTANTS.DEFAULT_QUALITY
  ): Promise<ImageManipulationResult | null> {
    try {
      const result = await ImageManipulator.manipulateAsync(
        uri,
        [],
        {
          compress: quality,
        }
      );

      return result;
    } catch (error) {
      return null;
    }
  }

  /**
   * Resize image to fit within max dimensions (maintaining aspect ratio)
   */
  static async resizeToFit(
    uri: string,
    maxWidth: number,
    maxHeight: number,
    options?: ImageSaveOptions
  ): Promise<ImageManipulationResult | null> {
    try {
      // Use ImageUtils to calculate fitted dimensions
      const dimensions = ImageUtils.fitToSize(maxWidth, maxHeight, maxWidth, maxHeight);

      return ImageService.resize(uri, dimensions.width, dimensions.height, options);
    } catch (error) {
      return null;
    }
  }

  /**
   * Create thumbnail (small preview image)
   */
  static async createThumbnail(
    uri: string,
    size: number = IMAGE_CONSTANTS.THUMBNAIL_SIZE,
    options?: ImageSaveOptions
  ): Promise<ImageManipulationResult | null> {
    try {
      return ImageService.resizeToFit(uri, size, size, {
        ...options,
        compress: options?.compress || IMAGE_CONSTANTS.COMPRESS_QUALITY.MEDIUM,
      });
    } catch (error) {
      return null;
    }
  }

  /**
   * Crop image to square (centered)
   */
  static async cropToSquare(
    uri: string,
    width: number,
    height: number,
    options?: ImageSaveOptions
  ): Promise<ImageManipulationResult | null> {
    try {
      const cropArea = ImageUtils.getSquareCrop(width, height);
      return ImageService.crop(uri, cropArea, options);
    } catch (error) {
      return null;
    }
  }

  /**
   * Convert image format
   */
  static async convertFormat(
    uri: string,
    format: SaveFormat,
    quality?: number
  ): Promise<ImageManipulationResult | null> {
    try {
      const result = await ImageManipulator.manipulateAsync(
        uri,
        [],
        {
          compress: quality || IMAGE_CONSTANTS.DEFAULT_QUALITY,
          format: ImageService.mapFormatToManipulator(format),
        }
      );

      return result;
    } catch (error) {
      return null;
    }
  }

  /**
   * Save manipulated image to device using FileSystemService
   */
  static async saveImage(
    uri: string,
    filename?: string
  ): Promise<string | null> {
    try {
      const result = await FileSystemService.copyToDocuments(uri, filename);
      return result.success ? result.uri : null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Map SaveFormat to ImageManipulator.SaveFormat
   */
  private static mapFormatToManipulator(
    format?: SaveFormat
  ): ImageManipulator.SaveFormat {
    if (!format || format === 'jpeg') {
      return ImageManipulator.SaveFormat.JPEG;
    }
    if (format === 'png') {
      return ImageManipulator.SaveFormat.PNG;
    }
    if (format === 'webp') {
      return ImageManipulator.SaveFormat.WEBP;
    }
    return ImageManipulator.SaveFormat.JPEG;
  }
}

