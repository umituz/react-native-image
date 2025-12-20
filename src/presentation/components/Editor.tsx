/**
 * Presentation - Editor Component
 * 
 * Main image editor interface
 */

import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Alert, Text, TouchableOpacity } from 'react-native';
import { EditorCanvas } from './EditorCanvas';
import { EditorToolbar } from './EditorToolbar';
import { EditorPanel } from './EditorPanel';
import { useImageEditor } from '../hooks/useImageEditor';
import { EditorTool, EditorExportOptions } from '../../domain/entities/EditorTypes';
import type { ImageManipulationResult } from '../../domain/entities/ImageTypes';

interface EditorProps {
    imageUri: string;
    width?: number;
    height?: number;
    onSave?: (result: ImageManipulationResult) => void | Promise<void>;
    onCancel?: () => void;
    backgroundColor?: string;
    toolbarBackgroundColor?: string;
    panelBackgroundColor?: string;
    exportOptions?: EditorExportOptions;
}

export function Editor({
    imageUri,
    width = 800,
    height = 600,
    onSave,
    onCancel,
    backgroundColor = '#ffffff',
    toolbarBackgroundColor = '#f8f9fa',
    panelBackgroundColor = '#f8f9fa',
    exportOptions,
}: EditorProps) {
    const [selectedTool, setSelectedTool] = useState<EditorTool>(EditorTool.MOVE);
    const [toolConfig, setToolConfig] = useState<any>({});
    const [canvas, setCanvas] = useState<any>(null);

    const {
        editorState,
        isProcessing,
        error,
        canUndo,
        canRedo,
        initializeEditor,
        setTool,
        addLayer,
        removeLayer,
        undo,
        redo,
        exportImage,
        cancel,
    } = useImageEditor({
        onSave,
        onCancel,
    });

    const handleCanvasReady = useCallback((canvasElement: any) => {
        setCanvas(canvasElement);
        if (imageUri && !editorState) {
            initializeEditor(imageUri);
        }
    }, [imageUri, editorState, initializeEditor]);

    const handleToolSelect = useCallback((tool: EditorTool) => {
        setSelectedTool(tool);
        setTool(tool);
        setToolConfig({});
    }, [setTool]);

    const handleToolConfigChange = useCallback((config: any) => {
        setToolConfig(config);
    }, []);

    const handleSave = useCallback(async () => {
        if (isProcessing) return;

        try {
            await exportImage(exportOptions);
        } catch (err) {
            Alert.alert('Error', 'Failed to save image');
        }
    }, [isProcessing, exportImage, exportImage]);

    const handleCancel = useCallback(() => {
        cancel();
    }, [cancel]);

    const handleUndo = useCallback(() => {
        undo();
    }, [undo]);

    const handleRedo = useCallback(() => {
        redo();
    }, [redo]);

    return (
        <View style={[styles.container, { backgroundColor }]}>
            {/* Toolbar */}
            <EditorToolbar
                selectedTool={selectedTool}
                onToolSelect={handleToolSelect}
                backgroundColor={toolbarBackgroundColor}
            />

            {/* Main Editor Area */}
            <View style={styles.editorArea}>
                <EditorCanvas
                    width={width}
                    height={height}
                    onCanvasReady={handleCanvasReady}
                    onToolChange={handleToolSelect}
                    onStateChange={handleToolConfigChange}
                    backgroundColor={backgroundColor}
                />

                {/* Error Display */}
                {error && (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                )}
            </View>

            {/* Configuration Panel */}
            {(selectedTool === EditorTool.BRUSH ||
                selectedTool === EditorTool.ERASER ||
                selectedTool === EditorTool.TEXT ||
                selectedTool === EditorTool.CROP) && (
                    <EditorPanel
                        selectedTool={selectedTool}
                        onToolConfigChange={handleToolConfigChange}
                        backgroundColor={panelBackgroundColor}
                    />
                )}

            {/* Action Buttons */}
            <View style={styles.actionBar}>
                <View style={styles.undoRedoContainer}>
                    <TouchableOpacity
                        style={[styles.actionButton, !canUndo && styles.disabledButton]}
                        onPress={handleUndo}
                        disabled={!canUndo || isProcessing}
                    >
                        <Text style={styles.actionButtonText}>↶</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionButton, !canRedo && styles.disabledButton]}
                        onPress={handleRedo}
                        disabled={!canRedo || isProcessing}
                    >
                        <Text style={styles.actionButtonText}>↷</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.saveCancelContainer}>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.cancelButton]}
                        onPress={handleCancel}
                        disabled={isProcessing}
                    >
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionButton, styles.saveButton, isProcessing && styles.processingButton]}
                        onPress={handleSave}
                        disabled={isProcessing}
                    >
                        <Text style={styles.saveButtonText}>
                            {isProcessing ? 'Saving...' : 'Save'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    editorArea: {
        flex: 1,
        position: 'relative',
    },
    errorContainer: {
        position: 'absolute',
        top: 16,
        left: 16,
        right: 16,
        backgroundColor: '#ff4444',
        padding: 12,
        borderRadius: 8,
    },
    errorText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '500',
    },
    actionBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        backgroundColor: '#f8f9fa',
    },
    undoRedoContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    saveCancelContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#d0d0d0',
        backgroundColor: '#ffffff',
    },
    disabledButton: {
        opacity: 0.5,
    },
    cancelButton: {
        borderColor: '#6c757d',
    },
    saveButton: {
        backgroundColor: '#28a745',
        borderColor: '#28a745',
    },
    processingButton: {
        opacity: 0.7,
    },
    actionButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333333',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#6c757d',
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
    },
});