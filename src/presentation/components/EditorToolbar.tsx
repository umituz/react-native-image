/**
 * Presentation - Editor Toolbar Component
 * 
 * Toolbar with tools and configuration options
 */

import React from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView, Text } from 'react-native';
import { EditorTool, ShapeType } from '../../domain/entities/EditorTypes';

interface EditorToolbarProps {
    selectedTool: EditorTool;
    onToolSelect: (tool: EditorTool) => void;
    onShapeSelect?: (shape: ShapeType) => void;
    showShapes?: boolean;
    backgroundColor?: string;
}

interface ToolButtonProps {
    tool: EditorTool;
    icon: string;
    label: string;
    isSelected: boolean;
    onPress: () => void;
}

function ToolButton({ tool, icon, label, isSelected, onPress }: ToolButtonProps) {
    return (
        <TouchableOpacity
            style={[styles.toolButton, isSelected && styles.selectedTool]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.toolIcon}>
                <Text style={[styles.iconText, isSelected && styles.iconTextSelected]}>{icon}</Text>
            </View>
            <Text style={[styles.toolLabel, isSelected && styles.toolLabelSelected]}>{label}</Text>
        </TouchableOpacity>
    );
}

export function EditorToolbar({
    selectedTool,
    onToolSelect,
    onShapeSelect,
    showShapes = false,
    backgroundColor = '#f8f9fa',
}: EditorToolbarProps) {
    const mainTools = [
        { tool: EditorTool.MOVE as EditorTool, icon: '↔', label: 'Move' },
        { tool: EditorTool.BRUSH as EditorTool, icon: '✏', label: 'Brush' },
        { tool: EditorTool.ERASER as EditorTool, icon: '⌫', label: 'Eraser' },
        { tool: EditorTool.TEXT as EditorTool, icon: 'T', label: 'Text' },
        { tool: EditorTool.SHAPE as EditorTool, icon: '◇', label: 'Shape' },
        { tool: EditorTool.CROP as EditorTool, icon: '✂', label: 'Crop' },
        { tool: EditorTool.FILTER as EditorTool, icon: '🎨', label: 'Filter' },
    ];

    const shapeTools = [
        { shape: ShapeType.RECTANGLE, icon: '▢', label: 'Rectangle' },
        { shape: ShapeType.CIRCLE, icon: '○', label: 'Circle' },
        { shape: ShapeType.LINE, icon: '╱', label: 'Line' },
        { shape: ShapeType.ARROW, icon: '→', label: 'Arrow' },
        { shape: ShapeType.TRIANGLE, icon: '△', label: 'Triangle' },
        { shape: ShapeType.STAR, icon: '★', label: 'Star' },
        { shape: ShapeType.HEART, icon: '♥', label: 'Heart' },
    ];

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <ScrollView 
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.scrollContainer}
            >
                <View style={styles.toolGroup}>
                    {mainTools.map(({ tool, icon, label }) => (
                        <ToolButton
                            key={tool}
                            tool={tool}
                            icon={icon}
                            label={label}
                            isSelected={selectedTool === tool}
                            onPress={() => onToolSelect(tool)}
                        />
                    ))}
                </View>

                {showShapes && onShapeSelect && (
                    <View style={[styles.toolGroup, styles.shapeGroup]}>
                        {shapeTools.map(({ shape, icon, label }) => (
                            <TouchableOpacity
                                key={shape}
                                style={styles.shapeButton}
                                onPress={() => onShapeSelect(shape)}
                                activeOpacity={0.7}
                            >
                                <View style={styles.toolIcon}>
                                    <Text style={styles.iconText}>{icon}</Text>
                                </View>
                                <Text style={styles.toolLabel}>{label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 8,
        paddingHorizontal: 4,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        backgroundColor: '#f8f9fa',
    },
    scrollContainer: {
        flex: 1,
    },
    toolGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
    },
    shapeGroup: {
        borderLeftWidth: 1,
        borderLeftColor: '#e0e0e0',
        marginLeft: 16,
    },
    toolButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginHorizontal: 2,
        borderRadius: 8,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#d0d0d0',
        minWidth: 60,
    },
    selectedTool: {
        backgroundColor: '#007bff',
        borderColor: '#007bff',
    },
    shapeButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 6,
        paddingHorizontal: 8,
        marginHorizontal: 2,
        borderRadius: 6,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#d0d0d0',
        minWidth: 50,
    },
    toolIcon: {
        marginBottom: 2,
    },
    iconText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333333',
    },
    iconTextSelected: {
        color: '#ffffff',
    },
    toolLabel: {
        fontSize: 10,
        fontWeight: '500',
        color: '#666666',
        textAlign: 'center',
    },
    toolLabelSelected: {
        color: '#ffffff',
    },
});