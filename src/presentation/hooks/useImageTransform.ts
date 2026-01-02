/**
 * Presentation - Image Transform Hook
 */
import { useCallback } from 'react';
import { useImageOperation } from './useImageOperation';
import { ImageTransformService } from '../../infrastructure/services/ImageTransformService';
import type {
    ImageManipulateAction,
    ImageSaveOptions,
    ImageCropArea,
    ImageFlipOptions,
} from '../../domain/entities/ImageTypes';

export const useImageTransform = () => {
    const { isProcessing, error, execute } = useImageOperation();

    const resize = useCallback((uri: string, width?: number, height?: number, options?: ImageSaveOptions) =>
        execute(() => ImageTransformService.resize(uri, width, height, options), 'Failed to resize'), [execute]);

    const crop = useCallback((uri: string, cropArea: ImageCropArea, options?: ImageSaveOptions) =>
        execute(() => ImageTransformService.crop(uri, cropArea, options), 'Failed to crop'), [execute]);

    const rotate = useCallback((uri: string, degrees: number, options?: ImageSaveOptions) =>
        execute(() => ImageTransformService.rotate(uri, degrees, options), 'Failed to rotate'), [execute]);

    const flip = useCallback((uri: string, flipParams: ImageFlipOptions, options?: ImageSaveOptions) =>
        execute(() => ImageTransformService.flip(uri, flipParams, options), 'Failed to flip'), [execute]);

    const manipulate = useCallback((uri: string, action: ImageManipulateAction, options?: ImageSaveOptions) =>
        execute(() => ImageTransformService.manipulate(uri, action, options), 'Failed to manipulate'), [execute]);

    const resizeToFit = useCallback((uri: string, maxWidth: number, maxHeight: number, options?: ImageSaveOptions) =>
        execute(() => ImageTransformService.resizeToFit(uri, maxWidth, maxHeight, options), 'Failed to resize to fit'), [execute]);

    const cropToSquare = useCallback((uri: string, width: number, height: number, options?: ImageSaveOptions) =>
        execute(() => ImageTransformService.cropToSquare(uri, width, height, options), 'Failed to crop square'), [execute]);

    return {
        resize, crop, rotate, flip, manipulate, resizeToFit, cropToSquare,
        isTransforming: isProcessing, transformError: error,
    };
};
