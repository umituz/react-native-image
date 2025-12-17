/**
 * Image Infrastructure - Error Handler
 */
export class ImageError extends Error {
    constructor(
        message: string,
        public readonly code: string,
        public readonly operation?: string
    ) {
        super(message);
        this.name = 'ImageError';
    }
}

export const IMAGE_ERROR_CODES = {
    INVALID_URI: 'INVALID_URI',
    INVALID_DIMENSIONS: 'INVALID_DIMENSIONS',
    INVALID_QUALITY: 'INVALID_QUALITY',
    MANIPULATION_FAILED: 'MANIPULATION_FAILED',
    CONVERSION_FAILED: 'CONVERSION_FAILED',
    STORAGE_FAILED: 'STORAGE_FAILED',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
} as const;

export type ImageErrorCode = typeof IMAGE_ERROR_CODES[keyof typeof IMAGE_ERROR_CODES];

export class ImageErrorHandler {
    static createError(message: string, code: ImageErrorCode, operation?: string): ImageError {
        return new ImageError(message, code, operation);
    }

    static handleUnknownError(error: unknown, operation?: string): ImageError {
        if (error instanceof ImageError) {
            return error;
        }
        
        const message = error instanceof Error ? error.message : 'Unknown error occurred';
        return new ImageError(message, IMAGE_ERROR_CODES.MANIPULATION_FAILED, operation);
    }
}