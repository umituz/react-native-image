/**
 * Image Infrastructure - Image Analysis
 * 
 * Image analysis utilities
 */

export class ImageAnalysisUtils {
  static calculateColorBalance(imageData: Uint8ClampedArray): {
    redBalance: number;
    greenBalance: number;
    blueBalance: number;
  } {
    let redSum = 0, greenSum = 0, blueSum = 0;
    const pixelCount = imageData.length / 4;
    
    for (let i = 0; i < imageData.length; i += 4) {
      redSum += imageData[i];
      greenSum += imageData[i + 1];
      blueSum += imageData[i + 2];
    }
    
    const redMean = redSum / pixelCount;
    const greenMean = greenSum / pixelCount;
    const blueMean = blueSum / pixelCount;
    const grayMean = (redMean + greenMean + blueMean) / 3;
    
    return {
      redBalance: (grayMean - redMean) / 255,
      greenBalance: (grayMean - greenMean) / 255,
      blueBalance: (grayMean - blueMean) / 255,
    };
  }

  static detectNoise(imageData: Uint8ClampedArray): number {
    let noiseLevel = 0;
    let sampleCount = 0;
    
    for (let i = 0; i < imageData.length - 40; i += 40) {
      const r1 = imageData[i];
      const g1 = imageData[i + 1];
      const b1 = imageData[i + 2];
      
      const r2 = imageData[i + 4];
      const g2 = imageData[i + 5];
      const b2 = imageData[i + 6];
      
      const diff = Math.abs(r1 - r2) + Math.abs(g1 - g2) + Math.abs(b1 - b2);
      noiseLevel += diff;
      sampleCount++;
    }
    
    return noiseLevel / (sampleCount * 3 * 255);
  }

  static applySharpening(imageData: Uint8ClampedArray): Uint8ClampedArray {
    const result = new Uint8ClampedArray(imageData.length);
    const width = Math.sqrt(imageData.length / 4);
    const kernel = [
      0, -1, 0,
      -1, 5, -1,
      0, -1, 0
    ];
    
    for (let i = 0; i < imageData.length; i += 4) {
      const pixelIndex = i / 4;
      const x = pixelIndex % width;
      const y = Math.floor(pixelIndex / width);
      
      for (let c = 0; c < 3; c++) {
        let sum = 0;
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const nx = x + kx;
            const ny = y + ky;
            
            if (nx >= 0 && nx < width && ny >= 0 && ny < width) {
              const neighborIndex = (ny * width + nx) * 4 + c;
              sum += imageData[neighborIndex] * kernel[(ky + 1) * 3 + (kx + 1)];
            }
          }
        }
        result[i + c] = Math.min(255, Math.max(0, sum));
      }
      result[i + 3] = imageData[i + 3];
    }
    
    return result;
  }

  static applyNoiseReduction(imageData: Uint8ClampedArray): Uint8ClampedArray {
    const result = new Uint8ClampedArray(imageData.length);
    const width = Math.sqrt(imageData.length / 4);
    
    for (let i = 0; i < imageData.length; i += 4) {
      const pixelIndex = i / 4;
      const x = pixelIndex % width;
      const y = Math.floor(pixelIndex / width);
      
      for (let c = 0; c < 3; c++) {
        const values = [];
        
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const nx = x + dx;
            const ny = y + dy;
            
            if (nx >= 0 && nx < width && ny >= 0 && ny < width) {
              const neighborIndex = (ny * width + nx) * 4 + c;
              values.push(imageData[neighborIndex]);
            }
          }
        }
        
        values.sort((a, b) => a - b);
        result[i + c] = values[Math.floor(values.length / 2)];
      }
      result[i + 3] = imageData[i + 3];
    }
    
    return result;
  }
}