/**
 * Image Infrastructure - Filter Effects
 * 
 * Advanced filter effects and color processing
 */

export class FilterEffects {
  static applyVintage(imageData: ImageData): ImageData {
    let data = FilterEffects.applySepia(imageData, 0.8);
    const { width, height } = imageData;
    const centerX = width / 2;
    const centerY = height / 2;
    const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
        const vignette = 1 - (distance / maxDistance) * 0.7;
        const i = (y * width + x) * 4;
        
        data.data[i] *= vignette;
        data.data[i + 1] *= vignette;
        data.data[i + 2] *= vignette;
      }
    }

    return data;
  }

  static applySepia(imageData: ImageData, intensity: number = 1): ImageData {
    const data = new Uint8ClampedArray(imageData.data);
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      data[i] = Math.min(255, (r * (1 - (0.607 * intensity))) + (g * (0.769 * intensity)) + (b * (0.189 * intensity)));
      data[i + 1] = Math.min(255, (r * (0.349 * intensity)) + (g * (1 - (0.314 * intensity))) + (b * (0.168 * intensity)));
      data[i + 2] = Math.min(255, (r * (0.272 * intensity)) + (g * (0.534 * intensity)) + (b * (1 - (0.869 * intensity))));
    }
    return FilterEffects.createCanvasImageData(imageData.width, imageData.height, data);
  }

  static createCanvasImageData(
    width: number,
    height: number,
    data: Uint8ClampedArray
  ): ImageData {
    return { data, width, height } as ImageData;
  }
}