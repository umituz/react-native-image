/**
 * Image Infrastructure - Conversion Service
 * 
 * Handles format conversion, compression, and thumbnail generation
 */

import * as ImageManipulator from 'expo-image-manipulator';
import type {
    ImageSaveOptions,
    ImageManipulationResult,
    SaveFormat,
} from '../../domain/entities/ImageTypes';
import { IMAGE_CONSTANTS } from '../../domain/entities/ImageConstants';
import { ImageTransformService } from './ImageTransformService';
import { ImageValidator } from '../utils/ImageValidator';
import { ImageErrorHandler, IMAGE_ERROR_CODES } from '../utils/ImageErrorHandler';
import { ImageTransformUtils } from '../utils/ImageTransformUtils';

export class ImageConversionService {
    static async compress(
        uri: string,
        quality: number = IMAGE_CONSTANTS.defaultQuality
    ): Promise<ImageManipulationResult> {
        try {
            ImageValidator.validateUri(uri);
            ImageValidator.validateQuality(quality);

            return await ImageManipulator.manipulateAsync(
                uri,
                [],
                { compress: quality }
            );
        } catch (error) {
            throw ImageErrorHandler.handleUnknownError(error, 'compress');
        }
    }

    static async convertFormat(
        uri: string,
        format: SaveFormat,
        quality?: number
    ): Promise<ImageManipulationResult> {
        try {
            ImageValidator.validateUri(uri);
            const compressQuality = quality ?? IMAGE_CONSTANTS.defaultQuality;
            return await ImageManipulator.manipulateAsync(
                uri,
                [],
                {
                    compress: compressQuality,
                    format: ImageTransformUtils.mapFormat(format),
                }
            );
        } catch (error) {
            throw ImageErrorHandler.handleUnknownError(error, 'convertFormat');
        }
    }

    static async createThumbnail(
        uri: string,
        size: number = IMAGE_CONSTANTS.thumbnailSize,
        options?: ImageSaveOptions
    ): Promise<ImageManipulationResult> {
        try {
            ImageValidator.validateUri(uri);
            return await ImageTransformService.resizeToFit(uri, size, size, {
                ...options,
                compress: options?.compress ?? IMAGE_CONSTANTS.compressQuality.medium,
            });
        } catch (error) {
            throw ImageErrorHandler.handleUnknownError(error, 'createThumbnail');
        }
    }
}
