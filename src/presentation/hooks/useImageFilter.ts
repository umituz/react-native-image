/**
 * Presentation - Image Filter Hook
 */

import { useCallback } from 'react';
import { useImageOperation } from './useImageOperation';
import { ImageFilterService } from '../../infrastructure/services/ImageFilterService';
import type {
  ImageFilter,
  ImageColorAdjustment,
  ImageQualityMetrics,
  ImageColorPalette,
} from '../../domain/entities/ImageFilterTypes';

export const useImageFilter = () => {
    const { isProcessing, error, execute } = useImageOperation();

    const applyFilter = useCallback((uri: string, filter: ImageFilter) =>
        execute(() => ImageFilterService.applyFilter(uri, filter), 'Failed to apply filter'), [execute]);

    const applyColorAdjustment = useCallback((uri: string, adjustment: ImageColorAdjustment) =>
        execute(() => ImageFilterService.applyColorAdjustment(uri, adjustment), 'Failed to adjust colors'), [execute]);

    const analyzeQuality = useCallback((uri: string) =>
        execute(() => ImageFilterService.analyzeQuality(uri), 'Failed to analyze quality'), [execute]);

    const extractColorPalette = useCallback((uri: string, colorCount?: number) =>
        execute(() => ImageFilterService.extractColorPalette(uri, colorCount), 'Failed to extract colors'), [execute]);

    return {
        applyFilter,
        applyColorAdjustment,
        analyzeQuality,
        extractColorPalette,
        isFiltering: isProcessing,
        filterError: error,
    };
};