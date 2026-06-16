'use client';

import React, { useState, useCallback } from 'react';
import { useEditorStore } from '@/store/use-editor-store';
import EditorNavbar from './EditorNavbar';
import EditorSidebar from './EditorSidebar';
import EditorCanvas from './EditorCanvas';
import EditorProperties from './EditorProperties';
import UploadZone from '../upload/UploadZone';

export default function EditorWorkspace() {
  const documents = useEditorStore((state) => state.documents);
  const addDocument = useEditorStore((state) => state.addDocument);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize uploaded PDF — dynamically import pdfjs-dist to avoid SSR DOMMatrix crash
  const handleUpload = useCallback(async (files: File[]) => {
    if (files.length === 0) return;
    setIsLoading(true);

    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

      const file = files[0];
      const arrayBuffer = await file.arrayBuffer();

      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;

      const docId = crypto.randomUUID();

      const initPages = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.0 });

        initPages.push({
          id: crypto.randomUUID(),
          documentId: docId,
          originalPageIndex: i - 1,
          rotation: 0,
          width: viewport.width,
          height: viewport.height,
          thumbnailUrl: null,
          operations: []
        });
      }

      addDocument({
        id: docId,
        name: file.name,
        originalBuffer: arrayBuffer,
        pageCount: pdf.numPages
      }, initPages);
    } catch (err) {
      console.error('Failed to load PDF:', err);
    } finally {
      setIsLoading(false);
    }
  }, [addDocument]);

  if (documents.length === 0) {
    return (
      <div className="w-full h-full flex flex-col">
        {/* Simple Navbar for empty state */}
        <div className="h-14 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center px-4">
          <span className="font-heading font-bold text-lg text-indigo-600 dark:text-indigo-400">PDF Editor Pro</span>
        </div>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-2xl w-full">
            <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 mb-6 text-center">
              {isLoading ? 'Loading PDF...' : 'Start Editing'}
            </h2>
            {isLoading ? (
              <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-neutral-500">Parsing pages...</p>
              </div>
            ) : (
              <UploadZone 
                allowedTypes={['.pdf']}
                multiple={true}
                maxSizeMB={100}
                onFilesSelected={handleUpload}
                isProcessing={false}
                progress={0}
                processingStatus=""
                onReset={() => {}}
                files={[]}
                setFiles={() => {}}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 font-sans">
      <EditorNavbar />
      <div className="flex-1 flex overflow-hidden">
        <EditorSidebar />
        <EditorCanvas />
        <EditorProperties />
      </div>
    </div>
  );
}
