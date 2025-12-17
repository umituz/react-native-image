/**
 * Image Infrastructure - Viewer Service
 *
 * Provides configuration for react-native-image-viewing component
 */

import type {
  ImageViewerItem,
  ImageGalleryOptions,
} from '../../domain/entities/ImageTypes';

export interface ImageViewerConfig {
  images: ImageViewerItem[];
  index?: number;
  visible: boolean;
  onDismiss?: () => void;
  options?: ImageGalleryOptions;
}

export class ImageViewerService {
  static prepareImages(uris: string[]): ImageViewerItem[] {
    return uris.map(uri => ({ uri }));
  }

  static prepareImagesWithMetadata(items: ImageViewerItem[]): ImageViewerItem[] {
    return items.map(item => ({
      uri: item.uri,
      title: item.title,
      description: item.description,
      width: item.width,
      height: item.height,
    }));
  }

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

  static getDefaultOptions(): ImageGalleryOptions {
    return {
      index: 0,
      backgroundColor: '#000000',
      swipeToCloseEnabled: true,
      doubleTapToZoomEnabled: true,
    };
  }
}

