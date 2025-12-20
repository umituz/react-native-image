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
  ImageDimensions,
  ImageCropArea,
  ImageFlipOptions,
} from './domain/entities/ImageTypes';

export {
  ImageFormat,
  ImageOrientation,
} from './domain/entities/ImageTypes';

export { IMAGE_CONSTANTS } from './domain/entities/ImageConstants';
export { ImageUtils } from './domain/utils/ImageUtils';

// =============================================================================
// DOMAIN LAYER - Filter Types
// =============================================================================

export type {
  ImageFilter,
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
// INFRASTRUCTURE LAYER - Services
// =============================================================================

export { ImageTransformService } from './infrastructure/services/ImageTransformService';
export { ImageAdvancedTransformService } from './infrastructure/services/ImageAdvancedTransformService';
export { ImageConversionService } from './infrastructure/services/ImageConversionService';
export { ImageStorageService } from './infrastructure/services/ImageStorageService';
export {
  ImageViewerService,
  type ImageViewerConfig,
} from './infrastructure/services/ImageViewerService';

// =============================================================================
// INFRASTRUCTURE LAYER - Advanced Services
// =============================================================================

export { ImageFilterService } from './infrastructure/services/ImageFilterService';
export { ImageBatchService, type BatchOperation, type BatchProcessingOptions, type BatchProcessingResult } from './infrastructure/services/ImageBatchService';
export { ImageAIEnhancementService, type AutoEnhancementOptions, type EnhancementResult } from './infrastructure/services/ImageAIEnhancementService';
export { ImageAnnotationService, type ImageAnnotation, type TextOverlay, type DrawingElement, type WatermarkOptions } from './infrastructure/services/ImageAnnotationService';
export { ImageMetadataService, type ImageMetadataExtractionOptions } from './infrastructure/services/ImageMetadataService';
export { ImageQualityPresetService, type QualityPreset, type QualityPresets, IMAGE_QUALITY_PRESETS } from './infrastructure/utils/ImageQualityPresets';
export { ImageSpecializedEnhancementService } from './infrastructure/services/ImageSpecializedEnhancementService';

// =============================================================================
// PRESENTATION LAYER - Components & Hooks
// =============================================================================

export { ImageGallery, type ImageGalleryProps } from './presentation/components/ImageGallery';

// =============================================================================
// PRESENTATION LAYER - Core Hooks
// =============================================================================

export { useImage } from './presentation/hooks/useImage';
export { useImageTransform } from './presentation/hooks/useImageTransform';
export { useImageConversion } from './presentation/hooks/useImageConversion';
// =============================================================================
// PRESENTATION LAYER - Editor Components & Hooks
// =============================================================================

export { useImageEditor } from './presentation/hooks/useImageEditor';
export { useEditorTools } from './presentation/hooks/useEditorTools';
export { Editor } from './presentation/components/Editor';
export { EditorCanvas } from './presentation/components/EditorCanvas';
export { EditorToolbar } from './presentation/components/EditorToolbar';
export { EditorPanel } from './presentation/components/EditorPanel';
export { CropComponent } from './presentation/components/CropComponent';
export { FilterSlider } from './presentation/components/FilterSlider';

export {
  useImageGallery,
  type UseImageGalleryReturn,
} from './presentation/hooks/useImageGallery';

// =============================================================================
// PRESENTATION LAYER - Advanced Hooks
// =============================================================================

export { useImageFilter } from './presentation/hooks/useImageFilter';
export { useImageBatch } from './presentation/hooks/useImageBatch';
export { useImageAIEnhancement } from './presentation/hooks/useImageAIEnhancement';
export { useImageAnnotation } from './presentation/hooks/useImageAnnotation';
export { useImageMetadata } from './presentation/hooks/useImageMetadata';


