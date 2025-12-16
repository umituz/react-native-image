/**
 * Image Gallery Component
 * 
 * A wrapper around react-native-image-viewing that provides
 * theme integration and standard configuration.
 */

import React from 'react';
import ImageViewing from 'react-native-image-viewing';
import { useAppDesignTokens } from '@umituz/react-native-design-system-theme';
import type { ImageViewerItem, ImageGalleryOptions } from '../../domain/entities/ImageTypes';

export interface ImageGalleryProps extends ImageGalleryOptions {
    images: ImageViewerItem[];
    visible: boolean;
    onDismiss: () => void;
    index?: number;
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
}) => {
    const tokens = useAppDesignTokens();

    // Use theme background if not provided
    const bg = backgroundColor || tokens.colors.backgroundPrimary;

    // Map images to structure expected by ImageViewing (uri object)
    const viewerImages = React.useMemo(() =>
        images.map(img => ({ uri: img.uri })),
        [images]
    );

    return (
        <ImageViewing
            images={viewerImages}
            imageIndex={index}
            visible={visible}
            onRequestClose={onDismiss}
            onImageIndexChange={onIndexChange}
            backgroundColor={bg}
            swipeToCloseEnabled={swipeToCloseEnabled}
            doubleTapToZoomEnabled={doubleTapToZoomEnabled}
        // Can add custom Header/Footer here using theme tokens if needed
        />
    );
};
