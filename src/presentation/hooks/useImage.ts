/**
 * Image Domain - useImage Hook
 *
 * React hook for image manipulation operations.
 * Provides image resizing, cropping, rotating, and format conversion.
 */

import { useState, useCallback } from 'react';
import { ImageService } from '../../infrastructure/services/ImageService';
import type {
  ImageManipulateAction,
  ImageSaveOptions,
  ImageManipulationResult,
  SaveFormat,
} from '../../domain/entities/Image';

/**
 * useImage hook for image manipulation
 *
 * USAGE:
 * ```typescript
 * const { resize, crop, rotate, compress, isProcessing } = useImage();
 *
 * // Resize image
 * const resized = await resize(imageUri, 800, 600);
 *
 * // Crop image
 * const cropped = await crop(imageUri, { originX: 0, originY: 0, width: 500, height: 500 });
 *
 * // Compress image
 * const compressed = await compress(imageUri, 0.7);
 * ```
 */
export const useImage = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Resize image
   */
  const resize = useCallback(
    async (
      uri: string,
      width?: number,
      height?: number,
      options?: ImageSaveOptions
    ): Promise<ImageManipulationResult | null> => {
      setIsProcessing(true);
      setError(null);

      try {
        const result = await ImageService.resize(uri, width, height, options);

        if (!result) {
          setError('Failed to resize image');
        }

        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to resize image';
        setError(errorMessage);
        return null;
      } finally {
        setIsProcessing(false);
      }
    },
    []
  );

  /**
   * Crop image
   */
  const crop = useCallback(
    async (
      uri: string,
      cropArea: { originX: number; originY: number; width: number; height: number },
      options?: ImageSaveOptions
    ): Promise<ImageManipulationResult | null> => {
      setIsProcessing(true);
      setError(null);

      try {
        const result = await ImageService.crop(uri, cropArea, options);

        if (!result) {
          setError('Failed to crop image');
        }

        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to crop image';
        setError(errorMessage);
        return null;
      } finally {
        setIsProcessing(false);
      }
    },
    []
  );

  /**
   * Rotate image
   */
  const rotate = useCallback(
    async (
      uri: string,
      degrees: number,
      options?: ImageSaveOptions
    ): Promise<ImageManipulationResult | null> => {
      setIsProcessing(true);
      setError(null);

      try {
        const result = await ImageService.rotate(uri, degrees, options);

        if (!result) {
          setError('Failed to rotate image');
        }

        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to rotate image';
        setError(errorMessage);
        return null;
      } finally {
        setIsProcessing(false);
      }
    },
    []
  );

  /**
   * Flip image
   */
  const flip = useCallback(
    async (
      uri: string,
      flipOptions: { horizontal?: boolean; vertical?: boolean },
      saveOptions?: ImageSaveOptions
    ): Promise<ImageManipulationResult | null> => {
      setIsProcessing(true);
      setError(null);

      try {
        const result = await ImageService.flip(uri, flipOptions, saveOptions);

        if (!result) {
          setError('Failed to flip image');
        }

        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to flip image';
        setError(errorMessage);
        return null;
      } finally {
        setIsProcessing(false);
      }
    },
    []
  );

  /**
   * Perform multiple manipulations
   */
  const manipulate = useCallback(
    async (
      uri: string,
      action: ImageManipulateAction,
      options?: ImageSaveOptions
    ): Promise<ImageManipulationResult | null> => {
      setIsProcessing(true);
      setError(null);

      try {
        const result = await ImageService.manipulate(uri, action, options);

        if (!result) {
          setError('Failed to manipulate image');
        }

        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to manipulate image';
        setError(errorMessage);
        return null;
      } finally {
        setIsProcessing(false);
      }
    },
    []
  );

  /**
   * Compress image
   */
  const compress = useCallback(
    async (uri: string, quality: number = 0.8): Promise<ImageManipulationResult | null> => {
      setIsProcessing(true);
      setError(null);

      try {
        const result = await ImageService.compress(uri, quality);

        if (!result) {
          setError('Failed to compress image');
        }

        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to compress image';
        setError(errorMessage);
        return null;
      } finally {
        setIsProcessing(false);
      }
    },
    []
  );

  /**
   * Resize to fit within max dimensions
   */
  const resizeToFit = useCallback(
    async (
      uri: string,
      maxWidth: number,
      maxHeight: number,
      options?: ImageSaveOptions
    ): Promise<ImageManipulationResult | null> => {
      setIsProcessing(true);
      setError(null);

      try {
        const result = await ImageService.resizeToFit(uri, maxWidth, maxHeight, options);

        if (!result) {
          setError('Failed to resize image to fit');
        }

        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to resize image to fit';
        setError(errorMessage);
        return null;
      } finally {
        setIsProcessing(false);
      }
    },
    []
  );

  /**
   * Create thumbnail
   */
  const createThumbnail = useCallback(
    async (
      uri: string,
      size: number = 200,
      options?: ImageSaveOptions
    ): Promise<ImageManipulationResult | null> => {
      setIsProcessing(true);
      setError(null);

      try {
        const result = await ImageService.createThumbnail(uri, size, options);

        if (!result) {
          setError('Failed to create thumbnail');
        }

        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to create thumbnail';
        setError(errorMessage);
        return null;
      } finally {
        setIsProcessing(false);
      }
    },
    []
  );

  /**
   * Crop to square
   */
  const cropToSquare = useCallback(
    async (
      uri: string,
      width: number,
      height: number,
      options?: ImageSaveOptions
    ): Promise<ImageManipulationResult | null> => {
      setIsProcessing(true);
      setError(null);

      try {
        const result = await ImageService.cropToSquare(uri, width, height, options);

        if (!result) {
          setError('Failed to crop to square');
        }

        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to crop to square';
        setError(errorMessage);
        return null;
      } finally {
        setIsProcessing(false);
      }
    },
    []
  );

  /**
   * Convert image format
   */
  const convertFormat = useCallback(
    async (
      uri: string,
      format: SaveFormat,
      quality?: number
    ): Promise<ImageManipulationResult | null> => {
      setIsProcessing(true);
      setError(null);

      try {
        const result = await ImageService.convertFormat(uri, format, quality);

        if (!result) {
          setError('Failed to convert image format');
        }

        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to convert image format';
        setError(errorMessage);
        return null;
      } finally {
        setIsProcessing(false);
      }
    },
    []
  );

  /**
   * Save image to device
   */
  const saveImage = useCallback(
    async (uri: string, filename?: string): Promise<string | null> => {
      setIsProcessing(true);
      setError(null);

      try {
        const savedUri = await ImageService.saveImage(uri, filename);

        if (!savedUri) {
          setError('Failed to save image');
        }

        return savedUri;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to save image';
        setError(errorMessage);
        return null;
      } finally {
        setIsProcessing(false);
      }
    },
    []
  );

  return {
    // Functions
    resize,
    crop,
    rotate,
    flip,
    manipulate,
    compress,
    resizeToFit,
    createThumbnail,
    cropToSquare,
    convertFormat,
    saveImage,

    // State
    isProcessing,
    error,
  };
};

