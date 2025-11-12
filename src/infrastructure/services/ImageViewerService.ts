/**
 * Image Domain - Image Viewer Service
 *
 * Service for image viewing and gallery using react-native-image-viewing.
 * Provides full-screen image viewer with zoom, swipe, and gallery features.
 */

import type {
  ImageViewerItem,
  ImageGalleryOptions,
} from '../../domain/entities/Image';

/**
 * Image viewer configuration
 */
export interface ImageViewerConfig {
  images: ImageViewerItem[];
  index?: number;
  visible: boolean;
  onDismiss?: () => void;
  options?: ImageGalleryOptions;
}

/**
 * Image viewer service
 *
 * NOTE: This service provides configuration for react-native-image-viewing component.
 * The actual viewer component is rendered in the presentation layer.
 */
export class ImageViewerService {
  /**
   * Prepare images for viewer
   * Converts image URIs to viewer format
   */
  static prepareImages(uris: string[]): ImageViewerItem[] {
    return uris.map(uri => ({
      uri,
    }));
  }

  /**
   * Prepare images with metadata
   */
  static prepareImagesWithMetadata(items: ImageViewerItem[]): ImageViewerItem[] {
    return items.map(item => ({
      uri: item.uri,
      title: item.title,
      description: item.description,
      width: item.width,
      height: item.height,
    }));
  }

  /**
   * Create viewer configuration
   */
  static createViewerConfig(
    images: ImageViewerItem[],
    startIndex: number = 0,
    onDismiss?: () => void,
    options?: ImageGalleryOptions
  ): ImageViewerConfig {
    return {
      images,
      index: options?.index ?? startIndex,
      visible: true,
      onDismiss: onDismiss || options?.onDismiss,
      options: {
        backgroundColor: options?.backgroundColor || '#000000',
        swipeToCloseEnabled: options?.swipeToCloseEnabled ?? true,
        doubleTapToZoomEnabled: options?.doubleTapToZoomEnabled ?? true,
        onIndexChange: options?.onIndexChange,
      },
    };
  }

  /**
   * Get default gallery options
   */
  static getDefaultOptions(): ImageGalleryOptions {
    return {
      index: 0,
      backgroundColor: '#000000',
      swipeToCloseEnabled: true,
      doubleTapToZoomEnabled: true,
    };
  }
}

