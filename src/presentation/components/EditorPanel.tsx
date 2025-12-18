/**
 * Presentation - Editor Panel Component
 * 
 * Configuration panel for selected tools
 */

import React, { useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Slider from '@react-native-community/slider';
import { EditorTool } from '../../domain/entities/EditorTypes';

interface EditorPanelProps {
    selectedTool: EditorTool;
    onToolConfigChange?: (config: any) => void;
    backgroundColor?: string;
}

export function EditorPanel({ selectedTool, onToolConfigChange, backgroundColor = '#f8f9fa' }: EditorPanelProps) {
    const [brushSize, setBrushSize] = useState(5);
    const [brushOpacity, setBrushOpacity] = useState(1);
    const [brushColor, setBrushColor] = useState('#000000');
    const [brushStyle, setBrushStyle] = useState('normal');

    const [fontSize, setFontSize] = useState(16);
    const [textColor, setTextColor] = useState('#000000');

    const [cropAspectRatio, setCropAspectRatio] = useState(0);
    const [cropGrid, setCropGrid] = useState(true);

    const handleConfigChange = useCallback((config: any) => {
        onToolConfigChange?.(config);
    }, [onToolConfigChange]);

    const renderBrushPanel = () => (
        <View style={styles.panel}>
            <View style={styles.configRow}>
                <Text style={styles.label}>Size</Text>
                <Slider
                    style={styles.slider}
                    minimumValue={1}
                    maximumValue={50}
                    value={brushSize}
                    onValueChange={setBrushSize}
                    onSlidingComplete={() => handleConfigChange({
                        size: brushSize,
                        opacity: brushOpacity,
                        color: brushColor,
                        style: brushStyle
                    })}
                />
                <Text style={styles.value}>{Math.round(brushSize)}</Text>
            </View>

            <View style={styles.configRow}>
                <Text style={styles.label}>Opacity</Text>
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={1}
                    value={brushOpacity}
                    onValueChange={setBrushOpacity}
                    onSlidingComplete={() => handleConfigChange({
                        size: brushSize,
                        opacity: brushOpacity,
                        color: brushColor,
                        style: brushStyle
                    })}
                />
                <Text style={styles.value}>{Math.round(brushOpacity * 100)}%</Text>
            </View>

            <View style={styles.configRow}>
                <Text style={styles.label}>Color</Text>
                <View style={styles.colorRow}>
                    {['#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00'].map(color => (
                        <TouchableOpacity
                            key={color}
                            style={[styles.colorButton, { backgroundColor: color }]}
                            onPress={() => {
                                setBrushColor(color);
                                handleConfigChange({
                                    size: brushSize,
                                    opacity: brushOpacity,
                                    color,
                                    style: brushStyle
                                });
                            }}
                        />
                    ))}
                </View>
            </View>

            <View style={styles.configRow}>
                <Text style={styles.label}>Style</Text>
                <View style={styles.styleRow}>
                    {['normal', 'marker', 'spray'].map(style => (
                        <TouchableOpacity
                            key={style}
                            style={[styles.styleButton, brushStyle === style && styles.selectedStyle]}
                            onPress={() => {
                                setBrushStyle(style);
                                handleConfigChange({
                                    size: brushSize,
                                    opacity: brushOpacity,
                                    color: brushColor,
                                    style
                                });
                            }}
                        >
                            <Text style={styles.styleText}>{style}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </View>
    );

    const renderTextPanel = () => (
        <View style={styles.panel}>
            <View style={styles.configRow}>
                <Text style={styles.label}>Font Size</Text>
                <Slider
                    style={styles.slider}
                    minimumValue={8}
                    maximumValue={72}
                    value={fontSize}
                    onValueChange={setFontSize}
                    onSlidingComplete={() => handleConfigChange({ fontSize, color: textColor })}
                />
                <Text style={styles.value}>{Math.round(fontSize)}</Text>
            </View>

            <View style={styles.configRow}>
                <Text style={styles.label}>Color</Text>
                <View style={styles.colorRow}>
                    {['#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00'].map(color => (
                        <TouchableOpacity
                            key={color}
                            style={[styles.colorButton, { backgroundColor: color }]}
                            onPress={() => {
                                setTextColor(color);
                                handleConfigChange({ fontSize, color });
                            }}
                        />
                    ))}
                </View>
            </View>
        </View>
    );

    const renderCropPanel = () => (
        <View style={styles.panel}>
            <View style={styles.configRow}>
                <Text style={styles.label}>Aspect Ratio</Text>
                <View style={styles.ratioRow}>
                    {[
                        { label: 'Free', value: 0 },
                        { label: '1:1', value: 1 },
                        { label: '4:3', value: 1.333333333 },
                        { label: '16:9', value: 1.777777777 },
                    ].map(ratio => (
                        <TouchableOpacity
                            key={ratio.value}
                            style={[styles.ratioButton, cropAspectRatio === ratio.value && styles.selectedRatio]}
                            onPress={() => {
                                setCropAspectRatio(ratio.value);
                                handleConfigChange({ aspectRatio: ratio.value, grid: cropGrid });
                            }}
                        >
                            <Text style={styles.ratioText}>{ratio.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <View style={styles.configRow}>
                <Text style={styles.label}>Show Grid</Text>
                <TouchableOpacity
                    style={[styles.toggleButton, cropGrid && styles.selectedToggle]}
                    onPress={() => {
                        setCropGrid(!cropGrid);
                        handleConfigChange({ aspectRatio: cropAspectRatio, grid: !cropGrid });
                    }}
                >
                    <Text style={styles.toggleText}>{cropGrid ? 'ON' : 'OFF'}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderPanel = () => {
        switch (selectedTool) {
            case EditorTool.BRUSH:
            case EditorTool.ERASER:
                return renderBrushPanel();
            case EditorTool.TEXT:
                return renderTextPanel();
            case EditorTool.CROP:
                return renderCropPanel();
            default:
                return null;
        }
    };

    return (
        <View style={[styles.container, { backgroundColor }]}>
            {renderPanel()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        minHeight: 200,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    panel: {
        gap: 16,
    },
    configRow: {
        gap: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333333',
        marginBottom: 8,
    },
    value: {
        fontSize: 12,
        color: '#666666',
        textAlign: 'center',
        minWidth: 40,
    },
    slider: {
        flex: 1,
        height: 40,
    },
    colorRow: {
        flexDirection: 'row',
        gap: 8,
        flexWrap: 'wrap',
    },
    colorButton: {
        width: 30,
        height: 30,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#d0d0d0',
    },
    styleRow: {
        flexDirection: 'row',
        gap: 8,
    },
    styleButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#d0d0d0',
        backgroundColor: '#ffffff',
    },
    selectedStyle: {
        backgroundColor: '#007bff',
        borderColor: '#007bff',
    },
    styleText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#333333',
    },
    styleTextSelected: {
        color: '#ffffff',
    },
    ratioRow: {
        flexDirection: 'row',
        gap: 8,
    },
    ratioButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#d0d0d0',
        backgroundColor: '#ffffff',
    },
    selectedRatio: {
        backgroundColor: '#007bff',
        borderColor: '#007bff',
    },
    ratioText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#333333',
    },
    ratioTextSelected: {
        color: '#ffffff',
    },
    toggleButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#d0d0d0',
        backgroundColor: '#ffffff',
    },
    selectedToggle: {
        backgroundColor: '#007bff',
        borderColor: '#007bff',
    },
    toggleText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#333333',
    },
    toggleTextSelected: {
        color: '#ffffff',
    },
});