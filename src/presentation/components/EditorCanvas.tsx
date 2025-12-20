/**
 * Presentation - Editor Canvas Component
 * 
 * Main canvas component for image editing
 */

import React, { useRef, useEffect, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useEditorTools } from '../hooks/useEditorTools';

import { EditorTool } from '../../domain/entities/EditorTypes';

interface EditorCanvasProps {
    width: number;
    height: number;
    onCanvasReady?: (canvas: HTMLCanvasElement) => void;
    onToolChange?: (tool: EditorTool) => void;
    onStateChange?: (state: any) => void;
    backgroundColor?: string;
}

export function EditorCanvas({
    width,
    height,
    onCanvasReady,
    onToolChange,
    onStateChange,
    backgroundColor = '#ffffff',
}: EditorCanvasProps) {
    const canvasRef = useRef<any>(null);
    const {
        setTool,
        startDrawing,
        draw,
        stopDrawing,
        setCropArea,
    } = useEditorTools({
        onStateChange,
        canvas: canvasRef.current,
    });

    useEffect(() => {
        if (canvasRef.current && onCanvasReady) {
            onCanvasReady(canvasRef.current);
        }
    }, [canvasRef.current, onCanvasReady]);

    const handleTouchStart = useCallback((event: any) => {
        const touch = event.nativeEvent.touches[0];
        const point = { x: touch.pageX, y: touch.pageY };
        setTool(EditorTool.BRUSH);
        startDrawing(point);
        onToolChange?.(EditorTool.BRUSH);
    }, [setTool, startDrawing, onToolChange]);

    const handleTouchMove = useCallback((event: any) => {
        const touch = event.nativeEvent.touches[0];
        const point = { x: touch.pageX, y: touch.pageY };
        draw(point);
    }, [draw]);

    const handleTouchEnd = useCallback(() => {
        stopDrawing();
    }, [stopDrawing]);

    // For React Native Web, we need to handle this differently
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Touch events for mobile
        canvas.addEventListener('touchstart', handleTouchStart);
        canvas.addEventListener('touchmove', handleTouchMove);
        canvas.addEventListener('touchend', handleTouchEnd);

        // Mouse events for desktop
        const handleMouseDown = (e: MouseEvent) => {
            const point = { x: e.offsetX, y: e.offsetY };
            setTool(EditorTool.BRUSH);
            startDrawing(point);
            onToolChange?.(EditorTool.BRUSH);
        };

        const handleMouseMove = (e: MouseEvent) => {
            const point = { x: e.offsetX, y: e.offsetY };
            draw(point);
        };

        const handleMouseUp = () => {
            stopDrawing();
        };

        canvas.addEventListener('mousedown', handleMouseDown);
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseup', handleMouseUp);

        return () => {
            canvas.removeEventListener('touchstart', handleTouchStart);
            canvas.removeEventListener('touchmove', handleTouchMove);
            canvas.removeEventListener('touchend', handleTouchEnd);
            canvas.removeEventListener('mousedown', handleMouseDown);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseup', handleMouseUp);
        };
    }, [setTool, startDrawing, draw, stopDrawing, onToolChange]);

    // For React Native, we'll need to use a different approach
    if (typeof window === 'undefined') {
        return (
            <View style={[styles.container, { width, height, backgroundColor }]} />
        );
    }

    return (
        <View style={[styles.container, { width, height }]}>
            <canvas
                ref={canvasRef}
                width={width}
                height={height}
                style={{
                    width,
                    height,
                    backgroundColor,
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        overflow: 'hidden',
    },
});