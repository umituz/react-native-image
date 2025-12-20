/**
 * Presentation - Image Metadata Hook
 */

import { useCallback } from 'react';
import { useImageOperation } from './useImageOperation';
import { ImageMetadataService, type ImageMetadataExtractionOptions } from '../../infrastructure/services/ImageMetadataService';

export const useImageMetadata = () => {
    const { isProcessing, error, execute } = useImageOperation();

    const extractMetadata = useCallback((uri: string, options?: ImageMetadataExtractionOptions) =>
        execute(() => ImageMetadataService.extractMetadata(uri, options), 'Failed to extract metadata'), [execute]);

    const getBasicInfo = useCallback((uri: string) =>
        execute(() => ImageMetadataService.getBasicInfo(uri), 'Failed to get basic info'), [execute]);

    const hasMetadata = useCallback((uri: string) =>
        execute(() => ImageMetadataService.hasMetadata(uri), 'Failed to check metadata'), [execute]);

    return {
        extractMetadata,
        getBasicInfo,
        hasMetadata,
        isExtracting: isProcessing,
        metadataError: error,
    };
};