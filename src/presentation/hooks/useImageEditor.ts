/**
 * useImageEditor Hook
 * Provides image editing functionality with crop, rotate, flip
 */

import { useState, useCallback } from 'react';
import * as ImageManipulator from 'expo-image-manipulator';
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
                const result = await ImageManipulator.manipulateAsync(
                    currentUri,
                    actions,
                    { compress: 0.9, format: ImageManipulator.SaveFormat.JPEG }
                );

                if (onSave) {
                    await onSave(result.uri);
                }

                setIsEditing(false);
                setCurrentUri(null);

                return result.uri;
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
