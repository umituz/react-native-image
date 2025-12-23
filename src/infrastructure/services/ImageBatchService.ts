/**
 * Image Infrastructure - Batch Processing Service
 * 
 * Handles processing multiple images concurrently with progress tracking
 */

import type { ImageManipulationResult } from '../../domain/entities/ImageTypes';
import { ImageTransformService } from './ImageTransformService';
import { ImageConversionService } from './ImageConversionService';
import { ImageValidator } from '../utils/ImageValidator';
import { ImageErrorHandler, IMAGE_ERROR_CODES } from '../utils/ImageErrorHandler';

export interface BatchProcessingOptions {
  concurrency?: number;
  onProgress?: (completed: number, total: number, currentUri?: string) => void;
  onError?: (error: Error, uri: string) => void;
}

export interface BatchProcessingResult {
  successful: Array<{
    uri: string;
    result: ImageManipulationResult;
  }>;
  failed: Array<{
    uri: string;
    error: Error;
  }>;
  totalProcessed: number;
  successCount: number;
  failureCount: number;
}

export interface BatchOperation {
  uri: string;
  type: 'resize' | 'crop' | 'filter' | 'compress' | 'convert';
  params: any;
  options?: any;
}

export class ImageBatchService {
  private static async processBatchItem(
    operation: BatchOperation,
    options: BatchProcessingOptions = {}
  ): Promise<{ uri: string; result: ImageManipulationResult | null; error?: Error }> {
    try {
      const uriValidation = ImageValidator.validateUri(operation.uri);
      if (!uriValidation.isValid) {
        throw ImageErrorHandler.createError(uriValidation.error!, IMAGE_ERROR_CODES.INVALID_URI, 'batchProcess');
      }

      let result: ImageManipulationResult;

      switch (operation.type) {
        case 'resize':
          result = await ImageTransformService.resize(
            operation.uri,
            operation.params.width,
            operation.params.height,
            operation.options
          );
          break;

        case 'crop':
          result = await ImageTransformService.crop(
            operation.uri,
            operation.params,
            operation.options
          );
          break;

        case 'compress':
          result = await ImageConversionService.compress(
            operation.uri,
            operation.params.quality
          );
          break;

        case 'convert':
          result = await ImageConversionService.convertFormat(
            operation.uri,
            operation.params.format,
            operation.params.quality
          );
          break;

        default:
          throw ImageErrorHandler.createError(
            `Unknown operation type: ${operation.type}`,
            IMAGE_ERROR_CODES.VALIDATION_ERROR,
            'batchProcess'
          );
      }

      return { uri: operation.uri, result };
    } catch (error) {
      return { 
        uri: operation.uri, 
        result: null, 
        error: error instanceof Error ? error : new Error('Unknown error')
      };
    }
  }

  static async processBatch(
    operations: BatchOperation[],
    options: BatchProcessingOptions = {}
  ): Promise<BatchProcessingResult> {
    const concurrency = options.concurrency || 3;
    const successful: Array<{ uri: string; result: ImageManipulationResult }> = [];
    const failed: Array<{ uri: string; error: Error }> = [];

    let completed = 0;
    const total = operations.length;

    // Process operations in chunks based on concurrency
    for (let i = 0; i < operations.length; i += concurrency) {
      const chunk = operations.slice(i, i + concurrency);
      
      const chunkResults = await Promise.all(
        chunk.map(operation => this.processBatchItem(operation, options))
      );

      // Process results
      for (const result of chunkResults) {
        completed++;
        
        options.onProgress?.(completed, total, result.uri);

        if (result.error) {
          failed.push({ uri: result.uri, error: result.error });
          options.onError?.(result.error, result.uri);
        } else if (result.result) {
          successful.push({ uri: result.uri, result: result.result });
        }
      }
    }

    return {
      successful,
      failed,
      totalProcessed: total,
      successCount: successful.length,
      failureCount: failed.length,
    };
  }

  static async resizeBatch(
    uris: string[],
    width?: number,
    height?: number,
    options: BatchProcessingOptions & { saveOptions?: any } = {}
  ): Promise<BatchProcessingResult> {
    const operations: BatchOperation[] = uris.map(uri => ({
      uri,
      type: 'resize' as const,
      params: { width, height },
      options: options.saveOptions,
    }));

    return this.processBatch(operations, options);
  }

  static async compressBatch(
    uris: string[],
    quality: number = 0.8,
    options: BatchProcessingOptions = {}
  ): Promise<BatchProcessingResult> {
    const operations: BatchOperation[] = uris.map(uri => ({
      uri,
      type: 'compress' as const,
      params: { quality },
    }));

    return this.processBatch(operations, options);
  }
}