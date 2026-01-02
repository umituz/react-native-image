/**
 * Presentation - Image Enhance Hook
 */

import { useCallback } from 'react';
import { useImageOperation } from './useImageOperation';
import { ImageEnhanceService, type AutoEnhancementOptions } from '../../infrastructure/services/ImageEnhanceService';

export const useImageEnhance = () => {
    const { isProcessing, error, execute } = useImageOperation();

    const autoEnhance = useCallback((uri: string, options?: AutoEnhancementOptions) =>
        execute(() => ImageEnhanceService.autoEnhance(uri, options), 'Failed to auto enhance'), [execute]);

    const enhancePortrait = useCallback((uri: string) =>
        execute(() => ImageEnhanceService.enhancePortrait(uri), 'Failed to enhance portrait'), [execute]);

    const enhanceLandscape = useCallback((uri: string) =>
        execute(() => ImageEnhanceService.enhanceLandscape(uri), 'Failed to enhance landscape'), [execute]);

    const analyzeImage = useCallback((uri: string) =>
        execute(() => ImageEnhanceService.analyzeImage(uri), 'Failed to analyze image'), [execute]);

    return {
        autoEnhance,
        enhancePortrait,
        enhanceLandscape,
        analyzeImage,
        isEnhancing: isProcessing,
        enhancementError: error,
    };
};
