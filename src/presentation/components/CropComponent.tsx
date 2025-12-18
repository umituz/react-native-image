/**
 * Presentation - Crop Component
 * 
 * Advanced cropping interface with aspect ratios and grid
 */

import React, { useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { CropTool, type CropConfig, type CropArea } from '../../infrastructure/utils/CropTool';

interface CropComponentProps {
    imageWidth: number;
    imageHeight: number;
    onCropChange?: (area: CropArea) => void;
    onCropComplete?: (area: CropArea) => void;
    initialArea?: CropArea;
    config?: CropConfig;
}

export function CropComponent({
    imageWidth,
    imageHeight,
    onCropChange,
    onCropComplete,
    initialArea,
    config = {},
}: CropComponentProps) {
    const [cropArea, setCropArea] = useState<CropArea>(
        initialArea || {
            x: 0,
            y: 0,
            width: imageWidth,
            height: imageHeight,
        }
    );
    const [isDragging, setIsDragging] = useState(false);
    const [dragHandle, setDragHandle] = useState<string | null>(null);

    const presets = CropTool.getPresets();

    const handleCropChange = useCallback((newArea: CropArea) => {
        setCropArea(newArea);
        onCropChange?.(newArea);
    }, [onCropChange]);

    const handlePresetSelect = useCallback((preset: any) => {
        const constrainedArea = CropTool.constrainToAspectRatio(
            cropArea.width,
            cropArea.height,
            preset.aspectRatio
        );

        const centeredArea = {
            ...constrainedArea,
            x: (imageWidth - constrainedArea.width) / 2,
            y: (imageHeight - constrainedArea.height) / 2,
        };

        handleCropChange(centeredArea);
    }, [cropArea, imageWidth, imageHeight, handleCropChange]);

    const handleCenterCrop = useCallback(() => {
        const centerCrop = CropTool.centerCrop(imageWidth, imageHeight);
        handleCropChange(centerCrop);
    }, [imageWidth, imageHeight, handleCropChange]);

    const renderPresets = () => (
        <View style={styles.presetsContainer}>
            <Text style={styles.presetsLabel}>Aspect Ratio</Text>
            <View style={styles.presetButtons}>
                {presets.map((preset) => (
                    <TouchableOpacity
                        key={preset.name}
                        style={[
                            styles.presetButton,
                            config.aspectRatio === preset.aspectRatio && styles.selectedPreset,
                        ]}
                        onPress={() => handlePresetSelect(preset)}
                    >
                        <Text style={[
                            styles.presetText,
                            config.aspectRatio === preset.aspectRatio && styles.presetTextSelected
                        ]}>{preset.name}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );

    const renderActions = () => (
        <View style={styles.actionsContainer}>
            <TouchableOpacity
                style={styles.actionButton}
                onPress={handleCenterCrop}
            >
                <Text style={styles.actionButtonText}>Center Crop</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.actionButton, styles.primaryButton]}
                onPress={() => onCropComplete?.(cropArea)}
            >
                <Text style={styles.primaryButtonText}>Apply Crop</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            {renderPresets()}
            {renderActions()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        gap: 16,
    },
    presetsContainer: {
        gap: 8,
    },
    presetsLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333333',
        marginBottom: 8,
    },
    presetButtons: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    presetButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#d0d0d0',
        backgroundColor: '#ffffff',
    },
    selectedPreset: {
        backgroundColor: '#007bff',
        borderColor: '#007bff',
    },
    presetText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333333',
    },
    presetTextSelected: {
        color: '#ffffff',
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    actionButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#d0d0d0',
        backgroundColor: '#ffffff',
        alignItems: 'center',
    },
    primaryButton: {
        backgroundColor: '#007bff',
        borderColor: '#007bff',
    },
    actionButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333333',
    },
    primaryButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
    },
});