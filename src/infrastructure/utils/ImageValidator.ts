/**
 * Image Infrastructure - Validation Utilities
 */
import { ImageDimensions } from '../../domain/entities/ImageTypes';

export interface ValidationResult {
    isValid: boolean;
    error?: string;
}

export class ImageValidator {
    static validateUri(uri: string): ValidationResult {
        if (!uri || typeof uri !== 'string') {
            return { isValid: false, error: 'URI is required and must be a string' };
        }
        
        if (!uri.startsWith('file://') && 
            !uri.startsWith('content://') && 
            !uri.startsWith('http://') && 
            !uri.startsWith('https://') && 
            !uri.startsWith('data:image/')) {
            return { isValid: false, error: 'Invalid URI format' };
        }
        
        return { isValid: true };
    }

    static validateDimensions(dimensions: Partial<ImageDimensions>): ValidationResult {
        if (dimensions.width !== undefined) {
            if (typeof dimensions.width !== 'number' || dimensions.width <= 0) {
                return { isValid: false, error: 'Width must be a positive number' };
            }
        }
        
        if (dimensions.height !== undefined) {
            if (typeof dimensions.height !== 'number' || dimensions.height <= 0) {
                return { isValid: false, error: 'Height must be a positive number' };
            }
        }
        
        return { isValid: true };
    }

    static validateQuality(quality: number): ValidationResult {
        if (typeof quality !== 'number' || quality < 0 || quality > 1) {
            return { isValid: false, error: 'Quality must be a number between 0 and 1' };
        }
        
        return { isValid: true };
    }

    static validateRotation(degrees: number): ValidationResult {
        if (typeof degrees !== 'number') {
            return { isValid: false, error: 'Degrees must be a number' };
        }
        
        return { isValid: true };
    }
}