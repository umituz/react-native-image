/**
 * Presentation - Image Gallery Component
 * 
 * High-performance, premium image gallery using expo-image.
 * Replaces slow standard image components for instant loading.
 */

import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { Modal, View, StyleSheet, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { ImageViewerItem, ImageGalleryOptions } from '../../domain/entities/ImageTypes';
import { GalleryHeader } from './GalleryHeader';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface ImageGalleryProps extends ImageGalleryOptions {
    images: ImageViewerItem[];
    visible: boolean;
    onDismiss: () => void;
    index?: number;
    onImageChange?: (uri: string, index: number) => void | Promise<void>;
    enableEditing?: boolean;
    title?: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
    images,
    visible,
    onDismiss,
    index = 0,
    backgroundColor = '#000000',
    onIndexChange,
    onImageChange,
    enableEditing = false,
    title,
}) => {
    const insets = useSafeAreaInsets();
    const [currentIndex, setCurrentIndex] = useState(index);

    useEffect(() => {
        if (visible) setCurrentIndex(index);
    }, [visible, index]);

    const handleEdit = useCallback(async () => {
        const currentImage = images[currentIndex];
        if (!currentImage || !onImageChange) return;
        await onImageChange(currentImage.uri, currentIndex);
    }, [images, currentIndex, onImageChange]);

    const handleScroll = useCallback((event: any) => {
        const nextIndex = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
        if (nextIndex !== currentIndex) {
            setCurrentIndex(nextIndex);
            onIndexChange?.(nextIndex);
        }
    }, [currentIndex, onIndexChange]);

    const renderItem = useCallback(({ item }: { item: ImageViewerItem }) => (
        <View style={styles.imageWrapper}>
            <Image
                source={{ uri: item.uri }}
                style={styles.fullImage}
                contentFit="contain"
                transition={200}
                cachePolicy="memory-disk"
            />
        </View>
    ), []);

    if (!visible && !currentIndex) return null;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onDismiss}
            statusBarTranslucent
        >
            <View style={[styles.container, { backgroundColor }]}>
                <GalleryHeader
                    onClose={onDismiss}
                    onEdit={enableEditing ? handleEdit : undefined}
                    title={title || `${currentIndex + 1} / ${images.length}`}
                />

                <FlatList
                    data={images}
                    renderItem={renderItem}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    initialScrollIndex={index}
                    getItemLayout={(_, i) => ({
                        length: SCREEN_WIDTH,
                        offset: SCREEN_WIDTH * i,
                        index: i,
                    })}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                    keyExtractor={(item, i) => `${item.uri}-${i}`}
                    style={styles.list}
                />

                <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
                    {/* Potential for thumbnail strip or captions in future */}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    list: {
        flex: 1,
    },
    imageWrapper: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullImage: {
        width: '100%',
        height: '100%',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
    }
});
