/**
 * Presentation - Advanced Image Editor Hook
 */

import { useState, useCallback, useRef } from 'react';
import type {
    EditorState,
    EditorTool,
    EditorOptions,
    EditorExportOptions,
} from '../../domain/entities/EditorTypes';
import { ImageEditorService } from '../../infrastructure/services/ImageEditorService';
import type { ImageManipulationResult } from '../../domain/entities/ImageTypes';

interface UseEditorConfig {
    onSave?: (result: ImageManipulationResult) => void | Promise<void>;
    onCancel?: () => void;
    options?: EditorOptions;
}

export function useImageEditor({ onSave, onCancel, options }: UseEditorConfig = {}) {
    const [editorState, setEditorState] = useState<EditorState | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const initializeEditor = useCallback(async (uri: string) => {
        try {
            setError(null);
            setIsProcessing(true);
            
            // Get image dimensions
            const dimensions = await getImageDimensions(uri);
            const state = ImageEditorService.createInitialState(uri, dimensions, options);
            
            setEditorState(state);
            setIsProcessing(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to initialize editor');
            setIsProcessing(false);
        }
    }, [options]);

    const setTool = useCallback((tool: EditorTool) => {
        if (!editorState) return;
        
        const newState = ImageEditorService.setTool(editorState, tool);
        setEditorState(newState);
    }, [editorState]);

    const addLayer = useCallback((name?: string) => {
        if (!editorState) return;
        
        const newState = ImageEditorService.addLayer(editorState, name);
        setEditorState(newState);
    }, [editorState]);

    const removeLayer = useCallback((layerId: string) => {
        if (!editorState) return;
        
        try {
            const newState = ImageEditorService.removeLayer(editorState, layerId);
            setEditorState(newState);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to remove layer');
        }
    }, [editorState]);

    const undo = useCallback(() => {
        if (!editorState) return;
        
        const newState = ImageEditorService.undo(editorState);
        setEditorState(newState);
    }, [editorState]);

    const redo = useCallback(() => {
        if (!editorState) return;
        
        const newState = ImageEditorService.redo(editorState);
        setEditorState(newState);
    }, [editorState]);

    const exportImage = useCallback(async (exportOptions?: EditorExportOptions) => {
        if (!editorState || !canvasRef.current) return null;
        
        try {
            setIsProcessing(true);
            setError(null);
            
            // Compose all layers
            const canvas = canvasRef.current;
            const result = await composeAndExport(canvas, editorState, exportOptions);
            
            if (onSave) {
                await onSave(result);
            }
            
            setIsProcessing(false);
            return result;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to export image');
            setIsProcessing(false);
            return null;
        }
    }, [editorState, onSave]);

    const cancel = useCallback(() => {
        setEditorState(null);
        setError(null);
        onCancel?.();
    }, [onCancel]);

    return {
        // State
        editorState,
        isProcessing,
        error,
        canUndo: editorState ? ImageEditorService.canUndo(editorState) : false,
        canRedo: editorState ? ImageEditorService.canRedo(editorState) : false,
        
        // Actions
        initializeEditor,
        setTool,
        addLayer,
        removeLayer,
        undo,
        redo,
        exportImage,
        cancel,
        
        // Refs
        canvasRef,
    };
}

async function getImageDimensions(uri: string): Promise<{ width: number; height: number }> {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            resolve({ width: img.width, height: img.height });
        };
        img.src = uri;
    });
}

async function composeAndExport(
    canvas: HTMLCanvasElement,
    state: EditorState,
    options?: EditorExportOptions
): Promise<ImageManipulationResult> {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get canvas context');

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply all layers
    const visibleLayers = ImageEditorService.getVisibleLayers(state);
    
    // Background layer (original image)
    if (visibleLayers.length > 0) {
        const backgroundLayer = visibleLayers[0];
        // Would render original image here
    }

    // Export canvas to blob
    return new Promise((resolve) => {
        canvas.toBlob(async (blob) => {
            if (!blob) throw new Error('Failed to create blob');
            
            const url = URL.createObjectURL(blob);
            resolve({
                uri: url,
                width: canvas.width,
                height: canvas.height,
            });
            
            URL.revokeObjectURL(url);
        }, options?.format || 'jpeg', options?.quality || 0.9);
    });
}
