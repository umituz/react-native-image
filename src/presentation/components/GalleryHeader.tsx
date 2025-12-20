/**
 * Presentation - Gallery Header Component
 * 
 * High-performance, premium header for the Image Gallery.
 * Uses design system tokens and handles safe areas.
 */

import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppDesignTokens } from '@umituz/react-native-design-system';
import { AtomicText } from '@umituz/react-native-design-system';

interface GalleryHeaderProps {
    onEdit?: () => void;
    onClose: () => void;
    title?: string;
}

export function GalleryHeader({ onEdit, onClose, title }: GalleryHeaderProps) {
    const insets = useSafeAreaInsets();
    const tokens = useAppDesignTokens();

    return (
        <View style={[
            styles.container,
            {
                paddingTop: Math.max(insets.top, 24),
                backgroundColor: 'rgba(0, 0, 0, 0.4)'
            }
        ]}>
            <View style={styles.leftSection}>
                {onEdit ? (
                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: 'rgba(255, 255, 255, 0.15)' }]}
                        onPress={onEdit}
                        activeOpacity={0.7}
                    >
                        <AtomicText style={styles.buttonText}>Edit</AtomicText>
                    </TouchableOpacity>
                ) : (
                    <View style={styles.spacer} />
                )}
            </View>

            <View style={styles.centerSection}>
                {title ? (
                    <AtomicText type="bodyMedium" style={styles.titleText}>
                        {title}
                    </AtomicText>
                ) : null}
            </View>

            <View style={styles.rightSection}>
                <TouchableOpacity
                    style={[styles.closeButton, { backgroundColor: 'rgba(0, 0, 0, 0.4)' }]}
                    onPress={onClose}
                    activeOpacity={0.7}
                    hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                >
                    <AtomicText style={styles.closeIcon}>✕</AtomicText>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
        paddingBottom: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 1000,
    },
    leftSection: {
        flex: 1,
        alignItems: 'flex-start',
    },
    centerSection: {
        flex: 2,
        alignItems: 'center',
    },
    rightSection: {
        flex: 1,
        alignItems: 'flex-end',
    },
    spacer: {
        width: 44,
        height: 44,
    },
    actionButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 14,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    closeIcon: {
        fontSize: 28,
        color: '#FFFFFF',
        fontWeight: '300',
    },
    titleText: {
        color: '#FFFFFF',
        fontWeight: '600',
        textAlign: 'center',
    },
});
