/**
 * Image Infrastructure - Metadata Service
 * 
 * Extracts and manages image metadata including EXIF data
 */

import type { ImageMetadataExtended } from '../../domain/entities/ImageFilterTypes';
import { ImageValidator } from '../utils/ImageValidator';
import { ImageErrorHandler, IMAGE_ERROR_CODES } from '../utils/ImageErrorHandler';

export interface ImageMetadataExtractionOptions {
  includeExif?: boolean;
  includeGPS?: boolean;
  includeCamera?: boolean;
}

export class ImageMetadataService {
  private static async getImageDimensions(uri: string): Promise<{ width: number; height: number }> {
    try {
      // In a real implementation, we would use:
      // - expo-image-manipulator for basic dimensions
      // - react-native-image-picker for metadata
      // - react-native-exif-reader for EXIF data
      
      // Mock implementation
      return {
        width: Math.floor(Math.random() * 2000) + 100,
        height: Math.floor(Math.random() * 2000) + 100,
      };
    } catch (error) {
      throw ImageErrorHandler.handleUnknownError(error, 'getDimensions');
    }
  }

  private static async getFileSize(uri: string): Promise<number> {
    try {
      // In real implementation, use expo-file-system or similar
      return Math.floor(Math.random() * 5000000) + 10000; // Random size between 10KB-5MB
    } catch (error) {
      throw ImageErrorHandler.handleUnknownError(error, 'getFileSize');
    }
  }

  private static async extractExifData(uri: string): Promise<any> {
    try {
      // Mock EXIF data extraction
      return {
        DateTimeOriginal: new Date().toISOString(),
        Make: 'Mock Camera',
        Model: 'Mock Phone',
        ISO: Math.floor(Math.random() * 1600) + 100,
        FocalLength: Math.random() * 50 + 10,
        Flash: Math.random() > 0.5,
        ExposureTime: `1/${Math.floor(Math.random() * 1000) + 100}`,
        FNumber: Math.random() * 8 + 1.4,
      };
    } catch (error) {
      return null;
    }
  }

  private static async extractGPSData(uri: string): Promise<{ latitude: number; longitude: number } | null> {
    try {
      // Mock GPS data extraction
      return Math.random() > 0.7 ? {
        latitude: Math.random() * 180 - 90,
        longitude: Math.random() * 360 - 180,
      } : null;
    } catch (error) {
      return null;
    }
  }

  private static detectFormat(uri: string): string {
    const extension = uri.toLowerCase().split('.').pop();
    switch (extension) {
      case 'jpg':
      case 'jpeg':
        return 'JPEG';
      case 'png':
        return 'PNG';
      case 'webp':
        return 'WebP';
      case 'gif':
        return 'GIF';
      default:
        return 'Unknown';
    }
  }

  static async extractMetadata(
    uri: string,
    options: ImageMetadataExtractionOptions = {}
  ): Promise<ImageMetadataExtended> {
    try {
      const uriValidation = ImageValidator.validateUri(uri);
      if (!uriValidation.isValid) {
        throw ImageErrorHandler.createError(uriValidation.error!, IMAGE_ERROR_CODES.INVALID_URI, 'extractMetadata');
      }

      const {
        includeExif = true,
        includeGPS = true,
        includeCamera = true,
      } = options;

      // Get basic image info
      const dimensions = await ImageMetadataService.getImageDimensions(uri);
      const size = await ImageMetadataService.getFileSize(uri);
      const format = ImageMetadataService.detectFormat(uri);

      // Build metadata object
      const metadata: ImageMetadataExtended = {
        format,
        size,
        dimensions,
        colorSpace: 'sRGB', // Default assumption
        hasAlpha: format === 'PNG' || format === 'WebP',
        orientation: 1,
      };

      // Extract EXIF data if requested
      if (includeExif) {
        const exifData = await ImageMetadataService.extractExifData(uri);
        if (exifData) {
          metadata.creationDate = exifData.DateTimeOriginal ? new Date(exifData.DateTimeOriginal) : undefined;
          metadata.modificationDate = new Date();

          if (includeCamera) {
            metadata.camera = {
              make: exifData.Make,
              model: exifData.Model,
              iso: exifData.ISO,
              flash: exifData.Flash,
              focalLength: exifData.FocalLength,
            };
          }
        }
      }

      // Extract GPS data if requested
      if (includeGPS) {
        const gps = await ImageMetadataService.extractGPSData(uri);
        metadata.gps = gps || undefined;
      }

      return metadata;
    } catch (error) {
      throw ImageErrorHandler.handleUnknownError(error, 'extractMetadata');
    }
  }

  static async getBasicInfo(uri: string): Promise<{
    format: string;
    size: number;
    dimensions: { width: number; height: number };
  }> {
    try {
      const uriValidation = ImageValidator.validateUri(uri);
      if (!uriValidation.isValid) {
        throw ImageErrorHandler.createError(uriValidation.error!, IMAGE_ERROR_CODES.INVALID_URI, 'getBasicInfo');
      }

      const dimensions = await ImageMetadataService.getImageDimensions(uri);
      const size = await ImageMetadataService.getFileSize(uri);
      const format = ImageMetadataService.detectFormat(uri);

      return {
        format,
        size,
        dimensions,
      };
    } catch (error) {
      throw ImageErrorHandler.handleUnknownError(error, 'getBasicInfo');
    }
  }

  static async hasMetadata(uri: string): Promise<boolean> {
    try {
      const exifData = await ImageMetadataService.extractExifData(uri);
      const gpsData = await ImageMetadataService.extractGPSData(uri);
      return !!(exifData || gpsData);
    } catch {
      return false;
    }
  }
}