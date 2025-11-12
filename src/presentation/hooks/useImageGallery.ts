/**
 * Image Domain - useImageGallery Hook
 *
 * React hook for image gallery and viewer using react-native-image-viewing.
 * Provides full-screen image viewer with zoom, swipe, and gallery features.
 */

import { useState, useCallback, useMemo } from 'react';
import { ImageViewerService } from '../../infrastructure/services/ImageViewerService';
import type {
  ImageViewerItem,
  ImageGalleryOptions,
} from '../../domain/entities/Image';

/**
 * useImageGallery hook return type
 */
export interface UseImageGalleryReturn {
  // State
  visible: boolean;
  currentIndex: number;
  images: ImageViewerItem[];

  // Actions
  open: (images: ImageViewerItem[] | string[], startIndex?: number, options?: ImageGalleryOptions) => void;
  close: () => void;
  setIndex: (index: number) => void;

  // Gallery options
  options: ImageGalleryOptions;
}

/**
 * useImageGallery hook for full-screen image viewer
 *
 * USAGE:
 * ```typescript
 * const { visible, currentIndex, images, open, close, options } = useImageGallery();
 *
 * // Open gallery with image URIs
 * open(['uri1', 'uri2', 'uri3']);
 *
 * // Open gallery with metadata
 * open([
 *   { uri: 'uri1', title: 'Photo 1' },
 *   { uri: 'uri2', title: 'Photo 2' },
 * ], 0, { backgroundColor: '#000000' });
 *
 * // Render ImageViewing component
 * <ImageViewing
 *   images={images}
 *   imageIndex={currentIndex}
 *   visible={visible}
 *   onRequestClose={close}
 *   onIndexChange={setIndex}
 *   {...options}
 * />
 * ```
 */
export const useImageGallery = (
  defaultOptions?: ImageGalleryOptions
): UseImageGalleryReturn => {
  const [visible, setVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState<ImageViewerItem[]>([]);
  const [galleryOptions, setGalleryOptions] = useState<ImageGalleryOptions>(
    defaultOptions || ImageViewerService.getDefaultOptions()
  );

  /**
   * Open gallery with images
   */
  const open = useCallback(
    (
      imageData: ImageViewerItem[] | string[],
      startIndex: number = 0,
      options?: ImageGalleryOptions
    ) => {
      // Prepare images based on input type
      const preparedImages =
        typeof imageData[0] === 'string'
          ? ImageViewerService.prepareImages(imageData as string[])
          : ImageViewerService.prepareImagesWithMetadata(imageData as ImageViewerItem[]);

      setImages(preparedImages);
      setCurrentIndex(options?.index ?? startIndex);

      // Merge options with defaults
      if (options) {
        setGalleryOptions({
          ...galleryOptions,
          ...options,
        });
      }

      setVisible(true);
    },
    [galleryOptions]
  );

  /**
   * Close gallery
   */
  const close = useCallback(() => {
    setVisible(false);

    // Call onDismiss if provided
    if (galleryOptions.onDismiss) {
      galleryOptions.onDismiss();
    }
  }, [galleryOptions]);

  /**
   * Set current image index
   */
  const setIndex = useCallback((index: number) => {
    setCurrentIndex(index);

    // Call onIndexChange if provided
    if (galleryOptions.onIndexChange) {
      galleryOptions.onIndexChange(index);
    }
  }, [galleryOptions]);

  /**
   * Memoized options for ImageViewing component
   */
  const options = useMemo(() => ({
    backgroundColor: galleryOptions.backgroundColor || '#000000',
    swipeToCloseEnabled: galleryOptions.swipeToCloseEnabled ?? true,
    doubleTapToZoomEnabled: galleryOptions.doubleTapToZoomEnabled ?? true,
  }), [galleryOptions]);

  return {
    // State
    visible,
    currentIndex,
    images,

    // Actions
    open,
    close,
    setIndex,

    // Gallery options
    options,
  };
};

