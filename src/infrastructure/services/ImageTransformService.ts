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
    ImageCropArea,
    ImageFlipOptions,
} from '../../domain/entities/ImageTypes';
import { ImageUtils } from '../../domain/utils/ImageUtils';
import { ImageValidator } from '../utils/ImageValidator';
import { ImageErrorHandler, IMAGE_ERROR_CODES } from '../utils/ImageErrorHandler';
import { ImageTransformUtils } from '../utils/ImageTransformUtils';

export class ImageTransformService {
    static async resize(uri: string, width?: number, height?: number, options?: ImageSaveOptions): Promise<ImageManipulationResult> {
        try {
            ImageValidator.validateUri(uri);
            ImageValidator.validateDimensions({ width, height });
            return await ImageManipulator.manipulateAsync(uri, [{ resize: { width, height } }], ImageTransformUtils.buildSaveOptions(options));
        } catch (error) {
            throw ImageErrorHandler.handleUnknownError(error, 'resize');
        }
    }

    static async crop(uri: string, cropArea: ImageCropArea, options?: ImageSaveOptions): Promise<ImageManipulationResult> {
        try {
            ImageValidator.validateUri(uri);
            ImageValidator.validateDimensions(cropArea);
            return await ImageManipulator.manipulateAsync(uri, [{ crop: cropArea }], ImageTransformUtils.buildSaveOptions(options));
        } catch (error) {
            throw ImageErrorHandler.handleUnknownError(error, 'crop');
        }
    }

    static async rotate(uri: string, degrees: number, options?: ImageSaveOptions): Promise<ImageManipulationResult> {
        try {
            ImageValidator.validateUri(uri);
            ImageValidator.validateRotation(degrees);
            return await ImageManipulator.manipulateAsync(uri, [{ rotate: degrees }], ImageTransformUtils.buildSaveOptions(options));
        } catch (error) {
            throw ImageErrorHandler.handleUnknownError(error, 'rotate');
        }
    }

    static async flip(uri: string, flip: ImageFlipOptions, options?: ImageSaveOptions): Promise<ImageManipulationResult> {
        try {
            ImageValidator.validateUri(uri);
            const actions: ImageManipulator.Action[] = [];
            if (flip.horizontal) actions.push({ flip: ImageManipulator.FlipType.Horizontal });
            if (flip.vertical) actions.push({ flip: ImageManipulator.FlipType.Vertical });
            return await ImageManipulator.manipulateAsync(uri, actions, ImageTransformUtils.buildSaveOptions(options));
        } catch (error) {
            throw ImageErrorHandler.handleUnknownError(error, 'flip');
        }
    }

    static async manipulate(uri: string, action: ImageManipulateAction, options?: ImageSaveOptions): Promise<ImageManipulationResult> {
        try {
            ImageValidator.validateUri(uri);
            const actions: ImageManipulator.Action[] = [];
            if (action.resize) actions.push({ resize: action.resize });
            if (action.crop) actions.push({ crop: action.crop });
            if (action.rotate) actions.push({ rotate: action.rotate });
            if (action.flip) {
                if (action.flip.horizontal) actions.push({ flip: ImageManipulator.FlipType.Horizontal });
                if (action.flip.vertical) actions.push({ flip: ImageManipulator.FlipType.Vertical });
            }
            return await ImageManipulator.manipulateAsync(uri, actions, ImageTransformUtils.buildSaveOptions(options));
        } catch (error) {
            throw ImageErrorHandler.handleUnknownError(error, 'manipulate');
        }
    }

    static async resizeToFit(uri: string, maxWidth: number, maxHeight: number, options?: ImageSaveOptions): Promise<ImageManipulationResult> {
        const dimensions = ImageUtils.fitToSize(maxWidth, maxHeight, maxWidth, maxHeight);
        return this.resize(uri, dimensions.width, dimensions.height, options);
    }

    static async cropToSquare(uri: string, width: number, height: number, options?: ImageSaveOptions): Promise<ImageManipulationResult> {
        const cropArea = ImageUtils.getSquareCrop(width, height);
        return this.crop(uri, cropArea, options);
    }
}
