import { useState, useCallback } from 'react';

/**
 * Generic hook to handle image operation states (loading, error)
 * adhering to DRY principles.
 */
export const useImageOperation = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const execute = useCallback(async <T>(
        operation: () => Promise<T | null>,
        errorMessage: string
    ): Promise<T | null> => {
        setIsProcessing(true);
        setError(null);
        try {
            const result = await operation();
            if (!result) {
                setError(errorMessage);
                return null;
            }
            return result;
        } catch (err) {
            setError(err instanceof Error ? err.message : errorMessage);
            return null;
        } finally {
            setIsProcessing(false);
        }
    }, []);

    return { isProcessing, error, execute };
};
