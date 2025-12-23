/**
 * Presentation - Image Batch Hook
 */

import { useCallback } from 'react';
import { useImageOperation } from './useImageOperation';
import { ImageBatchService, type BatchOperation, type BatchProcessingOptions } from '../../infrastructure/services/ImageBatchService';

export const useImageBatch = () => {
    const { isProcessing, error, execute } = useImageOperation();

    const processBatch = useCallback((operations: BatchOperation[], options?: BatchProcessingOptions) =>
        execute(() => ImageBatchService.processBatch(operations, options), 'Failed to process batch'), [execute]);

    const resizeBatch = useCallback((uris: string[], width?: number, height?: number, options?: BatchProcessingOptions & { saveOptions?: any }) =>
        execute(() => ImageBatchService.resizeBatch(uris, width, height, options), 'Failed to resize batch'), [execute]);

    const compressBatch = useCallback((uris: string[], quality?: number, options?: BatchProcessingOptions) =>
        execute(() => ImageBatchService.compressBatch(uris, quality, options), 'Failed to compress batch'), [execute]);

    return {
        processBatch,
        resizeBatch,
        compressBatch,
        isBatchProcessing: isProcessing,
        batchError: error,
    };
};