/**
 * Image Conversion Service
 * 
 * Handles format conversion, compression, and thumbnail generation.
 * (Thumbnail is treated as a specialized compression/resize)
 */

import * as ImageManipulator from 'expo-image-manipulator';
import type {
    ImageSaveOptions,
    ImageManipulationResult,
    SaveFormat,
} from '../../domain/entities/ImageTypes';
import { IMAGE_CONSTANTS } from '../../domain/entities/ImageConstants';
import { ImageTransformService } from './ImageTransformService';

export class ImageConversionService {
    static async compress(
        uri: string,
        quality: number = IMAGE_CONSTANTS.DEFAULT_QUALITY
    ): Promise<ImageManipulationResult | null> {
        try {
            return await ImageManipulator.manipulateAsync(
                uri,
                [],
                { compress: quality }
            );
        } catch {
            return null;
        }
    }

    static async convertFormat(
        uri: string,
        format: SaveFormat,
        quality?: number
    ): Promise<ImageManipulationResult | null> {
        try {
            return await ImageManipulator.manipulateAsync(
                uri,
                [],
                {
                    compress: quality || IMAGE_CONSTANTS.DEFAULT_QUALITY,
                    format: ImageTransformService.mapFormat(format),
                }
            );
        } catch {
            return null;
        }
    }

    static async createThumbnail(
        uri: string,
        size: number = IMAGE_CONSTANTS.THUMBNAIL_SIZE,
        options?: ImageSaveOptions
    ): Promise<ImageManipulationResult | null> {
        try {
            return ImageTransformService.resizeToFit(uri, size, size, {
                ...options,
                compress: options?.compress || IMAGE_CONSTANTS.COMPRESS_QUALITY.MEDIUM,
            });
        } catch {
            return null;
        }
    }
}
