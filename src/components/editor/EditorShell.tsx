'use client';

import React, { useEffect, useCallback, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useEditorStore } from '@/stores/editor-store';
import { saveProject } from '@/lib/editor-db';
import EditorNavbar from './EditorNavbar';
import PagesSidebar from './PagesSidebar';
import EditorCanvas from './EditorCanvas';
import ToolsSidebar from './ToolsSidebar';
import FloatingToolbar from './FloatingToolbar';
import ZoomControls from './ZoomControls';
import ExportPanel from './panels/ExportPanel';
import type { PageData } from '@/types/editor';

interface EditorShellProps {
  onInsertPdf?: (files: File[]) => void;
}

export default function EditorShell({ onInsertPdf }: EditorShellProps) {
  const pdfBytes = useEditorStore((s) => s.pdfBytes);
  const isDirty = useEditorStore((s) => s.isDirty);
  const projectId = useEditorStore((s) => s.projectId);
  const projectName = useEditorStore((s) => s.projectName);
  const fileName = useEditorStore((s) => s.fileName);
  const annotations = useEditorStore((s) => s.annotations);
  const pageOrder = useEditorStore((s) => s.pageOrder);
  const pages = useEditorStore((s) => s.pages);
  const markSaved = useEditorStore((s) => s.markSaved);
  const setProjectId = useEditorStore((s) => s.setProjectId);
  const setAutoSaving = useEditorStore((s) => s.setAutoSaving);
  const isExportPanelOpen = useEditorStore((s) => s.isExportPanelOpen);
  const toggleExportPanel = useEditorStore((s) => s.toggleExportPanel);

  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // ---- Keyboard Shortcuts ----
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        useEditorStore.temporal.getState().undo();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'Z' || e.key === 'y') && (e.shiftKey || e.key === 'y')) {
        e.preventDefault();
        useEditorStore.temporal.getState().redo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pdfBytes, annotations, pageOrder, pages, projectId, projectName, fileName]);

  // ---- Autosave (every 30 seconds) ----
  useEffect(() => {
    autoSaveTimerRef.current = setInterval(() => {
      if (isDirty && pdfBytes) {
        handleSave(true);
      }
    }, 30000);

    return () => {
      if (autoSaveTimerRef.current) clearInterval(autoSaveTimerRef.current);
    };
  }, [isDirty, pdfBytes, annotations, pageOrder, pages, projectId, projectName, fileName]);

  // ---- Save Function ----
  const handleSave = useCallback(
    async (isAuto = false) => {
      if (!pdfBytes) return;

      try {
        if (isAuto) setAutoSaving(true);

        const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
        const id = await saveProject(
          projectName,
          blob,
          fileName,
          JSON.stringify(annotations),
          JSON.stringify(pageOrder),
          JSON.stringify(pages),
          projectId ?? undefined,
        );

        setProjectId(id);
        markSaved();
      } catch (err) {
        console.error('Save failed:', err);
      }
    },
    [pdfBytes, projectName, fileName, annotations, pageOrder, pages, projectId, markSaved, setProjectId, setAutoSaving],
  );

  // ---- Quick Download (current PDF as-is) ----
  const handleDownload = useCallback(() => {
    if (!pdfBytes) return;
    const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName || 'document.pdf';
    a.click();
    URL.revokeObjectURL(url);
  }, [pdfBytes, fileName]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-white dark:bg-neutral-950">
      {/* Top Navbar */}
      <EditorNavbar
        onSave={() => handleSave(false)}
        onExport={toggleExportPanel}
        onDownload={handleDownload}
        onInsertPdf={onInsertPdf}
      />

      {/* Main Content: Sidebar + Canvas + Tools */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left: Pages Sidebar — hidden on mobile */}
        <AnimatePresence>
          <PagesSidebar onInsertPdf={onInsertPdf} />
        </AnimatePresence>

        {/* Center: PDF Canvas */}
        <EditorCanvas />

        {/* Right: Tools Sidebar */}
        <ToolsSidebar />
      </div>

      {/* Bottom: Zoom Controls — inside layout flow */}
      <ZoomControls />

      {/* Floating Toolbar */}
      <AnimatePresence>
        <FloatingToolbar />
      </AnimatePresence>

      {/* Export Panel Overlay */}
      <AnimatePresence>
        {isExportPanelOpen && <ExportPanel />}
      </AnimatePresence>
    </div>
  );
}
