/**
 * Infrastructure - Layer Manager
 * 
 * Manages editor layers with composition and rendering
 */

export type LayerOperation = 'add' | 'remove' | 'move' | 'merge' | 'duplicate';

export interface LayerComposition {
  width: number;
  height: number;
  backgroundColor?: string;
}

export class LayerManager {
  static composeLayers(
    layers: Array<{
      canvas: HTMLCanvasElement | any;
      opacity: number;
      visible: boolean;
      x?: number;
      y?: number;
    }>,
    composition: LayerComposition
  ): HTMLCanvasElement | any {
    // Create composition canvas
    const composedCanvas = document.createElement('canvas') || {} as any;
    composedCanvas.width = composition.width;
    composedCanvas.height = composition.height;
    const ctx = composedCanvas.getContext('2d');

    if (!ctx) return composedCanvas;

    // Clear canvas with background color
    ctx.fillStyle = composition.backgroundColor || '#ffffff';
    ctx.fillRect(0, 0, composition.width, composition.height);

    // Draw each layer
    layers.forEach(layer => {
      if (!layer.visible) return;

      ctx.save();
      ctx.globalAlpha = layer.opacity;
      ctx.drawImage(
        layer.canvas,
        layer.x || 0,
        layer.y || 0
      );
      ctx.restore();
    });

    return composedCanvas;
  }

  static mergeLayers(
    layers: Array<{
      id: string;
      name: string;
      elements: any[];
    }>,
    targetIds: string[]
  ): Array<{
    id: string;
    name: string;
    elements: any[];
  }> {
    const targetLayers = layers.filter(layer => targetIds.includes(layer.id));
    const otherLayers = layers.filter(layer => !targetIds.includes(layer.id));

    if (targetLayers.length === 0) return layers;

    // Merge elements from target layers
    const mergedElements = targetLayers.flatMap(layer => layer.elements);
    const mergedLayer = {
      id: Math.random().toString(36).substr(2, 9),
      name: targetLayers.map(l => l.name).join(' + '),
      elements: mergedElements,
    };

    return [...otherLayers, mergedLayer];
  }

  static duplicateLayer(
    layer: {
      id: string;
      name: string;
      elements: any[];
    }
  ): {
    id: string;
    name: string;
    elements: any[];
  } {
    return {
      id: Math.random().toString(36).substr(2, 9),
      name: `${layer.name} Copy`,
      elements: [...layer.elements],
    };
  }

  static reorderLayers(
    layers: Array<{ id: string; index?: number }>,
    fromIndex: number,
    toIndex: number
  ): Array<{ id: string; index?: number }> {
    const result = [...layers];
    const [moved] = result.splice(fromIndex, 1);
    result.splice(toIndex, 0, moved);
    
    return result.map((layer, index) => ({ ...layer, index }));
  }

  static flattenLayers(
    layers: Array<{
      canvas: HTMLCanvasElement | any;
      opacity: number;
      visible: boolean;
    }>,
    composition: LayerComposition
  ): HTMLCanvasElement | any {
    return LayerManager.composeLayers(layers, composition);
  }

  static createLayerCanvas(
    width: number,
    height: number,
    transparent: boolean = true
  ): HTMLCanvasElement | any {
    const canvas = document.createElement('canvas') || {} as any;
    canvas.width = width;
    canvas.height = height;
    
    if (!transparent) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
      }
    }

    return canvas;
  }

  static clearLayer(
    canvas: HTMLCanvasElement | any,
    preserveAlpha: boolean = true
  ): void {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (preserveAlpha) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    } else {
      ctx.fillStyle = 'transparent';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }
}