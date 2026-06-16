import { create } from 'zustand';
import { produce } from 'immer';

export type ToolType = 'select' | 'text' | 'draw' | 'highlight' | 'eraser';

export interface EditorDocument {
  id: string;
  name: string;
  originalBuffer: ArrayBuffer;
  pageCount: number;
}

export interface DrawingOperation {
  id: string;
  type: 'draw' | 'highlight';
  points: number[]; // Flat array of [x1, y1, x2, y2, ...]
  stroke: string;
  strokeWidth: number;
  opacity: number;
}

export interface TextOperation {
  id: string;
  type: 'text';
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  fill: string;
  isBold?: boolean;
  isItalic?: boolean;
}

export type CanvasOperation = DrawingOperation | TextOperation;

export interface PageState {
  id: string; // unique id for dnd-kit
  documentId: string; // references EditorDocument
  originalPageIndex: number; // 0-based
  rotation: number;
  width: number; // base width
  height: number; // base height
  thumbnailUrl: string | null;
  operations: CanvasOperation[];
}

export interface EditorHistoryState {
  pages: PageState[];
}

interface EditorStore {
  // Document State
  documents: EditorDocument[];
  pages: PageState[];
  activePageId: string | null;
  
  // Viewport State
  zoomLevel: number;
  
  // Tool State
  activeTool: ToolType;
  toolSettings: {
    strokeColor: string;
    strokeWidth: number;
    fontSize: number;
    fontFamily: string;
    textColor: string;
    opacity: number;
  };
  
  // History Stack (Undo/Redo)
  past: EditorHistoryState[];
  future: EditorHistoryState[];
  
  // Actions
  addDocument: (doc: EditorDocument, initPages: PageState[]) => void;
  setActivePage: (pageId: string) => void;
  setActiveTool: (tool: ToolType) => void;
  setZoom: (zoom: number) => void;
  updateToolSettings: (settings: Partial<EditorStore['toolSettings']>) => void;
  
  // Page Operations
  reorderPages: (startIndex: number, endIndex: number) => void;
  deletePage: (pageId: string) => void;
  rotatePage: (pageId: string, angle: number) => void; // angle is cumulative
  
  // Canvas Operations
  addOperation: (pageId: string, op: CanvasOperation) => void;
  updateOperation: (pageId: string, opId: string, changes: Partial<CanvasOperation>) => void;
  deleteOperation: (pageId: string, opId: string) => void;
  
  // History Actions
  undo: () => void;
  redo: () => void;
}

// Helper to push history
function saveHistory(state: EditorStore) {
  state.past.push({ pages: JSON.parse(JSON.stringify(state.pages)) });
  state.future = [];
  // Keep history manageable
  if (state.past.length > 30) {
    state.past.shift();
  }
}

export const useEditorStore = create<EditorStore>((set) => ({
  documents: [],
  pages: [],
  activePageId: null,
  zoomLevel: 100,
  activeTool: 'select',
  toolSettings: {
    strokeColor: '#ef4444',
    strokeWidth: 4,
    fontSize: 20,
    fontFamily: 'Helvetica',
    textColor: '#000000',
    opacity: 1,
  },
  past: [],
  future: [],

  addDocument: (doc, initPages) => set(produce((state: EditorStore) => {
    saveHistory(state);
    state.documents.push(doc);
    state.pages.push(...initPages);
    if (!state.activePageId && initPages.length > 0) {
      state.activePageId = initPages[0].id;
    }
  })),

  setActivePage: (pageId) => set({ activePageId: pageId }),
  setActiveTool: (tool) => set({ activeTool: tool }),
  setZoom: (zoom) => set({ zoomLevel: Math.max(10, Math.min(500, zoom)) }),
  updateToolSettings: (settings) => set(produce((state: EditorStore) => {
    state.toolSettings = { ...state.toolSettings, ...settings };
  })),

  reorderPages: (startIndex, endIndex) => set(produce((state: EditorStore) => {
    saveHistory(state);
    const result = Array.from(state.pages);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    state.pages = result;
  })),

  deletePage: (pageId) => set(produce((state: EditorStore) => {
    saveHistory(state);
    state.pages = state.pages.filter(p => p.id !== pageId);
    if (state.activePageId === pageId) {
      state.activePageId = state.pages.length > 0 ? state.pages[0].id : null;
    }
  })),

  rotatePage: (pageId, angle) => set(produce((state: EditorStore) => {
    saveHistory(state);
    const page = state.pages.find(p => p.id === pageId);
    if (page) {
      page.rotation = (page.rotation + angle) % 360;
    }
  })),

  addOperation: (pageId, op) => set(produce((state: EditorStore) => {
    saveHistory(state);
    const page = state.pages.find(p => p.id === pageId);
    if (page) page.operations.push(op);
  })),

  updateOperation: (pageId, opId, changes) => set(produce((state: EditorStore) => {
    // Note: Do not saveHistory on EVERY mousemove update to avoid 1000 history entries.
    // History saves for updates should be done carefully at the component level on DragEnd.
    const page = state.pages.find(p => p.id === pageId);
    if (page) {
      const opIndex = page.operations.findIndex(o => o.id === opId);
      if (opIndex !== -1) {
        page.operations[opIndex] = { ...page.operations[opIndex], ...changes } as CanvasOperation;
      }
    }
  })),

  deleteOperation: (pageId, opId) => set(produce((state: EditorStore) => {
    saveHistory(state);
    const page = state.pages.find(p => p.id === pageId);
    if (page) {
      page.operations = page.operations.filter(o => o.id !== opId);
    }
  })),

  undo: () => set(produce((state: EditorStore) => {
    if (state.past.length === 0) return;
    const previous = state.past.pop()!;
    state.future.push({ pages: JSON.parse(JSON.stringify(state.pages)) });
    state.pages = previous.pages;
  })),

  redo: () => set(produce((state: EditorStore) => {
    if (state.future.length === 0) return;
    const next = state.future.pop()!;
    state.past.push({ pages: JSON.parse(JSON.stringify(state.pages)) });
    state.pages = next.pages;
  })),

}));
