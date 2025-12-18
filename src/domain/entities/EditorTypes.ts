/**
 * Domain - Advanced Editor Types
 */

export enum EditorTool {
  MOVE = 'move',
  BRUSH = 'brush',
  ERASER = 'eraser',
  TEXT = 'text',
  SHAPE = 'shape',
  CROP = 'crop',
  FILTER = 'filter',
  STICKER = 'sticker',
  SELECT = 'select',
}

export enum ShapeType {
  RECTANGLE = 'rectangle',
  CIRCLE = 'circle',
  LINE = 'line',
  ARROW = 'arrow',
  TRIANGLE = 'triangle',
  STAR = 'star',
  HEART = 'heart',
}

export enum BrushStyle {
  NORMAL = 'normal',
  MARKER = 'marker',
  SPRAY = 'spray',
  PENCIL = 'pencil',
  CALIGRAPHY = 'caligraphy',
}

export interface EditorPoint {
  x: number;
  y: number;
}

export interface EditorDimensions {
  width: number;
  height: number;
}

export interface EditorStroke {
  points: EditorPoint[];
  color: string;
  size: number;
  style: BrushStyle;
  opacity: number;
}

export interface EditorShape {
  type: ShapeType;
  startPoint: EditorPoint;
  endPoint: EditorPoint;
  color: string;
  strokeWidth: number;
  fillColor?: string;
  opacity: number;
  rotation?: number;
}

export interface EditorText {
  id: string;
  text: string;
  position: EditorPoint;
  fontSize: number;
  fontFamily: string;
  color: string;
  backgroundColor?: string;
  rotation: number;
  opacity: number;
  maxWidth?: number;
  textAlign: 'left' | 'center' | 'right';
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
}

export interface EditorSticker {
  id: string;
  uri: string;
  position: EditorPoint;
  size: EditorDimensions;
  rotation: number;
  opacity: number;
  scale: number;
}

export interface EditorLayer {
  id: string;
  name: string;
  visible: boolean;
  opacity: number;
  locked: boolean;
  elements: Array<{
    type: 'stroke' | 'shape' | 'text' | 'sticker';
    data: EditorStroke | EditorShape | EditorText | EditorSticker;
  }>;
}

export interface EditorSelection {
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  elements: string[];
}

export interface EditorHistory {
  id: string;
  timestamp: Date;
  layers: EditorLayer[];
  thumbnail?: string;
}

export interface EditorCropArea {
  x: number;
  y: number;
  width: number;
  height: number;
  aspectRatio?: number;
}

export interface EditorFilter {
  type: string;
  intensity: number;
  preview?: string;
}

export interface EditorState {
  originalUri: string;
  currentUri?: string;
  tool: EditorTool;
  selectedLayer?: string;
  layers: EditorLayer[];
  history: EditorHistory[];
  historyIndex: number;
  selection?: EditorSelection;
  cropArea?: EditorCropArea;
  activeFilter?: EditorFilter;
  isDirty: boolean;
  dimensions: EditorDimensions;
  zoom: number;
  pan: EditorPoint;
}

export interface EditorOptions {
  maxLayers?: number;
  maxHistory?: number;
  enableUndo?: boolean;
  enableRedo?: boolean;
  enableFilters?: boolean;
  enableShapes?: boolean;
  enableText?: boolean;
  enableStickers?: boolean;
  enableCrop?: boolean;
  brushSizeRange?: [number, number];
  strokeWidthRange?: [number, number];
  fontSizeRange?: [number, number];
  defaultColors?: string[];
  stickerPacks?: string[];
  customFonts?: string[];
}

export interface EditorEvent {
  type: 'toolChange' | 'layerAdd' | 'layerRemove' | 'layerUpdate' | 'selectionChange' | 'historyChange';
  data: any;
}

export interface EditorExportOptions {
  format: 'jpeg' | 'png' | 'webp';
  quality: number;
  backgroundColor?: string;
  includeHiddenLayers?: boolean;
  flattenLayers?: boolean;
  maxSize?: number;
}