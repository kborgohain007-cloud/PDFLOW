'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, Copy, MoveUp, MoveDown, Bold, Italic, Underline } from 'lucide-react';
import { useEditorStore } from '@/stores/editor-store';

export default function FloatingToolbar() {
  const selectedAnnotationId = useEditorStore((s) => s.selectedAnnotationId);
  const activePageId = useEditorStore((s) => s.activePageId);
  const annotations = useEditorStore((s) => s.annotations);
  const deleteAnnotation = useEditorStore((s) => s.deleteAnnotation);
  const updateAnnotation = useEditorStore((s) => s.updateAnnotation);
  const addAnnotation = useEditorStore((s) => s.addAnnotation);
  const activeTool = useEditorStore((s) => s.activeTool);

  if (!selectedAnnotationId || !activePageId || activeTool !== 'select') return null;

  const pageAnnotations = annotations[activePageId] || [];
  const selectedAnnotation = pageAnnotations.find((a) => a.id === selectedAnnotationId);
  if (!selectedAnnotation) return null;

  const handleDelete = () => {
    deleteAnnotation(activePageId, selectedAnnotationId);
  };

  const handleDuplicate = () => {
    const newId = `ann-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const dup = {
      ...selectedAnnotation,
      id: newId,
      x: selectedAnnotation.x + 20,
      y: selectedAnnotation.y + 20,
    };
    addAnnotation(activePageId, dup);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 px-3 py-2 rounded-xl bg-white/90 dark:bg-neutral-800/90 backdrop-blur-lg shadow-2xl border border-neutral-200 dark:border-neutral-700"
    >
      {/* Type-specific controls */}
      {selectedAnnotation.type === 'text' && (
        <>
          <button
            className={`p-1.5 rounded-lg transition-colors text-xs ${selectedAnnotation.bold ? 'bg-emerald-500/20 text-emerald-600' : 'hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300'}`}
            onClick={() => updateAnnotation(activePageId, selectedAnnotationId, { bold: !selectedAnnotation.bold })}
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            className={`p-1.5 rounded-lg transition-colors text-xs ${selectedAnnotation.italic ? 'bg-emerald-500/20 text-emerald-600' : 'hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300'}`}
            onClick={() => updateAnnotation(activePageId, selectedAnnotationId, { italic: !selectedAnnotation.italic })}
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            className={`p-1.5 rounded-lg transition-colors text-xs ${selectedAnnotation.underline ? 'bg-emerald-500/20 text-emerald-600' : 'hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300'}`}
            onClick={() => updateAnnotation(activePageId, selectedAnnotationId, { underline: !selectedAnnotation.underline })}
          >
            <Underline className="w-4 h-4" />
          </button>
          <div className="w-px h-5 bg-neutral-300 dark:bg-neutral-600 mx-1" />
        </>
      )}

      {/* Common controls */}
      <button
        className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 transition-colors"
        onClick={handleDuplicate}
        title="Duplicate"
      >
        <Copy className="w-4 h-4" />
      </button>
      <button
        className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors"
        onClick={handleDelete}
        title="Delete"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
