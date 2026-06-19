'use client';

import React, { useState, useCallback, useEffect } from 'react';
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
  const insertPages = useEditorStore((s) => s.insertPages);
  const setProjectId = useEditorStore((s) => s.setProjectId);
  const setProjectName = useEditorStore((s) => s.setProjectName);
  const setAnnotations = useEditorStore((s) => s.setAnnotations);
  const reset = useEditorStore((s) => s.reset);

  const [isLoading, setIsLoading] = useState(false);

  // ---- Reset store on unmount (so navigating back shows upload) ----
  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  // ---- Load PDF from Files ----
  const handleFilesSelected = useCallback(async (files: File[]) => {
    if (files.length === 0) return;
    setIsLoading(true);

    try {
      let combinedBytes: Uint8Array;
      let combinedName: string;

      if (files.length === 1) {
        const buffer = await files[0].arrayBuffer();
        combinedBytes = new Uint8Array(buffer);
        combinedName = files[0].name;
      } else {
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

      const buffer = await data.file.pdfBlob.arrayBuffer();
      const bytes = new Uint8Array(buffer);

      setPdfBytes(bytes, data.file.filename);
      setProjectId(projectId);
      setProjectName(data.project.name);

      const pages: PageData[] = JSON.parse(data.snapshot.pages);
      const pageOrder: string[] = JSON.parse(data.snapshot.pageOrder);
      const annotations: Record<string, any[]> = JSON.parse(data.snapshot.annotations);

      setPages(pages);
      setPageOrder(pageOrder);

      for (const [pageId, anns] of Object.entries(annotations)) {
        setAnnotations(pageId, anns);
      }

      await generateThumbnails(bytes, pages);
    } catch (err) {
      console.error('Error loading project:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ---- Insert PDF (append pages to existing doc) ----
  const handleInsertPdf = useCallback(async (files: File[]) => {
    if (files.length === 0 || !pdfBytes) return;

    try {
      const { PDFDocument } = await import('pdf-lib');

      // Load current document
      const currentPdf = await PDFDocument.load(pdfBytes.slice().buffer as ArrayBuffer);

      // Append pages from new files
      for (const file of files) {
        const buffer = await file.arrayBuffer();
        const srcPdf = await PDFDocument.load(buffer);
        const copiedPages = await currentPdf.copyPages(srcPdf, srcPdf.getPageIndices());
        copiedPages.forEach((page) => currentPdf.addPage(page));
      }

      // Save merged
      const mergedBytes = await currentPdf.save();
      const newBytes = new Uint8Array(mergedBytes);

      // Parse new pages
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
      const buffer = newBytes.slice().buffer as ArrayBuffer;
      const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;

      // Get existing page count
      const currentPages = useEditorStore.getState().pages;
      const currentOrder = useEditorStore.getState().pageOrder;
      const existingCount = currentPages.length;

      // Create new page entries for inserted pages only
      const newPages: PageData[] = [];
      for (let i = existingCount; i < pdf.numPages; i++) {
        const page = await pdf.getPage(i + 1);
        const viewport = page.getViewport({ scale: 1 });

        newPages.push({
          id: `page-${i}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          pageIndex: i,
          width: viewport.width,
          height: viewport.height,
          rotation: 0,
          deleted: false,
          thumbnailUrl: null,
        });
      }

      // Update store
      insertPages(newBytes, newPages);

      // Generate thumbnails for new pages
      await generateThumbnails(newBytes, newPages);
    } catch (err) {
      console.error('Error inserting PDF:', err);
    }
  }, [pdfBytes]);

  // ---- Initialize Editor (from raw PDF bytes) ----
  async function initializeEditor(bytes: Uint8Array, fileName: string) {
    reset();
    setPdfBytes(bytes, fileName);

    const pdfjsLib = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

    // Convert to ArrayBuffer copy for pdfjs
    const buffer = bytes.slice().buffer as ArrayBuffer;
    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
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

    if (pages.length > 0) {
      useEditorStore.getState().setActivePageId(pages[0].id);
    }

    await generateThumbnails(bytes, pages);
  }

  // ---- Generate Thumbnails ----
  async function generateThumbnails(bytes: Uint8Array, pages: PageData[]) {
    const pdfjsLib = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

    const buffer = bytes.slice().buffer as ArrayBuffer;
    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;

    for (const pageData of pages) {
      try {
        const page = await pdf.getPage(pageData.pageIndex + 1);
        const viewport = page.getViewport({ scale: 0.3 });

        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d')!;
        await page.render({ canvas, canvasContext: ctx, viewport } as any).promise;

        const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.6);

        useEditorStore.getState().setPages(
          useEditorStore.getState().pages.map((p) =>
            p.id === pageData.id ? { ...p, thumbnailUrl } : p
          )
        );
      } catch (err) {
        console.error(`Thumbnail generation failed for page ${pageData.pageIndex}:`, err);
      }
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
  return <EditorShell onInsertPdf={handleInsertPdf} />;
}
