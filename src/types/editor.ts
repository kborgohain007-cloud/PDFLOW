// ============================================
// PDF Editor Pro — Type Definitions
// ============================================

export type AnnotationType = 'text' | 'draw' | 'highlight' | 'shape' | 'image';
export type ToolType = 'select' | 'text' | 'draw' | 'highlight' | 'shape' | 'eraser';
export type ShapeType = 'rectangle' | 'circle' | 'arrow' | 'line';
export type BrushType = 'pen' | 'marker';
export type ExportFormat = 'pdf-flat' | 'pdf-editable' | 'image-zip';
export type ExportQuality = 'high' | 'balanced' | 'small';

// ---- Annotation Types ----

export interface BaseAnnotation {
  id: string;
  type: AnnotationType;
  pageId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  zIndex: number;
  locked: boolean;
}

export interface TextAnnotation extends BaseAnnotation {
  type: 'text';
  text: string;
  fontFamily: string;
  fontSize: number;
  fontColor: string;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  letterSpacing: number;
  alignment: 'left' | 'center' | 'right';
}

export interface DrawAnnotation extends BaseAnnotation {
  type: 'draw';
  points: number[];          // Flattened [x1, y1, x2, y2, ...]
  strokeColor: string;
  strokeWidth: number;
  brushType: BrushType;
}

export interface HighlightAnnotation extends BaseAnnotation {
  type: 'highlight';
  color: string;
}

export interface ShapeAnnotation extends BaseAnnotation {
  type: 'shape';
  shapeType: ShapeType;
  strokeColor: string;
  fillColor: string;
  strokeWidth: number;
}

export interface ImageAnnotation extends BaseAnnotation {
  type: 'image';
  imageData: string;         // Base64 data URL
}

export type Annotation =
  | TextAnnotation
  | DrawAnnotation
  | HighlightAnnotation
  | ShapeAnnotation
  | ImageAnnotation;

// ---- Page Types ----

export interface PageData {
  id: string;
  pageIndex: number;         // Original index in the PDF
  width: number;
  height: number;
  rotation: 0 | 90 | 180 | 270;
  deleted: boolean;
  thumbnailUrl: string | null;
}

// ---- Tool Settings ----

export interface TextSettings {
  fontFamily: string;
  fontSize: number;
  fontColor: string;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  letterSpacing: number;
  alignment: 'left' | 'center' | 'right';
}

export interface DrawSettings {
  brushType: BrushType;
  brushSize: number;
  color: string;
  opacity: number;
}

export interface HighlightSettings {
  color: string;
  opacity: number;
}

export interface ShapeSettings {
  shapeType: ShapeType;
  strokeColor: string;
  fillColor: string;
  strokeWidth: number;
}

// ---- Project Types ----

export interface EditorProject {
  id?: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  pageCount: number;
}

export interface EditorProjectFile {
  id?: number;
  projectId: number;
  pdfBlob: Blob;
  filename: string;
}

export interface EditorProjectSnapshot {
  id?: number;
  projectId: number;
  annotations: string;       // JSON stringified Record<string, Annotation[]>
  pageOrder: string;         // JSON stringified string[]
  pages: string;             // JSON stringified PageData[]
  timestamp: Date;
}

// ---- Default Settings ----

export const DEFAULT_TEXT_SETTINGS: TextSettings = {
  fontFamily: 'Inter',
  fontSize: 16,
  fontColor: '#000000',
  bold: false,
  italic: false,
  underline: false,
  letterSpacing: 0,
  alignment: 'left',
};

export const DEFAULT_DRAW_SETTINGS: DrawSettings = {
  brushType: 'pen',
  brushSize: 3,
  color: '#000000',
  opacity: 1,
};

export const DEFAULT_HIGHLIGHT_SETTINGS: HighlightSettings = {
  color: '#FFEB3B',
  opacity: 0.3,
};

export const DEFAULT_SHAPE_SETTINGS: ShapeSettings = {
  shapeType: 'rectangle',
  strokeColor: '#000000',
  fillColor: 'transparent',
  strokeWidth: 2,
};

export const AVAILABLE_FONTS = [
  'Inter',
  'Roboto',
  'Arial',
  'Times New Roman',
  'Montserrat',
  'Courier New',
] as const;

export const HIGHLIGHT_COLORS = [
  { name: 'Yellow', value: '#FFEB3B' },
  { name: 'Green', value: '#4CAF50' },
  { name: 'Blue', value: '#2196F3' },
  { name: 'Pink', value: '#E91E63' },
] as const;
