'use client';

import React, { useEffect, useRef } from 'react';
import { useEditorStore } from '@/store/use-editor-store';
import { Trash2, Copy, RotateCw } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
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
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Thumbnail Component for individual pages
function PageThumbnail({ 
  page, 
  index, 
  isActive, 
  onClick 
}: { 
  page: any, 
  index: number, 
  isActive: boolean,
  onClick: () => void 
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: page.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const documents = useEditorStore(state => state.documents);
  const deletePage = useEditorStore(state => state.deletePage);
  const rotatePage = useEditorStore(state => state.rotatePage);

  // Render thumbnail
  useEffect(() => {
    let renderTask: any = null;
    let isCancelled = false;

    const renderPage = async () => {
      if (!canvasRef.current || documents.length === 0) return;
      
      const doc = documents.find(d => d.id === page.documentId);
      if (!doc) return;

      const pdf = await pdfjsLib.getDocument({ data: doc.originalBuffer }).promise;
      const pdfPage = await pdf.getPage(page.originalPageIndex + 1);
      
      const viewport = pdfPage.getViewport({ scale: 0.2, rotation: page.rotation });
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (!context) return;
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      renderTask = pdfPage.render({
        canvasContext: context,
        viewport: viewport
      } as any);

      try {
        await renderTask.promise;
      } catch (err: any) {
        if (err.name !== 'RenderingCancelledException') {
          console.error(err);
        }
      }
    };

    renderPage();

    return () => {
      isCancelled = true;
      if (renderTask) {
        renderTask.cancel();
      }
    };
  }, [page.originalPageIndex, page.documentId, documents, page.rotation]);

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
      <div 
        className="relative w-full aspect-[1/1.414] bg-white dark:bg-neutral-800 rounded-lg overflow-hidden cursor-pointer shadow-sm flex items-center justify-center"
        onClick={onClick}
      >
        <canvas ref={canvasRef} className="max-w-full max-h-full" />
        
        {/* Page Number Badge */}
        <div className="absolute bottom-1 right-1 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
          {index + 1}
        </div>
      </div>
      
      {/* Drag Handle */}
      <div 
        {...attributes} 
        {...listeners}
        className="absolute top-1 left-1 w-6 h-6 bg-black/40 backdrop-blur-sm text-white rounded flex items-center justify-center cursor-grab opacity-0 group-hover:opacity-100 transition-opacity"
      >
        ⋮⋮
      </div>

      {/* Action Menu (Visible on hover) */}
      <div className="absolute top-1 right-1 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={(e) => { e.stopPropagation(); rotatePage(page.id, 90); }}
          className="w-6 h-6 bg-white/90 text-neutral-700 rounded shadow-sm flex items-center justify-center hover:text-indigo-600 hover:bg-white"
          title="Rotate"
        >
          <RotateCw className="w-3.5 h-3.5" />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); deletePage(page.id); }}
          className="w-6 h-6 bg-white/90 text-red-600 rounded shadow-sm flex items-center justify-center hover:text-red-700 hover:bg-red-50"
          title="Delete"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export default function EditorSidebar() {
  const pages = useEditorStore(state => state.pages);
  const activePageId = useEditorStore(state => state.activePageId);
  const setActivePage = useEditorStore(state => state.setActivePage);
  const reorderPages = useEditorStore(state => state.reorderPages);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = pages.findIndex((p) => p.id === active.id);
      const newIndex = pages.findIndex((p) => p.id === over.id);
      reorderPages(oldIndex, newIndex);
    }
  };

  return (
    <div className="w-48 lg:w-64 border-r border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 flex flex-col h-full overflow-y-auto custom-scrollbar shadow-[inset_-10px_0_15px_-10px_rgba(0,0,0,0.05)]">
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 sticky top-0 bg-neutral-50/90 dark:bg-neutral-900/90 backdrop-blur-md z-10">
        <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Pages ({pages.length})</h3>
      </div>
      
      <div className="p-4 flex flex-col gap-4">
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={pages.map(p => p.id)}
            strategy={verticalListSortingStrategy}
          >
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
    </div>
  );
}
