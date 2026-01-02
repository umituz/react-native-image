/**
 * Infrastructure - Transform Utils
 * 
 * Internal utilities for image transformations
 */

import * as ImageManipulator from 'expo-image-manipulator';
import type { SaveFormat, ImageSaveOptions } from '../../domain/entities/ImageTypes';
import { IMAGE_CONSTANTS } from '../../domain/entities/ImageConstants';

export class ImageTransformUtils {
  static mapFormat(format?: SaveFormat): ImageManipulator.SaveFormat {
    if (format === 'png') return ImageManipulator.SaveFormat.PNG;
    if (format === 'webp') return ImageManipulator.SaveFormat.WEBP;
    return ImageManipulator.SaveFormat.JPEG;
  }

  static buildSaveOptions(options?: ImageSaveOptions): ImageManipulator.SaveOptions {
    return {
      compress: options?.compress ?? IMAGE_CONSTANTS.defaultQuality,
      format: this.mapFormat(options?.format),
      base64: options?.base64,
    };
  }
}
