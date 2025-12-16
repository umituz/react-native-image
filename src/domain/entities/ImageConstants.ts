/**
 * Image Constants
 */
import { SaveFormat } from "./ImageTypes";

export const IMAGE_CONSTANTS = {
    MAX_WIDTH: 2048,
    MAX_HEIGHT: 2048,
    DEFAULT_QUALITY: 0.8,
    THUMBNAIL_SIZE: 200,
    COMPRESS_QUALITY: {
        LOW: 0.5,
        MEDIUM: 0.7,
        HIGH: 0.9,
    },
    FORMAT: {
        JPEG: 'jpeg' as SaveFormat,
        PNG: 'png' as SaveFormat,
        WEBP: 'webp' as SaveFormat,
    },
} as const;
