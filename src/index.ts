/**
 * @umituz/react-native-image - Public API
 *
 * Image manipulation and viewing for React Native apps
 * Resize, crop, rotate, flip, compress, gallery viewer
 *
 * Usage:
 *   import { useImage, ImageGallery, ImageService, ImageUtils } from '@umituz/react-native-image';
 */

// =============================================================================
// DOMAIN LAYER - Entities
// =============================================================================

export type {
  ImageManipulateAction,
  ImageSaveOptions,
  ImageManipulationResult,
  ImageMetadata,
  ImageViewerItem,
  ImageGalleryOptions,
  ImageOperationResult,
  SaveFormat,
} from './domain/entities/ImageTypes';

export {
  ImageFormat,
  ImageOrientation,
} from './domain/entities/ImageTypes';

export { IMAGE_CONSTANTS } from './domain/entities/ImageConstants';
export { ImageUtils } from './domain/utils/ImageUtils';

// =============================================================================
// INFRASTRUCTURE LAYER - Services
// =============================================================================

export { ImageTransformService } from './infrastructure/services/ImageTransformService';
export { ImageConversionService } from './infrastructure/services/ImageConversionService';
export { ImageStorageService } from './infrastructure/services/ImageStorageService';
export {
  ImageViewerService,
  type ImageViewerConfig,
} from './infrastructure/services/ImageViewerService';

// =============================================================================
// PRESENTATION LAYER - Components & Hooks
// =============================================================================

export { ImageGallery, type ImageGalleryProps } from './presentation/components/ImageGallery';

export { useImage } from './presentation/hooks/useImage';
export { useImageTransform } from './presentation/hooks/useImageTransform';
export { useImageConversion } from './presentation/hooks/useImageConversion';

export {
  useImageGallery,
  type UseImageGalleryReturn,
} from './presentation/hooks/useImageGallery';


