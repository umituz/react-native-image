/**
 * Image Domain - Core Type Definitions
 */

export enum ImageFormat {
    JPEG = 'jpeg',
    PNG = 'png',
    WEBP = 'webp',
}

export type SaveFormat = 'jpeg' | 'png' | 'webp';

export enum ImageOrientation {
    PORTRAIT = 'portrait',
    LANDSCAPE = 'landscape',
    SQUARE = 'square',
}

export interface ImageDimensions {
    width: number;
    height: number;
}

export interface ImageCropArea {
    originX: number;
    originY: number;
    width: number;
    height: number;
}

export interface ImageFlipOptions {
    vertical?: boolean;
    horizontal?: boolean;
}

export interface ImageManipulateAction {
    resize?: Partial<ImageDimensions>;
    crop?: ImageCropArea;
    rotate?: number;
    flip?: ImageFlipOptions;
}

export interface ImageSaveOptions {
    format?: SaveFormat;
    compress?: number;
    base64?: boolean;
}

export interface ImageManipulationResult {
    uri: string;
    width: number;
    height: number;
    base64?: string;
}

export interface ImageMetadata extends ImageDimensions {
    uri: string;
    format?: ImageFormat;
    size?: number;
    orientation?: ImageOrientation;
}

export interface ImageViewerItem {
    uri: string;
    title?: string;
    description?: string;
    width?: number;
    height?: number;
}

export interface ImageGalleryOptions {
    index?: number;
    backgroundColor?: string;
    swipeToCloseEnabled?: boolean;
    doubleTapToZoomEnabled?: boolean;
    onDismiss?: () => void;
    onIndexChange?: (index: number) => void;
}

export interface ImageOperationResult {
    success: boolean;
    uri?: string;
    error?: string;
    width?: number;
    height?: number;
}
