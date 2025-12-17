/**
 * GalleryHeader Component
 * Header for ImageGallery with edit and close buttons
 * 
 * This component should be implemented by the consumer app
 * using their own design system and safe area handling.
 */

import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';

interface GalleryHeaderProps {
    onEdit: () => void;
    onClose: () => void;
}

export function GalleryHeader({ onEdit, onClose }: GalleryHeaderProps) {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={onEdit}>
                <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={onClose}>
                <Text style={styles.buttonText}>✕</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        paddingTop: 48,
        paddingHorizontal: 16,
        paddingBottom: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: 12,
        borderRadius: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    buttonText: {
        fontSize: 14,
        color: '#FFFFFF',
        fontWeight: '600',
    },
});
