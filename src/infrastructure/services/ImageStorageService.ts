/**
 * Image Storage Service
 * 
 * Handles saving images to the device filesystem.
 * Wraps @umituz/react-native-filesystem.
 */

import { FileSystemService } from '@umituz/react-native-filesystem';

export class ImageStorageService {
    static async saveImage(
        uri: string,
        filename?: string
    ): Promise<string | null> {
        try {
            const result = await FileSystemService.copyToDocuments(uri, filename);
            return result.success && result.uri ? result.uri : null;
        } catch {
            return null;
        }
    }
}
