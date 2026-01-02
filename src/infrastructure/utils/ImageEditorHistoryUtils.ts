/**
 * Infrastructure - Editor History Utils
 * 
 * Logic for managing editor state history and undo/redo
 */

import { type EditorState, type EditorHistory } from '../../domain/entities/EditorTypes';

export class ImageEditorHistoryUtils {
  static addToHistory(
    state: EditorState,
    newHistory: EditorHistory,
    maxHistory: number = 50
  ): EditorState {
    const newHistoryArray = [...state.history.slice(0, state.historyIndex + 1), newHistory];

    if (newHistoryArray.length > maxHistory) {
      newHistoryArray.shift();
    }

    return {
      ...state,
      history: newHistoryArray,
      historyIndex: newHistoryArray.length - 1,
    };
  }

  static undo(state: EditorState): EditorState {
    if (state.historyIndex <= 0) return state;

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
    if (state.historyIndex >= state.history.length - 1) return state;

    const newIndex = state.historyIndex + 1;
    const historyState = state.history[newIndex];

    return {
      ...state,
      layers: historyState.layers,
      historyIndex: newIndex,
      isDirty: true,
    };
  }

  static canUndo(state: EditorState): boolean {
    return state.historyIndex > 0;
  }

  static canRedo(state: EditorState): boolean {
    return state.historyIndex < state.history.length - 1;
  }
}
