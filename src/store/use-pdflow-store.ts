import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FileOperation {
  id: string;
  toolName: string;
  toolSlug: string;
  inputFileName: string;
  inputFileSize: number;
  outputFileName: string;
  outputFileSize: number;
  timestamp: number;
  inputFileDataUrl?: string; // Base64 data url for recovery/undo
  outputFileDataUrl?: string; // Base64 output data url
}

interface PDFlowState {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  history: FileOperation[];
  addHistoryItem: (item: Omit<FileOperation, 'id' | 'timestamp'>) => void;
  clearHistory: () => void;
  undoStack: FileOperation[];
  pushToUndo: (item: FileOperation) => void;
  popFromUndo: () => FileOperation | undefined;
  clearUndoStack: () => void;
  activeWorkflowFile: { file: File; sourceTool: string } | null;
  setActiveWorkflowFile: (workflow: { file: File; sourceTool: string } | null) => void;
}

export const usePDFlowStore = create<PDFlowState>()(
  persist(
    (set, get) => ({
      theme: 'dark', // Premium dark mode by default
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((state) => {
        const newTheme = state.theme === 'light' ? 'dark' : 'light';
        // Add class to document element for Tailwind v4 selector nesting
        if (typeof window !== 'undefined') {
          const root = window.document.documentElement;
          root.classList.remove('light', 'dark');
          root.classList.add(newTheme);
        }
        return { theme: newTheme };
      }),
      history: [],
      addHistoryItem: (item) => {
        const newItem: FileOperation = {
          ...item,
          id: Math.random().toString(36).substring(2, 9),
          timestamp: Date.now(),
        };
        set((state) => ({
          history: [newItem, ...state.history].slice(0, 50), // Limit history to last 50 items
        }));
      },
      clearHistory: () => set({ history: [] }),
      undoStack: [],
      pushToUndo: (item) => set((state) => ({ undoStack: [...state.undoStack, item] })),
      popFromUndo: () => {
        const { undoStack } = get();
        if (undoStack.length === 0) return undefined;
        const popped = undoStack[undoStack.length - 1];
        set({ undoStack: undoStack.slice(0, -1) });
        return popped;
      },
      clearUndoStack: () => set({ undoStack: [] }),
      activeWorkflowFile: null,
      setActiveWorkflowFile: (activeWorkflowFile) => set({ activeWorkflowFile }),
    }),
    {
      name: 'pdflow-storage',
      partialize: (state) => ({
        theme: state.theme,
        history: state.history.map((item) => ({
          id: item.id,
          toolName: item.toolName,
          toolSlug: item.toolSlug,
          inputFileName: item.inputFileName,
          inputFileSize: item.inputFileSize,
          outputFileName: item.outputFileName,
          outputFileSize: item.outputFileSize,
          timestamp: item.timestamp,
        })),
      }),
    }
  )
);
