/**
 * Image Transform Service
 * 
 * Handles basic geometric transformations: resize, crop, rotate, flip.
 * Also handles combined manipulations.
 */

import * as ImageManipulator from 'expo-image-manipulator';
import type {
    ImageManipulateAction,
    ImageSaveOptions,
    ImageManipulationResult,
    SaveFormat,
} from '../../domain/entities/ImageTypes';
import { IMAGE_CONSTANTS } from '../../domain/entities/ImageConstants';
import { ImageUtils } from '../../domain/utils/ImageUtils';

export class ImageTransformService {
    /**
     * Helper to map SaveFormat to Manipulator format
     */
    static mapFormat(format?: SaveFormat): ImageManipulator.SaveFormat {
        if (format === 'png') return ImageManipulator.SaveFormat.PNG;
        if (format === 'webp') return ImageManipulator.SaveFormat.WEBP;
        return ImageManipulator.SaveFormat.JPEG;
    }

    static async resize(
        uri: string,
        width?: number,
        height?: number,
        options?: ImageSaveOptions
    ): Promise<ImageManipulationResult | null> {
        try {
            return await ImageManipulator.manipulateAsync(
                uri,
                [{ resize: { width, height } }],
                {
                    compress: options?.compress || IMAGE_CONSTANTS.DEFAULT_QUALITY,
                    format: ImageTransformService.mapFormat(options?.format),
                    base64: options?.base64,
                }
            );
        } catch {
            return null;
        }
    }

    static async crop(
        uri: string,
        cropArea: { originX: number; originY: number; width: number; height: number },
        options?: ImageSaveOptions
    ): Promise<ImageManipulationResult | null> {
        try {
            return await ImageManipulator.manipulateAsync(
                uri,
                [{ crop: cropArea }],
                {
                    compress: options?.compress || IMAGE_CONSTANTS.DEFAULT_QUALITY,
                    format: ImageTransformService.mapFormat(options?.format),
                    base64: options?.base64,
                }
            );
        } catch {
            return null;
        }
    }

    static async rotate(
        uri: string,
        degrees: number,
        options?: ImageSaveOptions
    ): Promise<ImageManipulationResult | null> {
        try {
            return await ImageManipulator.manipulateAsync(
                uri,
                [{ rotate: degrees }],
                {
                    compress: options?.compress || IMAGE_CONSTANTS.DEFAULT_QUALITY,
                    format: ImageTransformService.mapFormat(options?.format),
                    base64: options?.base64,
                }
            );
        } catch {
            return null;
        }
    }

    static async flip(
        uri: string,
        flip: { horizontal?: boolean; vertical?: boolean },
        options?: ImageSaveOptions
    ): Promise<ImageManipulationResult | null> {
        try {
            const actions: ImageManipulator.Action[] = [];
            if (flip.horizontal) actions.push({ flip: ImageManipulator.FlipType.Horizontal });
            if (flip.vertical) actions.push({ flip: ImageManipulator.FlipType.Vertical });

            return await ImageManipulator.manipulateAsync(
                uri,
                actions,
                {
                    compress: options?.compress || IMAGE_CONSTANTS.DEFAULT_QUALITY,
                    format: ImageTransformService.mapFormat(options?.format),
                    base64: options?.base64,
                }
            );
        } catch {
            return null;
        }
    }

    static async manipulate(
        uri: string,
        action: ImageManipulateAction,
        options?: ImageSaveOptions
    ): Promise<ImageManipulationResult | null> {
        try {
            const actions: ImageManipulator.Action[] = [];
            if (action.resize) actions.push({ resize: action.resize });
            if (action.crop) {
                // @ts-ignore - guarded by check above
                actions.push({ crop: action.crop });
            }
            if (action.rotate) actions.push({ rotate: action.rotate });
            if (action.flip) {
                if (action.flip.horizontal) actions.push({ flip: ImageManipulator.FlipType.Horizontal });
                if (action.flip.vertical) actions.push({ flip: ImageManipulator.FlipType.Vertical });
            }

            return await ImageManipulator.manipulateAsync(
                uri,
                actions,
                {
                    compress: options?.compress || IMAGE_CONSTANTS.DEFAULT_QUALITY,
                    format: ImageTransformService.mapFormat(options?.format),
                    base64: options?.base64,
                }
            );
        } catch {
            return null;
        }
    }

    static async resizeToFit(
        uri: string,
        maxWidth: number,
        maxHeight: number,
        options?: ImageSaveOptions
    ): Promise<ImageManipulationResult | null> {
        try {
            const dimensions = ImageUtils.fitToSize(maxWidth, maxHeight, maxWidth, maxHeight);
            return ImageTransformService.resize(uri, dimensions.width, dimensions.height, options);
        } catch {
            return null;
        }
    }

    static async cropToSquare(
        uri: string,
        width: number,
        height: number,
        options?: ImageSaveOptions
    ): Promise<ImageManipulationResult | null> {
        try {
            const cropArea = ImageUtils.getSquareCrop(width, height);
            return ImageTransformService.crop(uri, cropArea, options);
        } catch {
            return null;
        }
    }
}
