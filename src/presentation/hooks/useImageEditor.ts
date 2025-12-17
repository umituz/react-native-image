/**
 * Presentation - Image Editor Hook
 * 
 * NOTE: This hook is deprecated - use useImageTransform instead
 */

import { useState, useCallback } from 'react';
import type { Action } from 'expo-image-manipulator';

interface UseImageEditorOptions {
    onSave?: (uri: string) => void | Promise<void>;
}

export function useImageEditor({ onSave }: UseImageEditorOptions = {}) {
    const [isEditing, setIsEditing] = useState(false);
    const [currentUri, setCurrentUri] = useState<string | null>(null);

    const startEditing = useCallback((uri: string) => {
        setCurrentUri(uri);
        setIsEditing(true);
    }, []);

    const cancelEditing = useCallback(() => {
        setIsEditing(false);
        setCurrentUri(null);
    }, []);

    const saveEdit = useCallback(
        async (actions: Action[]) => {
            if (!currentUri) return;

            try {
                if (onSave) {
                    await onSave(currentUri);
                }

                setIsEditing(false);
                setCurrentUri(null);

                return currentUri;
            } catch (error) {
                throw error;
            }
        },
        [currentUri, onSave]
    );

    return {
        isEditing,
        currentUri,
        startEditing,
        cancelEditing,
        saveEdit,
    };
}
