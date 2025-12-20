/**
 * Presentation - Image Gallery Hook
 */

import { useState, useCallback, useMemo } from 'react';
import { ImageViewerService } from '../../infrastructure/services/ImageViewerService';
import type {
  ImageViewerItem,
  ImageGalleryOptions,
} from '../../domain/entities/ImageTypes';

export interface UseImageGalleryReturn {
  visible: boolean;
  currentIndex: number;
  images: ImageViewerItem[];
  open: (images: ImageViewerItem[] | string[], startIndex?: number, options?: ImageGalleryOptions) => void;
  close: () => void;
  setIndex: (index: number) => void;
  options: ImageGalleryOptions;
}

export const useImageGallery = (
  defaultOptions?: ImageGalleryOptions
): UseImageGalleryReturn => {
  const [visible, setVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState<ImageViewerItem[]>([]);
  const [galleryOptions, setGalleryOptions] = useState<ImageGalleryOptions>(
    defaultOptions || ImageViewerService.getDefaultOptions()
  );

  const open = useCallback(
    (
      imageData: ImageViewerItem[] | string[],
      startIndex: number = 0,
      options?: ImageGalleryOptions
    ) => {
      const preparedImages =
        typeof imageData[0] === 'string'
          ? ImageViewerService.prepareImages(imageData as string[])
          : ImageViewerService.prepareImagesWithMetadata(imageData as ImageViewerItem[]);

      setImages(preparedImages);
      setCurrentIndex(options?.index ?? startIndex);

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

  const close = useCallback(() => {
    setVisible(false);

    if (galleryOptions.onDismiss) {
      galleryOptions.onDismiss();
    }
  }, [galleryOptions]);

  const setIndex = useCallback((index: number) => {
    setCurrentIndex(index);

    if (galleryOptions.onIndexChange) {
      galleryOptions.onIndexChange(index);
    }
  }, [galleryOptions]);

  const options = useMemo(() => ({
    backgroundColor: galleryOptions.backgroundColor || '#000000',
    swipeToCloseEnabled: galleryOptions.swipeToCloseEnabled ?? true,
    doubleTapToZoomEnabled: galleryOptions.doubleTapToZoomEnabled ?? true,
  }), [galleryOptions]);

  return {
    visible,
    currentIndex,
    images,
    open,
    close,
    setIndex,
    options,
  };
};

