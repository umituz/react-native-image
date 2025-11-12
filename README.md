# @umituz/react-native-image

Image manipulation and viewing for React Native apps - resize, crop, rotate, flip, compress, gallery viewer.

## Features

- ✅ **Image Manipulation** - Resize, crop, rotate, flip, compress
- ✅ **Format Conversion** - JPEG, PNG, WEBP
- ✅ **Thumbnail Generation** - Create small preview images
- ✅ **Full-Screen Image Viewer** - Gallery viewer with zoom/swipe (react-native-image-viewing)
- ✅ **Image Gallery Management** - Multiple images with navigation
- ✅ **Filesystem Integration** - Save images to device using @umituz/react-native-filesystem
- ✅ **Type-Safe** - Full TypeScript support

## Installation

```bash
npm install @umituz/react-native-image
```

## Peer Dependencies

```bash
npm install expo-image-manipulator react-native-image-viewing @umituz/react-native-filesystem
```

## Usage

### Image Manipulation

```tsx
import { useImage } from '@umituz/react-native-image';

const MyScreen = () => {
  const { resize, crop, rotate, compress, isProcessing } = useImage();

  const handleResize = async () => {
    const resized = await resize(imageUri, 800, 600);
    if (resized) {
      console.log('Resized:', resized.uri);
    }
  };

  const handleCrop = async () => {
    const cropped = await crop(imageUri, {
      originX: 0,
      originY: 0,
      width: 500,
      height: 500,
    });
  };

  const handleCompress = async () => {
    const compressed = await compress(imageUri, 0.7);
  };

  return (
    <View>
      <Button onPress={handleResize} disabled={isProcessing}>
        Resize Image
      </Button>
    </View>
  );
};
```

### Image Gallery Viewer

```tsx
import { useImageGallery } from '@umituz/react-native-image';
import ImageViewing from 'react-native-image-viewing';

const MyScreen = () => {
  const { visible, currentIndex, images, open, close, setIndex } = useImageGallery();

  const handleOpenGallery = () => {
    open(['uri1', 'uri2', 'uri3'], 0);
  };

  return (
    <View>
      <Button onPress={handleOpenGallery}>Open Gallery</Button>

      <ImageViewing
        images={images}
        imageIndex={currentIndex}
        visible={visible}
        onRequestClose={close}
        onIndexChange={setIndex}
      />
    </View>
  );
};
```

### Image Service (Direct Usage)

```tsx
import { ImageService } from '@umituz/react-native-image';

// Resize image
const resized = await ImageService.resize(uri, 800, 600);

// Crop image
const cropped = await ImageService.crop(uri, {
  originX: 0,
  originY: 0,
  width: 500,
  height: 500,
});

// Create thumbnail
const thumbnail = await ImageService.createThumbnail(uri, 200);

// Save image
const savedUri = await ImageService.saveImage(uri, 'my-image.jpg');
```

### Image Utilities

```tsx
import { ImageUtils, ImageFormat } from '@umituz/react-native-image';

// Get orientation
const orientation = ImageUtils.getOrientation(1920, 1080);
// Returns: ImageOrientation.LANDSCAPE

// Calculate aspect ratio
const ratio = ImageUtils.getAspectRatio(1920, 1080);
// Returns: 1.777...

// Fit to size
const dimensions = ImageUtils.fitToSize(1920, 1080, 800, 600);
// Returns: { width: 800, height: 450 }

// Get format from URI
const format = ImageUtils.getFormatFromUri('image.jpg');
// Returns: ImageFormat.JPEG

// Format file size
const size = ImageUtils.formatFileSize(1024000);
// Returns: "1000.0 KB"
```

## API Reference

### `useImage()`

React hook for image manipulation operations.

**Returns:**
- `resize(uri, width?, height?, options?)` - Resize image
- `crop(uri, cropArea, options?)` - Crop image
- `rotate(uri, degrees, options?)` - Rotate image
- `flip(uri, flipOptions, options?)` - Flip image
- `manipulate(uri, action, options?)` - Perform multiple manipulations
- `compress(uri, quality?)` - Compress image
- `resizeToFit(uri, maxWidth, maxHeight, options?)` - Resize to fit within max dimensions
- `createThumbnail(uri, size?, options?)` - Create thumbnail
- `cropToSquare(uri, width, height, options?)` - Crop to square (centered)
- `convertFormat(uri, format, quality?)` - Convert image format
- `saveImage(uri, filename?)` - Save image to device
- `isProcessing` - Processing state
- `error` - Error message

### `useImageGallery()`

React hook for image gallery and viewer.

**Returns:**
- `visible` - Gallery visibility state
- `currentIndex` - Current image index
- `images` - Image viewer items
- `open(images, startIndex?, options?)` - Open gallery
- `close()` - Close gallery
- `setIndex(index)` - Set current image index
- `options` - Gallery options

### `ImageService`

Service class for image manipulation.

**Methods:**
- `resize(uri, width?, height?, options?)` - Resize image
- `crop(uri, cropArea, options?)` - Crop image
- `rotate(uri, degrees, options?)` - Rotate image
- `flip(uri, flip, options?)` - Flip image
- `manipulate(uri, action, options?)` - Perform multiple manipulations
- `compress(uri, quality?)` - Compress image
- `resizeToFit(uri, maxWidth, maxHeight, options?)` - Resize to fit
- `createThumbnail(uri, size?, options?)` - Create thumbnail
- `cropToSquare(uri, width, height, options?)` - Crop to square
- `convertFormat(uri, format, quality?)` - Convert format
- `saveImage(uri, filename?)` - Save image

### `ImageViewerService`

Service class for image viewer configuration.

**Methods:**
- `prepareImages(uris)` - Prepare images for viewer
- `prepareImagesWithMetadata(items)` - Prepare images with metadata
- `createViewerConfig(images, startIndex?, onDismiss?, options?)` - Create viewer config
- `getDefaultOptions()` - Get default gallery options

### `ImageUtils`

Utility class for image operations.

**Methods:**
- `getOrientation(width, height)` - Get image orientation
- `getAspectRatio(width, height)` - Calculate aspect ratio
- `fitToSize(width, height, maxWidth, maxHeight)` - Fit to size
- `getThumbnailSize(width, height, thumbnailSize?)` - Get thumbnail size
- `isValidImageUri(uri)` - Validate image URI
- `getFormatFromUri(uri)` - Get format from URI
- `getExtensionFromFormat(format)` - Get extension from format
- `getSquareCrop(width, height)` - Get square crop dimensions
- `formatFileSize(bytes)` - Format file size
- `needsCompression(bytes, maxSizeMB?)` - Check if needs compression

## Types

- `ImageFormat` - JPEG | PNG | WEBP
- `ImageOrientation` - PORTRAIT | LANDSCAPE | SQUARE
- `SaveFormat` - 'jpeg' | 'png' | 'webp'
- `ImageManipulateAction` - Image manipulation action
- `ImageSaveOptions` - Image save options
- `ImageManipulationResult` - Manipulation result
- `ImageViewerItem` - Image viewer item
- `ImageGalleryOptions` - Gallery options

## Constants

- `IMAGE_CONSTANTS` - Image constants (MAX_WIDTH, MAX_HEIGHT, DEFAULT_QUALITY, THUMBNAIL_SIZE, etc.)

## Important Notes

⚠️ **File Operations**: This package uses `@umituz/react-native-filesystem` for file operations. Make sure to install it as a peer dependency.

⚠️ **Image Viewer**: This package provides hooks and services for `react-native-image-viewing`. You need to render the `ImageViewing` component yourself in your app.

## License

MIT

## Author

Ümit UZ <umit@umituz.com>

