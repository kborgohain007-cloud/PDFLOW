'use client';

import React, { useState, useCallback } from 'react';
import { useEditorStore } from '@/stores/editor-store';
import { loadProject } from '@/lib/editor-db';
import type { PageData } from '@/types/editor';
import dynamic from 'next/dynamic';

// Dynamic import for EditorUpload (lightweight initial load)
const EditorUpload = dynamic(() => import('@/components/editor/EditorUpload'), { ssr: false });
// Dynamic import for EditorShell (heavy — loads Konva, PDF.js, etc.)
const EditorShell = dynamic(() => import('@/components/editor/EditorShell'), { ssr: false });

export default function EditorPage() {
  const pdfBytes = useEditorStore((s) => s.pdfBytes);
  const setPdfBytes = useEditorStore((s) => s.setPdfBytes);
  const setPages = useEditorStore((s) => s.setPages);
  const setPageOrder = useEditorStore((s) => s.setPageOrder);
  const setProjectId = useEditorStore((s) => s.setProjectId);
  const setProjectName = useEditorStore((s) => s.setProjectName);
  const setAnnotations = useEditorStore((s) => s.setAnnotations);
  const reset = useEditorStore((s) => s.reset);

  const [isLoading, setIsLoading] = useState(false);

  // ---- Load PDF from Files ----
  const handleFilesSelected = useCallback(async (files: File[]) => {
    if (files.length === 0) return;
    setIsLoading(true);

    try {
      let combinedBytes: Uint8Array;
      let combinedName: string;

      if (files.length === 1) {
        // Single file
        const buffer = await files[0].arrayBuffer();
        combinedBytes = new Uint8Array(buffer);
        combinedName = files[0].name;
      } else {
        // Multiple files — merge using pdf-lib
        const { PDFDocument } = await import('pdf-lib');
        const mergedPdf = await PDFDocument.create();

        for (const file of files) {
          const buffer = await file.arrayBuffer();
          const srcPdf = await PDFDocument.load(buffer);
          const copiedPages = await mergedPdf.copyPages(srcPdf, srcPdf.getPageIndices());
          copiedPages.forEach((page) => mergedPdf.addPage(page));
        }

        const mergedBytes = await mergedPdf.save();
        combinedBytes = new Uint8Array(mergedBytes);
        combinedName = 'merged_document.pdf';
      }

      // Initialize editor with PDF
      await initializeEditor(combinedBytes, combinedName);
    } catch (err) {
      console.error('Error loading files:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ---- Load Project from IndexedDB ----
  const handleProjectSelected = useCallback(async (projectId: number) => {
    setIsLoading(true);

    try {
      const data = await loadProject(projectId);
      if (!data || !data.file || !data.snapshot) {
        console.error('Project data not found');
        return;
      }

      // Restore PDF bytes
      const buffer = await data.file.pdfBlob.arrayBuffer();
      const bytes = new Uint8Array(buffer);

      // Restore state
      setPdfBytes(bytes, data.file.filename);
      setProjectId(projectId);
      setProjectName(data.project.name);

      // Restore pages and annotations from snapshot
      const pages: PageData[] = JSON.parse(data.snapshot.pages);
      const pageOrder: string[] = JSON.parse(data.snapshot.pageOrder);
      const annotations: Record<string, any[]> = JSON.parse(data.snapshot.annotations);

      setPages(pages);
      setPageOrder(pageOrder);

      for (const [pageId, anns] of Object.entries(annotations)) {
        setAnnotations(pageId, anns);
      }

      // Generate thumbnails
      await generateThumbnails(bytes, pages);
    } catch (err) {
      console.error('Error loading project:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ---- Initialize Editor (from raw PDF bytes) ----
  async function initializeEditor(bytes: Uint8Array, fileName: string) {
    reset();
    setPdfBytes(bytes, fileName);

    // Parse PDF to get page dimensions
    const pdfjsLib = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

    const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
    const pages: PageData[] = [];

    for (let i = 0; i < pdf.numPages; i++) {
      const page = await pdf.getPage(i + 1);
      const viewport = page.getViewport({ scale: 1 });

      pages.push({
        id: `page-${i}-${Date.now()}`,
        pageIndex: i,
        width: viewport.width,
        height: viewport.height,
        rotation: 0,
        deleted: false,
        thumbnailUrl: null,
      });
    }

    setPages(pages);
    setPageOrder(pages.map((p) => p.id));
    setProjectName(fileName.replace('.pdf', ''));

    // Set first page as active
    if (pages.length > 0) {
      useEditorStore.getState().setActivePageId(pages[0].id);
    }

    // Generate thumbnails in background
    await generateThumbnails(bytes, pages);
  }

  // ---- Generate Thumbnails ----
  async function generateThumbnails(bytes: Uint8Array, pages: PageData[]) {
    const pdfjsLib = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

    const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;

    for (const pageData of pages) {
      const page = await pdf.getPage(pageData.pageIndex + 1);
      const viewport = page.getViewport({ scale: 0.3 });

      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d')!;
      await page.render({ canvas, canvasContext: ctx, viewport } as any).promise;

      const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.6);

      // Update the page with thumbnail
      useEditorStore.getState().setPages(
        useEditorStore.getState().pages.map((p) =>
          p.id === pageData.id ? { ...p, thumbnailUrl } : p
        )
      );
    }
  }

  // Show upload screen if no PDF is loaded
  if (!pdfBytes) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 pt-[72px]">
        <EditorUpload
          onFilesSelected={handleFilesSelected}
          onProjectSelected={handleProjectSelected}
        />
      </div>
    );
  }

  // Show full editor
  return <EditorShell />;
}
