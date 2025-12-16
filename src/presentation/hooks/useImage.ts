/**
 * useImage Hook
 * 
 * Aggregator hook that combines transformation and conversion capabilities.
 * Kept simple and modular.
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
