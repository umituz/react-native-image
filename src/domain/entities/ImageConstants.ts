/**
 * Image Domain - Configuration Constants
 */
import { SaveFormat } from "./ImageTypes";

export interface ImageConfiguration {
    readonly maxWidth: number;
    readonly maxHeight: number;
    readonly defaultQuality: number;
    readonly thumbnailSize: number;
    readonly compressQuality: {
        readonly low: number;
        readonly medium: number;
        readonly high: number;
    };
    readonly format: {
        readonly jpeg: SaveFormat;
        readonly png: SaveFormat;
        readonly webp: SaveFormat;
    };
}

export const IMAGE_CONSTANTS: ImageConfiguration = {
    maxWidth: 2048,
    maxHeight: 2048,
    defaultQuality: 0.8,
    thumbnailSize: 200,
    compressQuality: {
        low: 0.5,
        medium: 0.7,
        high: 0.9,
    },
    format: {
        jpeg: 'jpeg' as SaveFormat,
        png: 'png' as SaveFormat,
        webp: 'webp' as SaveFormat,
    },
};
