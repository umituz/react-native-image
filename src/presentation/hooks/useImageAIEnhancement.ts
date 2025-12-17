/**
 * Presentation - Image AI Enhancement Hook
 */

import { useCallback } from 'react';
import { useImageOperation } from './useImageOperation';
import { ImageAIEnhancementService, type AutoEnhancementOptions, type EnhancementResult } from '../../infrastructure/services/ImageAIEnhancementService';
import { ImageSpecializedEnhancementService } from '../../infrastructure/services/ImageSpecializedEnhancementService';

export const useImageAIEnhancement = () => {
    const { isProcessing, error, execute } = useImageOperation();

    const autoEnhance = useCallback((uri: string, options?: AutoEnhancementOptions) =>
        execute(() => ImageAIEnhancementService.autoEnhance(uri, options), 'Failed to auto enhance'), [execute]);

    const enhancePortrait = useCallback((uri: string) =>
        execute(() => ImageSpecializedEnhancementService.enhancePortrait(uri), 'Failed to enhance portrait'), [execute]);

    const enhanceLandscape = useCallback((uri: string) =>
        execute(() => ImageSpecializedEnhancementService.enhanceLandscape(uri), 'Failed to enhance landscape'), [execute]);

    const analyzeImage = useCallback((uri: string) =>
        execute(() => ImageAIEnhancementService.analyzeImage(uri), 'Failed to analyze image'), [execute]);

    return {
        autoEnhance,
        enhancePortrait,
        enhanceLandscape,
        analyzeImage,
        isEnhancing: isProcessing,
        enhancementError: error,
    };
};