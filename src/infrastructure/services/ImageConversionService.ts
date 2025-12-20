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
import { ImageAdvancedTransformService } from './ImageAdvancedTransformService';
import { ImageValidator } from '../utils/ImageValidator';
import { ImageErrorHandler, IMAGE_ERROR_CODES } from '../utils/ImageErrorHandler';

export class ImageConversionService {
    static async compress(
        uri: string,
        quality: number = IMAGE_CONSTANTS.defaultQuality
    ): Promise<ImageManipulationResult> {
        try {
            const uriValidation = ImageValidator.validateUri(uri);
            if (!uriValidation.isValid) {
                throw ImageErrorHandler.createError(uriValidation.error!, IMAGE_ERROR_CODES.INVALID_URI, 'compress');
            }

            const qualityValidation = ImageValidator.validateQuality(quality);
            if (!qualityValidation.isValid) {
                throw ImageErrorHandler.createError(qualityValidation.error!, IMAGE_ERROR_CODES.INVALID_QUALITY, 'compress');
            }

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
            const uriValidation = ImageValidator.validateUri(uri);
            if (!uriValidation.isValid) {
                throw ImageErrorHandler.createError(uriValidation.error!, IMAGE_ERROR_CODES.INVALID_URI, 'convertFormat');
            }

            const compressQuality = quality ?? IMAGE_CONSTANTS.defaultQuality;
            const qualityValidation = ImageValidator.validateQuality(compressQuality);
            if (!qualityValidation.isValid) {
                throw ImageErrorHandler.createError(qualityValidation.error!, IMAGE_ERROR_CODES.INVALID_QUALITY, 'convertFormat');
            }

            return await ImageManipulator.manipulateAsync(
                uri,
                [],
                {
                    compress: compressQuality,
                    format: ImageTransformService['mapFormat'](format),
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
            const uriValidation = ImageValidator.validateUri(uri);
            if (!uriValidation.isValid) {
                throw ImageErrorHandler.createError(uriValidation.error!, IMAGE_ERROR_CODES.INVALID_URI, 'createThumbnail');
            }

            const dimValidation = ImageValidator.validateDimensions({ width: size, height: size });
            if (!dimValidation.isValid) {
                throw ImageErrorHandler.createError(dimValidation.error!, IMAGE_ERROR_CODES.INVALID_DIMENSIONS, 'createThumbnail');
            }

            return await ImageAdvancedTransformService.resizeToFit(uri, size, size, {
                ...options,
                compress: options?.compress ?? IMAGE_CONSTANTS.compressQuality.medium,
            });
        } catch (error) {
            throw ImageErrorHandler.handleUnknownError(error, 'createThumbnail');
        }
    }
}
