/**
 * Presentation - Image Hook
 * 
 * Aggregator hook combining transformation and conversion capabilities
 */

import { useImageTransform } from './useImageTransform';
import { useImageConversion } from './useImageConversion';
import { useImageFilter } from './useImageFilter';
import { useImageBatch } from './useImageBatch';
import { useImageAIEnhancement } from './useImageAIEnhancement';
import { useImageAnnotation } from './useImageAnnotation';
import { useImageMetadata } from './useImageMetadata';

export const useImage = () => {
  const transform = useImageTransform();
  const conversion = useImageConversion();
  const filter = useImageFilter();
  const batch = useImageBatch();
  const aiEnhancement = useImageAIEnhancement();
  const annotation = useImageAnnotation();
  const metadata = useImageMetadata();

  return {
    // Basic operations
    ...transform,
    ...conversion,
    // Advanced operations
    ...filter,
    ...batch,
    ...aiEnhancement,
    ...annotation,
    ...metadata,
    // Combined state
    isProcessing: 
      transform.isTransforming || 
      conversion.isConverting || 
      filter.isFiltering || 
      batch.isBatchProcessing || 
      aiEnhancement.isEnhancing || 
      annotation.isAnnotating || 
      metadata.isExtracting,
    error: 
      transform.transformError || 
      conversion.conversionError || 
      filter.filterError || 
      batch.batchError || 
      aiEnhancement.enhancementError || 
      annotation.annotationError || 
      metadata.metadataError,
  };
};
