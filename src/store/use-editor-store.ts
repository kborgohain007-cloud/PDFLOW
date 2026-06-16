import { create } from 'zustand';
import { produce } from 'immer';

// ─── Types ───────────────────────────────────────────────────────────

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
  points: number[];
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
  id: string;
  documentId: string;
  originalPageIndex: number;
  rotation: number;
  width: number;
  height: number;
  thumbnailUrl: string | null;
  operations: CanvasOperation[];
}

interface HistorySnapshot {
  pages: PageState[];
}

// ─── Store Interface ─────────────────────────────────────────────────

interface EditorStore {
  documents: EditorDocument[];
  pages: PageState[];
  activePageId: string | null;
  zoomLevel: number;
  activeTool: ToolType;

  toolSettings: {
    strokeColor: string;
    strokeWidth: number;
    fontSize: number;
    fontFamily: string;
    textColor: string;
    opacity: number;
  };

  // Undo/Redo
  past: HistorySnapshot[];
  future: HistorySnapshot[];

  // Document actions
  addDocument: (doc: EditorDocument, pages: PageState[]) => void;

  // Navigation
  setActivePage: (id: string) => void;
  setActiveTool: (tool: ToolType) => void;
  setZoom: (level: number) => void;
  updateToolSettings: (patch: Partial<EditorStore['toolSettings']>) => void;

  // Page mutations
  reorderPages: (from: number, to: number) => void;
  deletePage: (id: string) => void;
  rotatePage: (id: string, degrees: number) => void;

  // Canvas operations
  addOperation: (pageId: string, op: CanvasOperation) => void;
  updateOperation: (pageId: string, opId: string, patch: Partial<CanvasOperation>) => void;
  deleteOperation: (pageId: string, opId: string) => void;

  // History
  undo: () => void;
  redo: () => void;
}

// ─── Helpers ─────────────────────────────────────────────────────────

const MAX_HISTORY = 40;

function pushHistory(state: EditorStore): void {
  const snapshot: HistorySnapshot = {
    pages: JSON.parse(JSON.stringify(state.pages)),
  };
  state.past.push(snapshot);
  state.future = [];
  if (state.past.length > MAX_HISTORY) state.past.shift();
}

// ─── Store ───────────────────────────────────────────────────────────

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

  // ── Document ─────────────────────────────────────────────────────

  addDocument: (doc, initPages) =>
    set(
      produce((s: EditorStore) => {
        pushHistory(s);
        s.documents.push(doc);
        s.pages.push(...initPages);
        if (!s.activePageId && initPages.length > 0) {
          s.activePageId = initPages[0].id;
        }
      }),
    ),

  // ── Navigation ───────────────────────────────────────────────────

  setActivePage: (id) => set({ activePageId: id }),
  setActiveTool: (tool) => set({ activeTool: tool }),
  setZoom: (level) => set({ zoomLevel: Math.max(10, Math.min(500, level)) }),

  updateToolSettings: (patch) =>
    set(
      produce((s: EditorStore) => {
        Object.assign(s.toolSettings, patch);
      }),
    ),

  // ── Page mutations ───────────────────────────────────────────────

  reorderPages: (from, to) =>
    set(
      produce((s: EditorStore) => {
        pushHistory(s);
        const [moved] = s.pages.splice(from, 1);
        s.pages.splice(to, 0, moved);
      }),
    ),

  deletePage: (id) =>
    set(
      produce((s: EditorStore) => {
        pushHistory(s);
        s.pages = s.pages.filter((p) => p.id !== id);
        if (s.activePageId === id) {
          s.activePageId = s.pages[0]?.id ?? null;
        }
      }),
    ),

  rotatePage: (id, deg) =>
    set(
      produce((s: EditorStore) => {
        pushHistory(s);
        const page = s.pages.find((p) => p.id === id);
        if (page) page.rotation = (page.rotation + deg) % 360;
      }),
    ),

  // ── Canvas operations ────────────────────────────────────────────

  addOperation: (pageId, op) =>
    set(
      produce((s: EditorStore) => {
        pushHistory(s);
        const page = s.pages.find((p) => p.id === pageId);
        if (page) page.operations.push(op);
      }),
    ),

  updateOperation: (pageId, opId, patch) =>
    set(
      produce((s: EditorStore) => {
        // No history push on every mousemove — callers should push on dragEnd
        const page = s.pages.find((p) => p.id === pageId);
        if (!page) return;
        const idx = page.operations.findIndex((o) => o.id === opId);
        if (idx !== -1) {
          page.operations[idx] = { ...page.operations[idx], ...patch } as CanvasOperation;
        }
      }),
    ),

  deleteOperation: (pageId, opId) =>
    set(
      produce((s: EditorStore) => {
        pushHistory(s);
        const page = s.pages.find((p) => p.id === pageId);
        if (page) {
          page.operations = page.operations.filter((o) => o.id !== opId);
        }
      }),
    ),

  // ── History ──────────────────────────────────────────────────────

  undo: () =>
    set(
      produce((s: EditorStore) => {
        if (s.past.length === 0) return;
        const prev = s.past.pop()!;
        s.future.push({ pages: JSON.parse(JSON.stringify(s.pages)) });
        s.pages = prev.pages;
      }),
    ),

  redo: () =>
    set(
      produce((s: EditorStore) => {
        if (s.future.length === 0) return;
        const next = s.future.pop()!;
        s.past.push({ pages: JSON.parse(JSON.stringify(s.pages)) });
        s.pages = next.pages;
      }),
    ),
}));
