/**
 * Presentation - Image Conversion Hook
 */
import { useCallback } from 'react';
import { useImageOperation } from './useImageOperation';
import { ImageConversionService } from '../../infrastructure/services/ImageConversionService';
import { ImageStorageService } from '../../infrastructure/services/ImageStorageService';
import type { ImageSaveOptions, SaveFormat } from '../../domain/entities/ImageTypes';

export const useImageConversion = () => {
    const { isProcessing, error, execute } = useImageOperation();

    const compress = useCallback((uri: string, quality?: number) =>
        execute(() => ImageConversionService.compress(uri, quality), 'Failed to compress'), [execute]);

    const convertFormat = useCallback((uri: string, format: SaveFormat, quality?: number) =>
        execute(() => ImageConversionService.convertFormat(uri, format, quality), 'Failed to convert format'), [execute]);

    const createThumbnail = useCallback((uri: string, size?: number, options?: ImageSaveOptions) =>
        execute(() => ImageConversionService.createThumbnail(uri, size, options), 'Failed to create thumbnail'), [execute]);

    const saveImage = useCallback((uri: string, filename?: string) =>
        execute(() => ImageStorageService.saveImage(uri, filename), 'Failed to save image'), [execute]);

    return {
        compress, convertFormat, createThumbnail, saveImage,
        isConverting: isProcessing, conversionError: error,
    };
};
