/**
 * Presentation - Image Hook
 * 
 * Aggregator hook combining transformation and conversion capabilities
 */

import { useImageTransform } from './useImageTransform';
import { useImageConversion } from './useImageConversion';
import { useImageBatch } from './useImageBatch';
import { useImageAIEnhancement } from './useImageAIEnhancement';
import { useImageMetadata } from './useImageMetadata';

export const useImage = () => {
  const transform = useImageTransform();
  const conversion = useImageConversion();
  const batch = useImageBatch();
  const aiEnhancement = useImageAIEnhancement();
  const metadata = useImageMetadata();

  return {
    // Basic operations
    ...transform,
    ...conversion,
    // Advanced operations
    ...batch,
    ...aiEnhancement,
    ...metadata,
    // Combined state
    isProcessing:
      transform.isTransforming ||
      conversion.isConverting ||
      batch.isBatchProcessing ||
      aiEnhancement.isEnhancing ||
      metadata.isExtracting,
    error:
      transform.transformError ||
      conversion.conversionError ||
      batch.batchError ||
      aiEnhancement.enhancementError ||
      metadata.metadataError,
  };
};
