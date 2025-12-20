/**
 * Presentation - Image Annotation Hook
 */

import { useCallback } from 'react';
import { useImageOperation } from './useImageOperation';
import { ImageAnnotationService, type ImageAnnotation, type TextOverlay, type DrawingElement, type WatermarkOptions } from '../../infrastructure/services/ImageAnnotationService';

export const useImageAnnotation = () => {
    const { isProcessing, error, execute } = useImageOperation();

    const addTextOverlay = useCallback((uri: string, overlay: TextOverlay) =>
        execute(() => ImageAnnotationService.addTextOverlay(uri, overlay), 'Failed to add text'), [execute]);

    const addDrawingElements = useCallback((uri: string, elements: DrawingElement[]) =>
        execute(() => ImageAnnotationService.addDrawingElements(uri, elements), 'Failed to add drawing'), [execute]);

    const addWatermark = useCallback((uri: string, options: WatermarkOptions) =>
        execute(() => ImageAnnotationService.addWatermark(uri, options), 'Failed to add watermark'), [execute]);

    const applyAnnotation = useCallback((uri: string, annotation: ImageAnnotation) =>
        execute(() => ImageAnnotationService.applyAnnotation(uri, annotation), 'Failed to apply annotation'), [execute]);

    return {
        addTextOverlay,
        addDrawingElements,
        addWatermark,
        applyAnnotation,
        isAnnotating: isProcessing,
        annotationError: error,
    };
};