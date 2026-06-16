'use client';

import React from 'react';
import { useEditorStore } from '@/store/use-editor-store';
import { Undo2, Redo2, Download, Save, Home, ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PDFDocument, rgb, degrees } from 'pdf-lib';

export default function EditorNavbar() {
  const router = useRouter();
  const pastLength = useEditorStore(state => state.past.length);
  const futureLength = useEditorStore(state => state.future.length);
  const undo = useEditorStore(state => state.undo);
  const redo = useEditorStore(state => state.redo);
  const documents = useEditorStore(state => state.documents);
  const pages = useEditorStore(state => state.pages);

  const handleExport = async () => {
    if (documents.length === 0) return;
    
    // Create a new PDF document for export
    const exportPdf = await PDFDocument.create();
    const sourceDoc = await PDFDocument.load(documents[0].originalBuffer);
    
    // Copy and apply operations for each page in the current order
    for (const statePage of pages) {
      // 1. Copy the original page from the source document
      const [copiedPage] = await exportPdf.copyPages(sourceDoc, [statePage.originalPageIndex]);
      
      // 2. Apply Rotations
      if (statePage.rotation !== 0) {
        const currentRotation = copiedPage.getRotation().angle;
        copiedPage.setRotation(degrees(currentRotation + statePage.rotation));
      }
      
      // 3. Apply Canvas Operations (Phase 1)
      for (const op of statePage.operations) {
        if (op.type === 'text') {
          // Note: Full font embedding and styling requires loading standard fonts or custom fonts via PDF-lib
          // This is a simplified application of text
          copiedPage.drawText(op.text, {
            x: op.x,
            y: statePage.height - op.y - op.fontSize, // PDF-lib uses bottom-left origin
            size: op.fontSize,
            // color mapping will go here
          });
        }
        // Drawing paths will be implemented here
      }
      
      exportPdf.addPage(copiedPage);
    }
    
    const pdfBytes = await exportPdf.save();
    
    // Trigger download
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Edited_${documents[0].name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-14 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center justify-between px-4 shrink-0 shadow-sm z-20">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => router.push('/')}
          className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 transition-colors"
          title="Back to Home"
        >
          <Home className="w-5 h-5" />
        </button>
        <div className="h-4 w-px bg-neutral-300 dark:bg-neutral-700" />
        <span className="font-semibold text-sm text-neutral-700 dark:text-neutral-300 truncate max-w-[200px]">
          {documents[0]?.name || 'Untitled Document'}
        </span>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={undo}
          disabled={pastLength === 0}
          className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 disabled:opacity-30 transition-colors"
          title="Undo (Ctrl+Z)"
        >
          <Undo2 className="w-4 h-4" />
        </button>
        <button
          onClick={redo}
          disabled={futureLength === 0}
          className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 disabled:opacity-30 transition-colors"
          title="Redo (Ctrl+Shift+Z)"
        >
          <Redo2 className="w-4 h-4" />
        </button>
        
        <div className="h-4 w-px bg-neutral-300 dark:bg-neutral-700 mx-2" />
        
        <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 mr-2">
          <Save className="w-3.5 h-3.5" />
          <span>Auto-saved</span>
        </div>
        
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg flex items-center gap-2 shadow-sm transition-colors"
        >
          <Download className="w-4 h-4" />
          Export PDF
        </button>
      </div>
    </div>
  );
}
