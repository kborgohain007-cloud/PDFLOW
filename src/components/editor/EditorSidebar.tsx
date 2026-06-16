'use client';

import React, { useEffect, useRef } from 'react';
import { useEditorStore } from '@/store/use-editor-store';
import { Trash2, RotateCw } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// ─── Single Thumbnail ────────────────────────────────────────────────

function PageThumbnail({
  page,
  index,
  isActive,
  onClick,
}: {
  page: any;
  index: number;
  isActive: boolean;
  onClick: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: page.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const documents = useEditorStore((s) => s.documents);
  const deletePage = useEditorStore((s) => s.deletePage);
  const rotatePage = useEditorStore((s) => s.rotatePage);

  // Render thumbnail via dynamic pdfjs-dist import
  useEffect(() => {
    let task: any = null;

    (async () => {
      if (!canvasRef.current || documents.length === 0) return;

      const doc = documents.find((d) => d.id === page.documentId);
      if (!doc) return;

      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

      const pdf = await pdfjsLib.getDocument({ data: doc.originalBuffer }).promise;
      const pdfPage = await pdf.getPage(page.originalPageIndex + 1);
      const viewport = pdfPage.getViewport({ scale: 0.2, rotation: page.rotation });

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      task = pdfPage.render({ canvasContext: ctx, viewport, canvas } as any);
      try {
        await task.promise;
      } catch (err: any) {
        if (err?.name !== 'RenderingCancelledException') console.error(err);
      }
    })();

    return () => {
      task?.cancel();
    };
  }, [page.originalPageIndex, page.documentId, page.rotation, documents]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative w-full rounded-xl border-2 transition-all group ${
        isActive
          ? 'border-indigo-500 shadow-md shadow-indigo-500/20'
          : 'border-transparent hover:border-neutral-300 dark:hover:border-neutral-700'
      }`}
    >
      {/* Thumbnail */}
      <div
        className="relative w-full aspect-[1/1.414] bg-white dark:bg-neutral-800 rounded-lg overflow-hidden cursor-pointer shadow-sm flex items-center justify-center"
        onClick={onClick}
      >
        <canvas ref={canvasRef} className="max-w-full max-h-full" />
        <div className="absolute bottom-1 right-1 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
          {index + 1}
        </div>
      </div>

      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-1 left-1 w-6 h-6 bg-black/40 backdrop-blur-sm text-white rounded flex items-center justify-center cursor-grab opacity-0 group-hover:opacity-100 transition-opacity text-[10px]"
      >
        ⋮⋮
      </div>

      {/* Quick actions */}
      <div className="absolute top-1 right-1 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            rotatePage(page.id, 90);
          }}
          className="w-6 h-6 bg-white/90 text-neutral-700 rounded shadow-sm flex items-center justify-center hover:text-indigo-600 hover:bg-white"
          title="Rotate 90°"
        >
          <RotateCw className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            deletePage(page.id);
          }}
          className="w-6 h-6 bg-white/90 text-red-600 rounded shadow-sm flex items-center justify-center hover:text-red-700 hover:bg-red-50"
          title="Delete page"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

// ─── Sidebar ─────────────────────────────────────────────────────────

export default function EditorSidebar() {
  const pages = useEditorStore((s) => s.pages);
  const activePageId = useEditorStore((s) => s.activePageId);
  const setActivePage = useEditorStore((s) => s.setActivePage);
  const reorderPages = useEditorStore((s) => s.reorderPages);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIdx = pages.findIndex((p) => p.id === active.id);
    const newIdx = pages.findIndex((p) => p.id === over.id);
    reorderPages(oldIdx, newIdx);
  };

  return (
    <aside className="w-48 lg:w-64 border-r border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 flex flex-col h-full overflow-y-auto shadow-[inset_-10px_0_15px_-10px_rgba(0,0,0,0.05)]">
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 sticky top-0 bg-neutral-50/90 dark:bg-neutral-900/90 backdrop-blur-md z-10">
        <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
          Pages ({pages.length})
        </h3>
      </div>

      <div className="p-4 flex flex-col gap-4">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={pages.map((p) => p.id)} strategy={verticalListSortingStrategy}>
            {pages.map((page, idx) => (
              <PageThumbnail
                key={page.id}
                page={page}
                index={idx}
                isActive={activePageId === page.id}
                onClick={() => setActivePage(page.id)}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </aside>
  );
}
