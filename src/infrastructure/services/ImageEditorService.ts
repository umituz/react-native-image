/**
 * Infrastructure - Advanced Editor Service
 * 
 * Core editing functionality with history management
 */

import { EditorTool, type EditorState, type EditorLayer, type EditorHistory, type EditorOptions } from '../../domain/entities/EditorTypes';
import type { ImageManipulationResult } from '../../domain/entities/ImageTypes';
import { ImageValidator } from '../utils/ImageValidator';
import { ImageErrorHandler, IMAGE_ERROR_CODES } from '../utils/ImageErrorHandler';

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

  static addLayer(
    state: EditorState,
    name?: string
  ): EditorState {
    const newLayer: EditorLayer = {
      id: ImageEditorService.generateId(),
      name: name || `Layer ${state.layers.length}`,
      visible: true,
      opacity: 1,
      locked: false,
      elements: [],
    };

    const newHistory: EditorHistory = {
      id: ImageEditorService.generateId(),
      timestamp: new Date(),
      layers: [...state.layers, newLayer],
    };

    const newHistoryState = ImageEditorService.addToHistory(state, newHistory);

    return {
      ...newHistoryState,
      layers: [...state.layers, newLayer],
      selectedLayer: newLayer.id,
      isDirty: true,
    };
  }

  static removeLayer(
    state: EditorState,
    layerId: string
  ): EditorState {
    if (state.layers.length <= 1) {
      throw ImageErrorHandler.createError(
        'Cannot remove the last layer',
        IMAGE_ERROR_CODES.VALIDATION_ERROR,
        'removeLayer'
      );
    }

    const newLayers = state.layers.filter(layer => layer.id !== layerId);
    const newHistory: EditorHistory = {
      id: ImageEditorService.generateId(),
      timestamp: new Date(),
      layers: newLayers,
    };

    const newHistoryState = ImageEditorService.addToHistory(state, newHistory);

    return {
      ...newHistoryState,
      layers: newLayers,
      selectedLayer: newLayers[0].id,
      isDirty: true,
    };
  }

  static updateLayer(
    state: EditorState,
    layerId: string,
    updates: Partial<EditorLayer>
  ): EditorState {
    const newLayers = state.layers.map(layer =>
      layer.id === layerId ? { ...layer, ...updates } : layer
    );

    const newHistory: EditorHistory = {
      id: ImageEditorService.generateId(),
      timestamp: new Date(),
      layers: newLayers,
    };

    const newHistoryState = ImageEditorService.addToHistory(state, newHistory);

    return {
      ...newHistoryState,
      layers: newLayers,
      isDirty: true,
    };
  }

  static addElementToLayer(
    state: EditorState,
    layerId: string,
    element: any
  ): EditorState {
    const targetLayer = state.layers.find(layer => layer.id === layerId);
    if (!targetLayer) {
      throw ImageErrorHandler.createError(
        'Layer not found',
        IMAGE_ERROR_CODES.VALIDATION_ERROR,
        'addElementToLayer'
      );
    }

    if (targetLayer.locked) {
      throw ImageErrorHandler.createError(
        'Cannot add element to locked layer',
        IMAGE_ERROR_CODES.VALIDATION_ERROR,
        'addElementToLayer'
      );
    }

    const newLayers = state.layers.map(layer =>
      layer.id === layerId
        ? { ...layer, elements: [...layer.elements, element] }
        : layer
    );

    const newHistory: EditorHistory = {
      id: ImageEditorService.generateId(),
      timestamp: new Date(),
      layers: newLayers,
    };

    const newHistoryState = ImageEditorService.addToHistory(state, newHistory);

    return {
      ...newHistoryState,
      layers: newLayers,
      isDirty: true,
    };
  }

  static undo(state: EditorState): EditorState {
    if (state.historyIndex <= 0) {
      return state;
    }

    const newIndex = state.historyIndex - 1;
    const historyState = state.history[newIndex];

    return {
      ...state,
      layers: historyState.layers,
      historyIndex: newIndex,
      isDirty: true,
    };
  }

  static redo(state: EditorState): EditorState {
    if (state.historyIndex >= state.history.length - 1) {
      return state;
    }

    const newIndex = state.historyIndex + 1;
    const historyState = state.history[newIndex];

    return {
      ...state,
      layers: historyState.layers,
      historyIndex: newIndex,
      isDirty: true,
    };
  }

  private static addToHistory(
    state: EditorState,
    newHistory: EditorHistory,
    maxHistory: number = 50
  ): EditorState {
    const newHistoryArray = [...state.history.slice(0, state.historyIndex + 1), newHistory];

    // Keep only the last maxHistory states
    if (newHistoryArray.length > maxHistory) {
      newHistoryArray.shift();
    }

    return {
      ...state,
      history: newHistoryArray,
      historyIndex: newHistoryArray.length - 1,
    };
  }

  static setTool(state: EditorState, tool: EditorTool): EditorState {
    return { ...state, tool };
  }

  static setSelectedLayer(state: EditorState, layerId?: string): EditorState {
    return { ...state, selectedLayer: layerId };
  }

  static setZoom(state: EditorState, zoom: number): EditorState {
    return { ...state, zoom: Math.max(0.1, Math.min(5, zoom)) };
  }

  static setPan(state: EditorState, pan: { x: number; y: number }): EditorState {
    return { ...state, pan };
  }

  static canUndo(state: EditorState): boolean {
    return state.historyIndex > 0;
  }

  static canRedo(state: EditorState): boolean {
    return state.historyIndex < state.history.length - 1;
  }

  static getVisibleLayers(state: EditorState): EditorLayer[] {
    return state.layers.filter(layer => layer.visible);
  }

  static getActiveLayers(state: EditorState): EditorLayer[] {
    return state.layers.filter(layer => layer.visible && !layer.locked);
  }

  static exportState(state: EditorState): EditorState {
    return {
      ...state,
      currentUri: undefined,
    };
  }

  static importState(data: any, uri: string): EditorState {
    try {
      return {
        ...data,
        originalUri: uri,
        currentUri: undefined,
      };
    } catch (error) {
      throw ImageErrorHandler.handleUnknownError(error, 'importState');
    }
  }
}