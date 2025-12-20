/**
 * Presentation - Editor Tool Hook
 * 
 * Manages individual editor tools and their states
 */

import { useState, useCallback } from 'react';
import { DrawingEngine, type DrawingPath, type DrawingConfig } from '../../infrastructure/utils/DrawingEngine';
import { CropTool, type CropConfig } from '../../infrastructure/utils/CropTool';
import { TextEditor, type TextFormatting } from '../../infrastructure/utils/TextEditor';
import { ShapeRenderer, type ShapeStyle } from '../../infrastructure/utils/ShapeRenderer';

interface ToolState {
    isDrawing: boolean;
    currentPath: DrawingPath;
    startPoint?: { x: number; y: number };
    currentTool: string;
}

interface UseEditorToolsOptions {
    onStateChange?: (state: any) => void;
    canvas?: HTMLCanvasElement | null;
}

export function useEditorTools({ onStateChange, canvas }: UseEditorToolsOptions = {}) {
    const [toolState, setToolState] = useState<ToolState>({
        isDrawing: false,
        currentPath: [],
        currentTool: 'move',
    });

    const [drawingConfig, setDrawingConfig] = useState<DrawingConfig>({
        color: '#000000',
        size: 5,
        opacity: 1,
        style: 'normal',
        smoothing: true,
    });

    const [cropConfig, setCropConfig] = useState<CropConfig>({
        aspectRatio: undefined,
        lockAspectRatio: false,
        showGrid: true,
    });

    const [textFormatting, setTextFormatting] = useState<TextFormatting>({
        fontSize: 16,
        fontFamily: 'Arial',
        fontWeight: 'normal',
        fontStyle: 'normal',
        color: '#000000',
        textAlign: 'left',
        opacity: 1,
    });

    const setTool = useCallback((tool: string) => {
        const newState = { ...toolState, currentTool: tool };
        setToolState(newState);
        onStateChange?.(newState);
    }, [toolState, onStateChange]);

    const startDrawing = useCallback((point: { x: number; y: number }) => {
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const newState = {
            ...toolState,
            isDrawing: true,
            startPoint: point,
            currentPath: [point],
        };
        setToolState(newState);
    }, [toolState, canvas]);

    const draw = useCallback((point: { x: number; y: number }) => {
        if (!toolState.isDrawing || !canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const newPath = [...toolState.currentPath, point];

        setToolState(prev => ({
            ...prev,
            currentPath: newPath,
        }));

        // Real-time drawing feedback
        const tempPath = [...toolState.currentPath, point];
        DrawingEngine.drawStroke(ctx, tempPath, drawingConfig);
    }, [toolState.isDrawing, toolState.currentPath, drawingConfig, canvas]);

    const stopDrawing = useCallback(() => {
        if (!toolState.isDrawing || !canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Finalize the stroke
        DrawingEngine.drawStroke(ctx, toolState.currentPath, drawingConfig);

        const newState = {
            ...toolState,
            isDrawing: false,
            currentPath: [],
            startPoint: undefined,
        };
        setToolState(newState);
        onStateChange?.(newState);
    }, [toolState, drawingConfig, canvas, onStateChange]);

    const drawShape = useCallback((
        type: 'rectangle' | 'circle' | 'line' | 'arrow',
        startPoint: { x: number; y: number },
        endPoint: { x: number; y: number },
        style: ShapeStyle
    ) => {
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        DrawingEngine.drawShape(ctx, type, startPoint, endPoint, style as any);
        onStateChange?.({ toolState, shape: { type, startPoint, endPoint, style } });
    }, [canvas, onStateChange, toolState]);

    const addText = useCallback((
        text: string,
        position: { x: number; y: number },
        formatting?: Partial<TextFormatting>
    ) => {
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const finalFormatting = { ...textFormatting, ...formatting };
        TextEditor.renderText(ctx, text, position, finalFormatting);

        setTextFormatting(finalFormatting);
        onStateChange?.({ toolState, text: { text, position, formatting: finalFormatting } });
    }, [textFormatting, canvas, onStateChange, toolState]);

    const setCropArea = useCallback((cropArea: any) => {
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        CropTool.drawCropOverlay(ctx, cropArea, cropConfig);
        onStateChange?.({ toolState, cropArea });
    }, [cropConfig, canvas, onStateChange, toolState]);

    const clearCanvas = useCallback(() => {
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        onStateChange?.({ toolState, cleared: true });
    }, [canvas, onStateChange, toolState]);

    return {
        // State
        toolState,
        drawingConfig,
        cropConfig,
        textFormatting,

        // Actions
        setTool,
        startDrawing,
        draw,
        stopDrawing,
        drawShape,
        addText,
        setCropArea,
        clearCanvas,

        // Config setters
        setDrawingConfig,
        setCropConfig,
        setTextFormatting,
    };
}