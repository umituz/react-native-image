/**
 * Image Infrastructure - Advanced Transform Service
 */

import * as ImageManipulator from 'expo-image-manipulator';
import type {
    ImageManipulateAction,
    ImageSaveOptions,
    ImageManipulationResult,
} from '../../domain/entities/ImageTypes';
import { ImageTransformService } from './ImageTransformService';
import { ImageUtils } from '../../domain/utils/ImageUtils';
import { ImageValidator } from '../utils/ImageValidator';
import { ImageErrorHandler, IMAGE_ERROR_CODES } from '../utils/ImageErrorHandler';

export class ImageAdvancedTransformService {
    static async manipulate(
        uri: string,
        action: ImageManipulateAction,
        options?: ImageSaveOptions
    ): Promise<ImageManipulationResult> {
        try {
            const uriValidation = ImageValidator.validateUri(uri);
            if (!uriValidation.isValid) {
                throw ImageErrorHandler.createError(uriValidation.error!, IMAGE_ERROR_CODES.INVALID_URI, 'manipulate');
            }

            const actions: ImageManipulator.Action[] = [];
            
            if (action.resize) {
                const dimValidation = ImageValidator.validateDimensions(action.resize);
                if (!dimValidation.isValid) {
                    throw ImageErrorHandler.createError(dimValidation.error!, IMAGE_ERROR_CODES.INVALID_DIMENSIONS, 'manipulate');
                }
                actions.push({ resize: action.resize });
            }
            
            if (action.crop) {
                const dimValidation = ImageValidator.validateDimensions(action.crop);
                if (!dimValidation.isValid) {
                    throw ImageErrorHandler.createError(dimValidation.error!, IMAGE_ERROR_CODES.INVALID_DIMENSIONS, 'manipulate');
                }
                actions.push({ crop: action.crop });
            }
            
            if (action.rotate) {
                const rotationValidation = ImageValidator.validateRotation(action.rotate);
                if (!rotationValidation.isValid) {
                    throw ImageErrorHandler.createError(rotationValidation.error!, IMAGE_ERROR_CODES.VALIDATION_ERROR, 'manipulate');
                }
                actions.push({ rotate: action.rotate });
            }
            
            if (action.flip) {
                if (action.flip.horizontal) actions.push({ flip: ImageManipulator.FlipType.Horizontal });
                if (action.flip.vertical) actions.push({ flip: ImageManipulator.FlipType.Vertical });
            }

            return await ImageManipulator.manipulateAsync(
                uri,
                actions,
                ImageTransformService['buildSaveOptions'](options)
            );
        } catch (error) {
            throw ImageErrorHandler.handleUnknownError(error, 'manipulate');
        }
    }

    static async resizeToFit(
        uri: string,
        maxWidth: number,
        maxHeight: number,
        options?: ImageSaveOptions
    ): Promise<ImageManipulationResult> {
        try {
            const dimValidation = ImageValidator.validateDimensions({ width: maxWidth, height: maxHeight });
            if (!dimValidation.isValid) {
                throw ImageErrorHandler.createError(dimValidation.error!, IMAGE_ERROR_CODES.INVALID_DIMENSIONS, 'resizeToFit');
            }

            const dimensions = ImageUtils.fitToSize(maxWidth, maxHeight, maxWidth, maxHeight);
            return ImageTransformService.resize(uri, dimensions.width, dimensions.height, options);
        } catch (error) {
            throw ImageErrorHandler.handleUnknownError(error, 'resizeToFit');
        }
    }

    static async cropToSquare(
        uri: string,
        width: number,
        height: number,
        options?: ImageSaveOptions
    ): Promise<ImageManipulationResult> {
        try {
            const dimValidation = ImageValidator.validateDimensions({ width, height });
            if (!dimValidation.isValid) {
                throw ImageErrorHandler.createError(dimValidation.error!, IMAGE_ERROR_CODES.INVALID_DIMENSIONS, 'cropToSquare');
            }

            const cropArea = ImageUtils.getSquareCrop(width, height);
            return ImageTransformService.crop(uri, cropArea, options);
        } catch (error) {
            throw ImageErrorHandler.handleUnknownError(error, 'cropToSquare');
        }
    }
}