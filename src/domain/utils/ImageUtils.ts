/**
 * Image Domain - Utility Functions
 */
import { ImageFormat, ImageOrientation, ImageDimensions, ImageCropArea } from "../entities/ImageTypes";
import { IMAGE_CONSTANTS } from "../entities/ImageConstants";

export class ImageUtils {
    static getOrientation(width: number, height: number): ImageOrientation {
        if (width > height) return ImageOrientation.LANDSCAPE;
        if (height > width) return ImageOrientation.PORTRAIT;
        return ImageOrientation.SQUARE;
    }

    static getAspectRatio(width: number, height: number): number {
        return width / height;
    }

    static fitToSize(
        width: number,
        height: number,
        maxWidth: number,
        maxHeight: number
    ): ImageDimensions {
        const aspectRatio = ImageUtils.getAspectRatio(width, height);
        let newWidth = width;
        let newHeight = height;

        if (width > maxWidth) {
            newWidth = maxWidth;
            newHeight = newWidth / aspectRatio;
        }

        if (newHeight > maxHeight) {
            newHeight = maxHeight;
            newWidth = newHeight * aspectRatio;
        }

        return {
            width: Math.round(newWidth),
            height: Math.round(newHeight),
        };
    }

    static getThumbnailSize(
        width: number,
        height: number,
        thumbnailSize: number = IMAGE_CONSTANTS.thumbnailSize
    ): ImageDimensions {
        return ImageUtils.fitToSize(width, height, thumbnailSize, thumbnailSize);
    }

    static isValidImageUri(uri: string): boolean {
        if (!uri) return false;
        return (
            uri.startsWith('file://') ||
            uri.startsWith('content://') ||
            uri.startsWith('http://') ||
            uri.startsWith('https://') ||
            uri.startsWith('data:image/')
        );
    }

    static getFormatFromUri(uri: string): ImageFormat | null {
        const lowerUri = uri.toLowerCase();
        if (lowerUri.includes('.jpg') || lowerUri.includes('.jpeg')) return ImageFormat.JPEG;
        if (lowerUri.includes('.png')) return ImageFormat.PNG;
        if (lowerUri.includes('.webp')) return ImageFormat.WEBP;
        return null;
    }

    static getExtensionFromFormat(format: ImageFormat): string {
        switch (format) {
            case ImageFormat.JPEG: return 'jpg';
            case ImageFormat.PNG: return 'png';
            case ImageFormat.WEBP: return 'webp';
            default: return 'jpg';
        }
    }

    static getSquareCrop(width: number, height: number): ImageCropArea {
        const size = Math.min(width, height);
        const originX = (width - size) / 2;
        const originY = (height - size) / 2;

        return {
            originX: Math.round(originX),
            originY: Math.round(originY),
            width: Math.round(size),
            height: Math.round(size),
        };
    }

    static formatFileSize(bytes: number): string {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }

    static needsCompression(bytes: number, maxSizeMB: number = 2): boolean {
        const maxBytes = maxSizeMB * 1024 * 1024;
        return bytes > maxBytes;
    }
}
