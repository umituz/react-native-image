/**
 * @umituz/react-native-image - Public API
 *
 * React Native image manipulation and viewing
 * Resize, crop, rotate, flip, compress, gallery viewer
 *
 * Usage:
 *   import { useImage, ImageGallery, ImageUtils } from '@umituz/react-native-image';
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
  ImageDimensions,
  ImageCropArea,
  ImageFlipOptions,
} from './domain/entities/ImageTypes';

export type {
  ImageTemplate,
  MemeTemplateOptions,
} from './domain/entities/ImageTemplateTypes';

export {
  ImageFormat,
  ImageOrientation,
} from './domain/entities/ImageTypes';

export { IMAGE_CONSTANTS } from './domain/entities/ImageConstants';
export { ImageUtils } from './domain/utils/ImageUtils';

// =============================================================================
// DOMAIN LAYER - Filter Types (React Native Compatible Only)
// =============================================================================

export type {
  ImageFilterOptions,
  ImageColorAdjustment,
  ImageQualityMetrics,
  ImageColorPalette,
  ImageMetadataExtended,
} from './domain/entities/ImageFilterTypes';

export {
  ImageFilterType,
} from './domain/entities/ImageFilterTypes';

// =============================================================================
// INFRASTRUCTURE LAYER - React Native Compatible Services
// =============================================================================

export { ImageTransformService } from './infrastructure/services/ImageTransformService';
export { ImageAdvancedTransformService } from './infrastructure/services/ImageAdvancedTransformService';
export { ImageConversionService } from './infrastructure/services/ImageConversionService';
export { ImageStorageService } from './infrastructure/services/ImageStorageService';
export {
  ImageViewerService,
  type ImageViewerConfig,
} from './infrastructure/services/ImageViewerService';

export { ImageBatchService, type BatchOperation, type BatchProcessingOptions, type BatchProcessingResult } from './infrastructure/services/ImageBatchService';
export { ImageAIEnhancementService, type AutoEnhancementOptions, type EnhancementResult } from './infrastructure/services/ImageAIEnhancementService';
export { ImageMetadataService, type ImageMetadataExtractionOptions } from './infrastructure/services/ImageMetadataService';
export { ImageQualityPresetService, type QualityPreset, type QualityPresets, IMAGE_QUALITY_PRESETS } from './infrastructure/utils/ImageQualityPresets';
export { ImageSpecializedEnhancementService } from './infrastructure/services/ImageSpecializedEnhancementService';
export { ImageTemplateService } from './infrastructure/services/ImageTemplateService';

// =============================================================================
// PRESENTATION LAYER - React Native Components & Hooks
// =============================================================================

export { ImageGallery, type ImageGalleryProps } from './presentation/components/ImageGallery';

export { useImage } from './presentation/hooks/useImage';
export { useImageTransform } from './presentation/hooks/useImageTransform';
export { useImageConversion } from './presentation/hooks/useImageConversion';

export {
  useImageGallery,
  type UseImageGalleryReturn,
} from './presentation/hooks/useImageGallery';

export { useImageBatch } from './presentation/hooks/useImageBatch';
export { useImageAIEnhancement } from './presentation/hooks/useImageAIEnhancement';
export { useImageMetadata } from './presentation/hooks/useImageMetadata';


