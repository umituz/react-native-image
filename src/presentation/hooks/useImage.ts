/**
 * Presentation - Image Hook
 * 
 * Aggregator hook combining transformation and conversion capabilities
 */

import { useImageTransform } from './useImageTransform';
import { useImageConversion } from './useImageConversion';
import { useImageBatch } from './useImageBatch';
import { useImageEnhance } from './useImageEnhance';
import { useImageMetadata } from './useImageMetadata';

export const useImage = () => {
  const transform = useImageTransform();
  const conversion = useImageConversion();
  const batch = useImageBatch();
  const enhance = useImageEnhance();
  const metadata = useImageMetadata();

  return {
    ...transform,
    ...conversion,
    ...batch,
    ...enhance,
    ...metadata,
    isProcessing:
      transform.isTransforming ||
      conversion.isConverting ||
      batch.isBatchProcessing ||
      enhance.isEnhancing ||
      metadata.isExtracting,
    error:
      transform.transformError ||
      conversion.conversionError ||
      batch.batchError ||
      enhance.enhancementError ||
      metadata.metadataError,
  };
};
