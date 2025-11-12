/**
 * @umituz/react-native-image - Public API
 *
 * Image manipulation and viewing for React Native apps
 * Resize, crop, rotate, flip, compress, gallery viewer
 *
 * Usage:
 *   import { useImage, useImageGallery, ImageService, ImageUtils } from '@umituz/react-native-image';
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
} from './domain/entities/Image';

export {
  ImageFormat,
  ImageOrientation,
  IMAGE_CONSTANTS,
  ImageUtils,
} from './domain/entities/Image';

// =============================================================================
// INFRASTRUCTURE LAYER - Services
// =============================================================================

export { ImageService } from './infrastructure/services/ImageService';
export {
  ImageViewerService,
  type ImageViewerConfig,
} from './infrastructure/services/ImageViewerService';

// =============================================================================
// PRESENTATION LAYER - Hooks
// =============================================================================

export {
  useImage,
} from './presentation/hooks/useImage';

export {
  useImageGallery,
  type UseImageGalleryReturn,
} from './presentation/hooks/useImageGallery';

