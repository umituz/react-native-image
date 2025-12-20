/**
 * Presentation - Image Operation Hook
 * 
 * Generic state management for async image operations
 */

import { useState, useCallback } from 'react';
import { ImageError } from '../../infrastructure/utils/ImageErrorHandler';

export const useImageOperation = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const execute = useCallback(async <T>(
        operation: () => Promise<T>,
        errorMessage: string
    ): Promise<T | null> => {
        setIsProcessing(true);
        setError(null);
        
        try {
            const result = await operation();
            return result;
        } catch (err) {
            if (err instanceof ImageError) {
                setError(err.message);
            } else {
                setError(err instanceof Error ? err.message : errorMessage);
            }
            return null;
        } finally {
            setIsProcessing(false);
        }
    }, []);

    return { isProcessing, error, execute };
};
