/**
 * Image Infrastructure - Storage Service
 * 
 * Handles saving images to the device filesystem
 */

import { FileSystemService } from '@umituz/react-native-filesystem';
import { ImageValidator } from '../utils/ImageValidator';
import { ImageErrorHandler, IMAGE_ERROR_CODES } from '../utils/ImageErrorHandler';

export class ImageStorageService {
    static async saveImage(
        uri: string,
        filename?: string
    ): Promise<string> {
        try {
            const uriValidation = ImageValidator.validateUri(uri);
            if (!uriValidation.isValid) {
                throw ImageErrorHandler.createError(uriValidation.error!, IMAGE_ERROR_CODES.INVALID_URI, 'saveImage');
            }

            const result = await FileSystemService.copyToDocuments(uri, filename);
            
            if (!result.success || !result.uri) {
                throw ImageErrorHandler.createError(
                    'Failed to save image to filesystem',
                    IMAGE_ERROR_CODES.STORAGE_FAILED,
                    'saveImage'
                );
            }

            return result.uri;
        } catch (error) {
            throw ImageErrorHandler.handleUnknownError(error, 'saveImage');
        }
    }
}
