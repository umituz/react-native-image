/**
 * Infrastructure - Editor Service
 * 
 * Core editing functionality with layer and tool management
 */

import { 
  EditorTool, 
  type EditorState, 
  type EditorLayer, 
  type EditorHistory, 
  type EditorOptions 
} from '../../domain/entities/EditorTypes';
import { ImageErrorHandler, IMAGE_ERROR_CODES } from '../utils/ImageErrorHandler';
import { ImageEditorHistoryUtils } from '../utils/ImageEditorHistoryUtils';

export class ImageEditorService {
  private static generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  static createInitialState(
    uri: string,
    dimensions: { width: number; height: number },
    options: EditorOptions = {}
  ): EditorState {
    const defaultLayer: EditorLayer = {
      id: 'background',
      name: 'Background',
      visible: true,
      opacity: 1,
      locked: true,
      elements: [],
    };

    return {
      originalUri: uri,
      tool: EditorTool.MOVE,
      layers: [defaultLayer],
      history: [{
        id: ImageEditorService.generateId(),
        timestamp: new Date(),
        layers: [defaultLayer],
      }],
      historyIndex: 0,
      isDirty: false,
      dimensions,
      zoom: 1,
      pan: { x: 0, y: 0 },
    };
  }

  static addLayer(state: EditorState, name?: string): EditorState {
    const newLayer: EditorLayer = {
      id: ImageEditorService.generateId(),
      name: name || `Layer ${state.layers.length}`,
      visible: true,
      opacity: 1,
      locked: false,
      elements: [],
    };

    return ImageEditorService.commitHistory(state, [...state.layers, newLayer], {
      selectedLayer: newLayer.id,
    });
  }

  static removeLayer(state: EditorState, layerId: string): EditorState {
    if (state.layers.length <= 1) {
      throw ImageErrorHandler.createError('Cannot remove background', IMAGE_ERROR_CODES.VALIDATION_ERROR, 'removeLayer');
    }

    const newLayers = state.layers.filter(layer => layer.id !== layerId);
    return ImageEditorService.commitHistory(state, newLayers, {
      selectedLayer: newLayers[0].id,
    });
  }

  static updateLayer(state: EditorState, layerId: string, updates: Partial<EditorLayer>): EditorState {
    const newLayers = state.layers.map(layer => layer.id === layerId ? { ...layer, ...updates } : layer);
    return ImageEditorService.commitHistory(state, newLayers);
  }

  static addElementToLayer(state: EditorState, layerId: string, element: any): EditorState {
    const layer = state.layers.find(l => l.id === layerId);
    if (!layer || layer.locked) {
      throw ImageErrorHandler.createError('Invalid layer operation', IMAGE_ERROR_CODES.VALIDATION_ERROR, 'addElementToLayer');
    }

    const newLayers = state.layers.map(l => 
      l.id === layerId ? { ...l, elements: [...l.elements, element] } : l
    );

    return ImageEditorService.commitHistory(state, newLayers);
  }

  private static commitHistory(
    state: EditorState, 
    newLayers: EditorLayer[], 
    additionalState: Partial<EditorState> = {}
  ): EditorState {
    const history: EditorHistory = {
      id: ImageEditorService.generateId(),
      timestamp: new Date(),
      layers: newLayers,
    };

    return {
      ...ImageEditorHistoryUtils.addToHistory(state, history),
      ...additionalState,
      layers: newLayers,
      isDirty: true,
    };
  }

  static undo = ImageEditorHistoryUtils.undo;
  static redo = ImageEditorHistoryUtils.redo;
  static canUndo = ImageEditorHistoryUtils.canUndo;
  static canRedo = ImageEditorHistoryUtils.canRedo;

  static setTool(state: EditorState, tool: EditorTool): EditorState {
    return { ...state, tool };
  }

  static setZoom(state: EditorState, zoom: number): EditorState {
    return { ...state, zoom: Math.max(0.1, Math.min(5, zoom)) };
  }

  static setPan(state: EditorState, pan: { x: number; y: number }): EditorState {
    return { ...state, pan };
  }

  static getVisibleLayers(state: EditorState): EditorLayer[] {
    return state.layers.filter(layer => layer.visible);
  }
}