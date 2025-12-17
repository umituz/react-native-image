/**
 * Image Gallery Component
 * 
 * A wrapper around react-native-image-viewing that provides
 * theme integration, standard configuration, and optional editing.
 */

import React, { useCallback } from 'react';
import ImageViewing from 'react-native-image-viewing';
import * as ImageManipulator from 'expo-image-manipulator';
import { useAppDesignTokens } from '@umituz/react-native-design-system-theme';
import type { ImageViewerItem, ImageGalleryOptions } from '../../domain/entities/ImageTypes';
import { GalleryHeader } from './GalleryHeader';

export interface ImageGalleryProps extends ImageGalleryOptions {
    images: ImageViewerItem[];
    visible: boolean;
    onDismiss: () => void;
    index?: number;
    onImageChange?: (uri: string, index: number) => void | Promise<void>;
    enableEditing?: boolean;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
    images,
    visible,
    onDismiss,
    index = 0,
    backgroundColor,
    swipeToCloseEnabled = true,
    doubleTapToZoomEnabled = true,
    onIndexChange,
    onImageChange,
    enableEditing = false,
}) => {
    const tokens = useAppDesignTokens();
    const [currentIndex, setCurrentIndex] = React.useState(index);

    React.useEffect(() => {
        setCurrentIndex(index);
    }, [index]);

    const bg = backgroundColor || tokens.colors.backgroundPrimary;

    const viewerImages = React.useMemo(
        () => images.map((img) => ({ uri: img.uri })),
        [images]
    );

    const handleEdit = useCallback(async () => {
        const currentImage = images[currentIndex];
        if (!currentImage || !onImageChange) return;

        try {
            const result = await ImageManipulator.manipulateAsync(
                currentImage.uri,
                [],
                {
                    compress: 1,
                    format: ImageManipulator.SaveFormat.JPEG,
                }
            );

            if (result.uri) {
                await onImageChange(result.uri, currentIndex);
            }
        } catch (error) {
            // Silent fail
        }
    }, [images, currentIndex, onImageChange]);

    const handleIndexChange = useCallback(
        (newIndex: number) => {
            setCurrentIndex(newIndex);
            onIndexChange?.(newIndex);
        },
        [onIndexChange]
    );

    const headerComponent = useCallback(() => {
        if (!enableEditing) return null;
        return (
            <GalleryHeader
                onEdit={handleEdit}
                onClose={onDismiss}
            />
        );
    }, [enableEditing, handleEdit, onDismiss]);

    return (
        <ImageViewing
            images={viewerImages}
            imageIndex={currentIndex}
            visible={visible}
            onRequestClose={onDismiss}
            onImageIndexChange={handleIndexChange}
            backgroundColor={bg}
            swipeToCloseEnabled={swipeToCloseEnabled}
            doubleTapToZoomEnabled={doubleTapToZoomEnabled}
            HeaderComponent={headerComponent}
        />
    );
};
