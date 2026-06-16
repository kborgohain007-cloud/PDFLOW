'use client';

import React from 'react';
import { useEditorStore } from '@/store/use-editor-store';
import { Undo2, Redo2, Download, Save, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PDFDocument, degrees } from 'pdf-lib';

export default function EditorNavbar() {
  const router = useRouter();
  const documents = useEditorStore((s) => s.documents);
  const pages = useEditorStore((s) => s.pages);
  const pastLen = useEditorStore((s) => s.past.length);
  const futureLen = useEditorStore((s) => s.future.length);
  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);

  const handleExport = async () => {
    if (documents.length === 0) return;

    const exportPdf = await PDFDocument.create();
    const sourceDoc = await PDFDocument.load(documents[0].originalBuffer);

    for (const pg of pages) {
      const [copied] = await exportPdf.copyPages(sourceDoc, [pg.originalPageIndex]);

      // Apply rotation
      if (pg.rotation !== 0) {
        const cur = copied.getRotation().angle;
        copied.setRotation(degrees(cur + pg.rotation));
      }

      // Apply text operations
      for (const op of pg.operations) {
        if (op.type === 'text') {
          copied.drawText(op.text, {
            x: op.x,
            y: pg.height - op.y - op.fontSize,
            size: op.fontSize,
          });
        }
      }

      exportPdf.addPage(copied);
    }

    const bytes = await exportPdf.save();
    const blob = new Blob([bytes as unknown as ArrayBuffer], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `Edited_${documents[0].name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <header className="h-14 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center justify-between px-4 shrink-0 shadow-sm z-20">
      {/* Left: Home + filename */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push('/')}
          className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 transition-colors"
          title="Back to Home"
        >
          <Home className="w-5 h-5" />
        </button>
        <div className="h-4 w-px bg-neutral-300 dark:bg-neutral-700" />
        <span className="font-semibold text-sm text-neutral-700 dark:text-neutral-300 truncate max-w-[200px]">
          {documents[0]?.name ?? 'Untitled'}
        </span>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={undo}
          disabled={pastLen === 0}
          className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 disabled:opacity-30 transition-colors"
          title="Undo (Ctrl+Z)"
        >
          <Undo2 className="w-4 h-4" />
        </button>
        <button
          onClick={redo}
          disabled={futureLen === 0}
          className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 disabled:opacity-30 transition-colors"
          title="Redo (Ctrl+Shift+Z)"
        >
          <Redo2 className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-neutral-300 dark:bg-neutral-700 mx-1" />

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
    </header>
  );
}
