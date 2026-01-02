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


}