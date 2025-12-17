/**
 * Presentation - Image Hook
 * 
 * Aggregator hook combining transformation and conversion capabilities
 */

import { useImageTransform } from './useImageTransform';
import { useImageConversion } from './useImageConversion';

export const useImage = () => {
  const transform = useImageTransform();
  const conversion = useImageConversion();

  return {
    ...transform,
    ...conversion,
    // Combined state
    isProcessing: transform.isTransforming || conversion.isConverting,
    error: transform.transformError || conversion.conversionError,
  };
};
