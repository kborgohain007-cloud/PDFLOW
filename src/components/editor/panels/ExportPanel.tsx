'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Download, FileImage, FileText, Loader } from 'lucide-react';
import { useEditorStore } from '@/stores/editor-store';
import type { ExportQuality } from '@/types/editor';

export default function ExportPanel() {
  const pdfBytes = useEditorStore((s) => s.pdfBytes);
  const pages = useEditorStore((s) => s.pages);
  const pageOrder = useEditorStore((s) => s.pageOrder);
  const annotations = useEditorStore((s) => s.annotations);
  const fileName = useEditorStore((s) => s.fileName);
  const toggleExportPanel = useEditorStore((s) => s.toggleExportPanel);
  const zoom = useEditorStore((s) => s.zoom);

  const [quality, setQuality] = useState<ExportQuality>('high');
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState<'pdf' | 'images'>('pdf');

  const handleExportPdf = async () => {
    if (!pdfBytes) return;
    setIsExporting(true);

    try {
      const { PDFDocument, rgb, StandardFonts } = await import('pdf-lib');
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      // Process pages in order, remove deleted pages
      const activePages = pageOrder
        .map((id) => pages.find((p) => p.id === id))
        .filter((p) => p && !p.deleted);

      // Bake annotations into each page
      for (const pageData of activePages) {
        if (!pageData) continue;
        const page = pdfDoc.getPages()[pageData.pageIndex];
        if (!page) continue;

        const pageAnns = annotations[pageData.id] || [];
        const { height: pageHeight } = page.getSize();

        for (const ann of pageAnns) {
          switch (ann.type) {
            case 'text': {
              const usedFont = ann.bold ? fontBold : font;
              // Convert hex to rgb
              const r = parseInt(ann.fontColor.slice(1, 3), 16) / 255;
              const g = parseInt(ann.fontColor.slice(3, 5), 16) / 255;
              const b = parseInt(ann.fontColor.slice(5, 7), 16) / 255;

              page.drawText(ann.text, {
                x: ann.x / zoom,
                y: pageHeight - (ann.y / zoom) - (ann.fontSize / zoom),
                size: ann.fontSize / zoom,
                font: usedFont,
                color: rgb(r, g, b),
                opacity: ann.opacity,
              });
              break;
            }

            case 'highlight': {
              const r = parseInt(ann.color.slice(1, 3), 16) / 255;
              const g = parseInt(ann.color.slice(3, 5), 16) / 255;
              const b = parseInt(ann.color.slice(5, 7), 16) / 255;

              page.drawRectangle({
                x: ann.x / zoom,
                y: pageHeight - (ann.y / zoom) - (ann.height / zoom),
                width: ann.width / zoom,
                height: ann.height / zoom,
                color: rgb(r, g, b),
                opacity: ann.opacity,
              });
              break;
            }

            case 'shape': {
              const sr = parseInt(ann.strokeColor.slice(1, 3), 16) / 255;
              const sg = parseInt(ann.strokeColor.slice(3, 5), 16) / 255;
              const sb = parseInt(ann.strokeColor.slice(5, 7), 16) / 255;

              if (ann.shapeType === 'rectangle') {
                page.drawRectangle({
                  x: ann.x / zoom,
                  y: pageHeight - (ann.y / zoom) - (ann.height / zoom),
                  width: ann.width / zoom,
                  height: ann.height / zoom,
                  borderColor: rgb(sr, sg, sb),
                  borderWidth: ann.strokeWidth,
                  opacity: ann.opacity,
                });
              } else if (ann.shapeType === 'circle') {
                page.drawCircle({
                  x: (ann.x + ann.width / 2) / zoom,
                  y: pageHeight - ((ann.y + ann.height / 2) / zoom),
                  size: Math.min(ann.width, ann.height) / (2 * zoom),
                  borderColor: rgb(sr, sg, sb),
                  borderWidth: ann.strokeWidth,
                  opacity: ann.opacity,
                });
              } else if (ann.shapeType === 'line' || ann.shapeType === 'arrow') {
                page.drawLine({
                  start: { x: ann.x / zoom, y: pageHeight - (ann.y / zoom) },
                  end: { x: (ann.x + ann.width) / zoom, y: pageHeight - ((ann.y + ann.height) / zoom) },
                  color: rgb(sr, sg, sb),
                  thickness: ann.strokeWidth,
                  opacity: ann.opacity,
                });
              }
              break;
            }

            case 'draw': {
              // Convert freehand points to SVG path
              const dr = parseInt(ann.strokeColor.slice(1, 3), 16) / 255;
              const dg = parseInt(ann.strokeColor.slice(3, 5), 16) / 255;
              const db = parseInt(ann.strokeColor.slice(5, 7), 16) / 255;

              // Draw line segments
              for (let i = 0; i < ann.points.length - 2; i += 2) {
                page.drawLine({
                  start: {
                    x: ann.points[i] / zoom,
                    y: pageHeight - (ann.points[i + 1] / zoom),
                  },
                  end: {
                    x: ann.points[i + 2] / zoom,
                    y: pageHeight - (ann.points[i + 3] / zoom),
                  },
                  color: rgb(dr, dg, db),
                  thickness: ann.strokeWidth / zoom,
                  opacity: ann.opacity,
                });
              }
              break;
            }
          }
        }
      }

      // Remove deleted pages (in reverse order to preserve indices)
      const deletedIndices = pages
        .filter((p) => p.deleted)
        .map((p) => p.pageIndex)
        .sort((a, b) => b - a);
      for (const idx of deletedIndices) {
        if (idx < pdfDoc.getPageCount()) {
          pdfDoc.removePage(idx);
        }
      }

      const savedBytes = await pdfDoc.save();
      const blob = new Blob([savedBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = fileName.replace('.pdf', '') + '_edited.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportImages = async () => {
    if (!pdfBytes) return;
    setIsExporting(true);

    try {
      const pdfjsLib = await import('pdfjs-dist');
      const JSZip = (await import('jszip')).default;

      pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
      const pdf = await pdfjsLib.getDocument({ data: pdfBytes }).promise;
      const zip = new JSZip();

      const qualityMap = { high: 1.0, balanced: 0.85, small: 0.6 };
      const scaleMap = { high: 2, balanced: 1.5, small: 1 };

      for (let i = 0; i < pdf.numPages; i++) {
        const page = await pdf.getPage(i + 1);
        const viewport = page.getViewport({ scale: scaleMap[quality] });

        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d')!;
        await page.render({ canvas, canvasContext: ctx, viewport } as any).promise;

        const blob = await new Promise<Blob>((resolve) =>
          canvas.toBlob(
            (b) => resolve(b!),
            quality === 'small' ? 'image/jpeg' : 'image/png',
            qualityMap[quality],
          ),
        );
        const ext = quality === 'small' ? 'jpg' : 'png';
        zip.file(`page_${(i + 1).toString().padStart(3, '0')}.${ext}`, blob);
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName.replace('.pdf', '') + '_pages.zip';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export images error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={toggleExportPanel}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Export PDF</h3>
          <button
            className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            onClick={toggleExportPanel}
          >
            <X className="w-5 h-5 text-neutral-500" />
          </button>
        </div>

        {/* Export Type */}
        <div className="mb-5">
          <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2 block">
            Format
          </label>
          <div className="flex gap-2">
            <button
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all border
                ${exportType === 'pdf'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                  : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                }`}
              onClick={() => setExportType('pdf')}
            >
              <FileText className="w-4 h-4" /> PDF
            </button>
            <button
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all border
                ${exportType === 'images'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                  : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                }`}
              onClick={() => setExportType('images')}
            >
              <FileImage className="w-4 h-4" /> Image ZIP
            </button>
          </div>
        </div>

        {/* Quality */}
        <div className="mb-6">
          <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2 block">
            Quality
          </label>
          <div className="flex gap-2">
            {(['high', 'balanced', 'small'] as ExportQuality[]).map((q) => (
              <button
                key={q}
                className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all border capitalize
                  ${quality === q
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                    : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                  }`}
                onClick={() => setQuality(q)}
              >
                {q === 'small' ? 'Small Size' : q === 'balanced' ? 'Balanced' : 'High Quality'}
              </button>
            ))}
          </div>
        </div>

        {/* Export Button */}
        <button
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={exportType === 'pdf' ? handleExportPdf : handleExportImages}
          disabled={isExporting}
        >
          {isExporting ? (
            <>
              <Loader className="w-4 h-4 animate-spin" /> Exporting...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" /> Export {exportType === 'pdf' ? 'PDF' : 'Images'}
            </>
          )}
        </button>
      </motion.div>
    </motion.div>
  );
}
