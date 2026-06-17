// ============================================
// PDF Editor Pro — Zustand Store with Undo/Redo
// ============================================
import { create } from 'zustand';
import { temporal } from 'zundo';
import type {
  Annotation,
  PageData,
  ToolType,
  TextSettings,
  DrawSettings,
  HighlightSettings,
  ShapeSettings,
  DEFAULT_TEXT_SETTINGS,
  DEFAULT_DRAW_SETTINGS,
  DEFAULT_HIGHLIGHT_SETTINGS,
  DEFAULT_SHAPE_SETTINGS,
} from '@/types/editor';

// Re-import defaults as values
const defaultTextSettings: TextSettings = {
  fontFamily: 'Inter', fontSize: 16, fontColor: '#000000',
  bold: false, italic: false, underline: false, letterSpacing: 0, alignment: 'left',
};
const defaultDrawSettings: DrawSettings = {
  brushType: 'pen', brushSize: 3, color: '#000000', opacity: 1,
};
const defaultHighlightSettings: HighlightSettings = {
  color: '#FFEB3B', opacity: 0.3,
};
const defaultShapeSettings: ShapeSettings = {
  shapeType: 'rectangle', strokeColor: '#000000', fillColor: 'transparent', strokeWidth: 2,
};

// ---- Tracked State (undo/redo) ----
interface TrackedState {
  annotations: Record<string, Annotation[]>;   // pageId → annotations
  pageOrder: string[];                          // Ordered page IDs
  pages: PageData[];                            // Page metadata
}

// ---- Full Editor State ----
interface EditorState extends TrackedState {
  // Document
  pdfBytes: Uint8Array | null;
  fileName: string;

  // Active editing
  activeTool: ToolType;
  activePageId: string | null;
  selectedAnnotationId: string | null;

  // Tool settings
  textSettings: TextSettings;
  drawSettings: DrawSettings;
  highlightSettings: HighlightSettings;
  shapeSettings: ShapeSettings;

  // Viewport
  zoom: number;

  // Project
  projectId: number | null;
  projectName: string;
  lastSavedAt: Date | null;
  isDirty: boolean;
  isAutoSaving: boolean;

  // UI State
  isExportPanelOpen: boolean;
  isSavePanelOpen: boolean;
  isPagesSidebarOpen: boolean;
  isToolsSidebarOpen: boolean;

  // ---- Actions ----

  // Document
  setPdfBytes: (bytes: Uint8Array, fileName: string) => void;
  reset: () => void;

  // Pages
  setPages: (pages: PageData[]) => void;
  setPageOrder: (order: string[]) => void;
  rotatePage: (pageId: string, degrees: 90 | -90 | 180) => void;
  deletePage: (pageId: string) => void;
  duplicatePage: (pageId: string) => void;

  // Annotations
  addAnnotation: (pageId: string, annotation: Annotation) => void;
  updateAnnotation: (pageId: string, annotationId: string, updates: Partial<Annotation>) => void;
  deleteAnnotation: (pageId: string, annotationId: string) => void;
  setAnnotations: (pageId: string, annotations: Annotation[]) => void;

  // Selection
  setActiveTool: (tool: ToolType) => void;
  setActivePageId: (pageId: string | null) => void;
  setSelectedAnnotation: (annotationId: string | null) => void;

  // Tool settings
  setTextSettings: (settings: Partial<TextSettings>) => void;
  setDrawSettings: (settings: Partial<DrawSettings>) => void;
  setHighlightSettings: (settings: Partial<HighlightSettings>) => void;
  setShapeSettings: (settings: Partial<ShapeSettings>) => void;

  // Viewport
  setZoom: (zoom: number) => void;

  // Project
  setProjectId: (id: number | null) => void;
  setProjectName: (name: string) => void;
  markSaved: () => void;
  markDirty: () => void;
  setAutoSaving: (saving: boolean) => void;

  // UI
  toggleExportPanel: () => void;
  toggleSavePanel: () => void;
  togglePagesSidebar: () => void;
  toggleToolsSidebar: () => void;
}

const initialTrackedState: TrackedState = {
  annotations: {},
  pageOrder: [],
  pages: [],
};

export const useEditorStore = create<EditorState>()(
  temporal(
    (set, get) => ({
      // ---- Initial State ----
      ...initialTrackedState,
      pdfBytes: null,
      fileName: '',
      activeTool: 'select',
      activePageId: null,
      selectedAnnotationId: null,
      textSettings: { ...defaultTextSettings },
      drawSettings: { ...defaultDrawSettings },
      highlightSettings: { ...defaultHighlightSettings },
      shapeSettings: { ...defaultShapeSettings },
      zoom: 1,
      projectId: null,
      projectName: 'Untitled Project',
      lastSavedAt: null,
      isDirty: false,
      isAutoSaving: false,
      isExportPanelOpen: false,
      isSavePanelOpen: false,
      isPagesSidebarOpen: true,
      isToolsSidebarOpen: true,

      // ---- Document Actions ----
      setPdfBytes: (bytes, fileName) => set({
        pdfBytes: bytes,
        fileName,
        isDirty: true,
      }),

      reset: () => set({
        ...initialTrackedState,
        pdfBytes: null,
        fileName: '',
        activeTool: 'select',
        activePageId: null,
        selectedAnnotationId: null,
        zoom: 1,
        projectId: null,
        projectName: 'Untitled Project',
        lastSavedAt: null,
        isDirty: false,
        isAutoSaving: false,
        isExportPanelOpen: false,
        isSavePanelOpen: false,
      }),

      // ---- Page Actions ----
      setPages: (pages) => set({ pages, isDirty: true }),

      setPageOrder: (pageOrder) => set({ pageOrder, isDirty: true }),

      rotatePage: (pageId, degrees) => set((state) => ({
        pages: state.pages.map((p) =>
          p.id === pageId
            ? { ...p, rotation: (((p.rotation + degrees) % 360 + 360) % 360) as PageData['rotation'] }
            : p
        ),
        isDirty: true,
      })),

      deletePage: (pageId) => set((state) => ({
        pages: state.pages.map((p) =>
          p.id === pageId ? { ...p, deleted: true } : p
        ),
        pageOrder: state.pageOrder.filter((id) => id !== pageId),
        activePageId: state.activePageId === pageId ? null : state.activePageId,
        isDirty: true,
      })),

      duplicatePage: (pageId) => {
        const state = get();
        const page = state.pages.find((p) => p.id === pageId);
        if (!page) return;

        const newId = `page-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const newPage: PageData = { ...page, id: newId, thumbnailUrl: page.thumbnailUrl };
        const insertIndex = state.pageOrder.indexOf(pageId) + 1;
        const newOrder = [...state.pageOrder];
        newOrder.splice(insertIndex, 0, newId);

        // Copy annotations from original page
        const originalAnnotations = state.annotations[pageId] || [];
        const copiedAnnotations = originalAnnotations.map((a) => ({
          ...a,
          id: `ann-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          pageId: newId,
        }));

        set({
          pages: [...state.pages, newPage],
          pageOrder: newOrder,
          annotations: { ...state.annotations, [newId]: copiedAnnotations },
          isDirty: true,
        });
      },

      // ---- Annotation Actions ----
      addAnnotation: (pageId, annotation) => set((state) => ({
        annotations: {
          ...state.annotations,
          [pageId]: [...(state.annotations[pageId] || []), annotation],
        },
        isDirty: true,
      })),

      updateAnnotation: (pageId, annotationId, updates) => set((state) => ({
        annotations: {
          ...state.annotations,
          [pageId]: (state.annotations[pageId] || []).map((a) =>
            a.id === annotationId ? ({ ...a, ...updates } as Annotation) : a
          ),
        },
        isDirty: true,
      })),

      deleteAnnotation: (pageId, annotationId) => set((state) => ({
        annotations: {
          ...state.annotations,
          [pageId]: (state.annotations[pageId] || []).filter(
            (a) => a.id !== annotationId
          ),
        },
        selectedAnnotationId:
          state.selectedAnnotationId === annotationId ? null : state.selectedAnnotationId,
        isDirty: true,
      })),

      setAnnotations: (pageId, annotations) => set((state) => ({
        annotations: { ...state.annotations, [pageId]: annotations },
        isDirty: true,
      })),

      // ---- Selection Actions ----
      setActiveTool: (tool) => set({ activeTool: tool, selectedAnnotationId: null }),
      setActivePageId: (pageId) => set({ activePageId: pageId }),
      setSelectedAnnotation: (annotationId) => set({ selectedAnnotationId: annotationId }),

      // ---- Tool Settings ----
      setTextSettings: (settings) => set((state) => ({
        textSettings: { ...state.textSettings, ...settings },
      })),
      setDrawSettings: (settings) => set((state) => ({
        drawSettings: { ...state.drawSettings, ...settings },
      })),
      setHighlightSettings: (settings) => set((state) => ({
        highlightSettings: { ...state.highlightSettings, ...settings },
      })),
      setShapeSettings: (settings) => set((state) => ({
        shapeSettings: { ...state.shapeSettings, ...settings },
      })),

      // ---- Viewport ----
      setZoom: (zoom) => set({ zoom: Math.max(0.25, Math.min(4, zoom)) }),

      // ---- Project ----
      setProjectId: (id) => set({ projectId: id }),
      setProjectName: (name) => set({ projectName: name, isDirty: true }),
      markSaved: () => set({ lastSavedAt: new Date(), isDirty: false, isAutoSaving: false }),
      markDirty: () => set({ isDirty: true }),
      setAutoSaving: (saving) => set({ isAutoSaving: saving }),

      // ---- UI ----
      toggleExportPanel: () => set((s) => ({ isExportPanelOpen: !s.isExportPanelOpen })),
      toggleSavePanel: () => set((s) => ({ isSavePanelOpen: !s.isSavePanelOpen })),
      togglePagesSidebar: () => set((s) => ({ isPagesSidebarOpen: !s.isPagesSidebarOpen })),
      toggleToolsSidebar: () => set((s) => ({ isToolsSidebarOpen: !s.isToolsSidebarOpen })),
    }),
    {
      // Only track annotations, pageOrder, pages for undo/redo
      partialize: (state) => ({
        annotations: state.annotations,
        pageOrder: state.pageOrder,
        pages: state.pages,
      }),
      limit: 50,
      equality: (a, b) => JSON.stringify(a) === JSON.stringify(b),
    }
  )
);
