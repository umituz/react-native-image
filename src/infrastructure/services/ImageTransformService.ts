/**
 * Image Infrastructure - Transform Service
 * 
 * Handles geometric transformations: resize, crop, rotate, flip
 */

import * as ImageManipulator from 'expo-image-manipulator';
import type {
    ImageManipulateAction,
    ImageSaveOptions,
    ImageManipulationResult,
    SaveFormat,
    ImageCropArea,
    ImageFlipOptions,
} from '../../domain/entities/ImageTypes';
import { IMAGE_CONSTANTS } from '../../domain/entities/ImageConstants';
import { ImageUtils } from '../../domain/utils/ImageUtils';
import { ImageValidator } from '../utils/ImageValidator';
import { ImageErrorHandler, IMAGE_ERROR_CODES } from '../utils/ImageErrorHandler';

export class ImageTransformService {
    private static mapFormat(format?: SaveFormat): ImageManipulator.SaveFormat {
        if (format === 'png') return ImageManipulator.SaveFormat.PNG;
        if (format === 'webp') return ImageManipulator.SaveFormat.WEBP;
        return ImageManipulator.SaveFormat.JPEG;
    }

    private static buildSaveOptions(options?: ImageSaveOptions): ImageManipulator.SaveOptions {
        return {
            compress: options?.compress ?? IMAGE_CONSTANTS.defaultQuality,
            format: this.mapFormat(options?.format),
            base64: options?.base64,
        };
    }

    static async resize(
        uri: string,
        width?: number,
        height?: number,
        options?: ImageSaveOptions
    ): Promise<ImageManipulationResult> {
        try {
            const uriValidation = ImageValidator.validateUri(uri);
            if (!uriValidation.isValid) {
                throw ImageErrorHandler.createError(uriValidation.error!, IMAGE_ERROR_CODES.INVALID_URI, 'resize');
            }

            const dimValidation = ImageValidator.validateDimensions({ width, height });
            if (!dimValidation.isValid) {
                throw ImageErrorHandler.createError(dimValidation.error!, IMAGE_ERROR_CODES.INVALID_DIMENSIONS, 'resize');
            }

            return await ImageManipulator.manipulateAsync(
                uri,
                [{ resize: { width, height } }],
                this.buildSaveOptions(options)
            );
        } catch (error) {
            throw ImageErrorHandler.handleUnknownError(error, 'resize');
        }
    }

    static async crop(
        uri: string,
        cropArea: ImageCropArea,
        options?: ImageSaveOptions
    ): Promise<ImageManipulationResult> {
        try {
            const uriValidation = ImageValidator.validateUri(uri);
            if (!uriValidation.isValid) {
                throw ImageErrorHandler.createError(uriValidation.error!, IMAGE_ERROR_CODES.INVALID_URI, 'crop');
            }

            const dimValidation = ImageValidator.validateDimensions(cropArea);
            if (!dimValidation.isValid) {
                throw ImageErrorHandler.createError(dimValidation.error!, IMAGE_ERROR_CODES.INVALID_DIMENSIONS, 'crop');
            }

            return await ImageManipulator.manipulateAsync(
                uri,
                [{ crop: cropArea }],
                this.buildSaveOptions(options)
            );
        } catch (error) {
            throw ImageErrorHandler.handleUnknownError(error, 'crop');
        }
    }

    static async rotate(
        uri: string,
        degrees: number,
        options?: ImageSaveOptions
    ): Promise<ImageManipulationResult> {
        try {
            const uriValidation = ImageValidator.validateUri(uri);
            if (!uriValidation.isValid) {
                throw ImageErrorHandler.createError(uriValidation.error!, IMAGE_ERROR_CODES.INVALID_URI, 'rotate');
            }

            const rotationValidation = ImageValidator.validateRotation(degrees);
            if (!rotationValidation.isValid) {
                throw ImageErrorHandler.createError(rotationValidation.error!, IMAGE_ERROR_CODES.VALIDATION_ERROR, 'rotate');
            }

            return await ImageManipulator.manipulateAsync(
                uri,
                [{ rotate: degrees }],
                this.buildSaveOptions(options)
            );
        } catch (error) {
            throw ImageErrorHandler.handleUnknownError(error, 'rotate');
        }
    }

    static async flip(
        uri: string,
        flip: ImageFlipOptions,
        options?: ImageSaveOptions
    ): Promise<ImageManipulationResult> {
        try {
            const uriValidation = ImageValidator.validateUri(uri);
            if (!uriValidation.isValid) {
                throw ImageErrorHandler.createError(uriValidation.error!, IMAGE_ERROR_CODES.INVALID_URI, 'flip');
            }

            const actions: ImageManipulator.Action[] = [];
            if (flip.horizontal) actions.push({ flip: ImageManipulator.FlipType.Horizontal });
            if (flip.vertical) actions.push({ flip: ImageManipulator.FlipType.Vertical });

            return await ImageManipulator.manipulateAsync(
                uri,
                actions,
                this.buildSaveOptions(options)
            );
        } catch (error) {
            throw ImageErrorHandler.handleUnknownError(error, 'flip');
        }
    }
}
