'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DndContext, closestCenter, type DragEndEvent, DragOverlay } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { RotateCw, RotateCcw, Copy, Trash2, MoreVertical, GripVertical, FilePlus2 } from 'lucide-react';
import { useEditorStore } from '@/stores/editor-store';

// ---- Sortable Page Thumbnail ----

interface PageThumbnailProps {
  pageId: string;
  pageNumber: number;
  thumbnailUrl: string | null;
  isActive: boolean;
  rotation: number;
  onSelect: () => void;
  onRotate: (degrees: 90 | -90 | 180) => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

function SortablePageThumbnail({
  pageId,
  pageNumber,
  thumbnailUrl,
  isActive,
  rotation,
  onSelect,
  onRotate,
  onDuplicate,
  onDelete,
}: PageThumbnailProps) {
  const [showMenu, setShowMenu] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: pageId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group rounded-xl overflow-hidden transition-all duration-200 cursor-pointer
        ${isActive 
          ? 'ring-2 ring-emerald-500 ring-offset-2 ring-offset-white dark:ring-offset-neutral-900 shadow-lg shadow-emerald-500/20' 
          : 'ring-1 ring-neutral-200 dark:ring-neutral-700 hover:ring-emerald-400/50'
        }`}
      onClick={onSelect}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-1 left-1 z-10 p-1 rounded-md bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
        onClick={(e) => e.stopPropagation()}
      >
        <GripVertical className="w-3 h-3 text-white" />
      </div>

      {/* Menu Button */}
      <div className="absolute top-1 right-1 z-10">
        <button
          className="p-1 rounded-md bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
        >
          <MoreVertical className="w-3 h-3 text-white" />
        </button>

        {/* Context Menu */}
        <AnimatePresence>
          {showMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -4 }}
              className="absolute right-0 top-7 w-40 bg-white dark:bg-neutral-800 rounded-lg shadow-xl border border-neutral-200 dark:border-neutral-700 py-1 z-50"
              onClick={(e) => e.stopPropagation()}
              onMouseLeave={() => setShowMenu(false)}
            >
              <button
                className="flex items-center gap-2 w-full px-3 py-2 text-xs hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300"
                onClick={() => { onRotate(-90); setShowMenu(false); }}
              >
                <RotateCcw className="w-3.5 h-3.5" /> Rotate Left
              </button>
              <button
                className="flex items-center gap-2 w-full px-3 py-2 text-xs hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300"
                onClick={() => { onRotate(90); setShowMenu(false); }}
              >
                <RotateCw className="w-3.5 h-3.5" /> Rotate Right
              </button>
              <button
                className="flex items-center gap-2 w-full px-3 py-2 text-xs hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300"
                onClick={() => { onDuplicate(); setShowMenu(false); }}
              >
                <Copy className="w-3.5 h-3.5" /> Duplicate
              </button>
              <div className="border-t border-neutral-200 dark:border-neutral-700 my-1" />
              <button
                className="flex items-center gap-2 w-full px-3 py-2 text-xs hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
                onClick={() => { onDelete(); setShowMenu(false); }}
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Page
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Thumbnail Image */}
      <div className="aspect-[3/4] bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center overflow-hidden">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={`Page ${pageNumber}`}
            className="w-full h-full object-contain"
            style={{ transform: `rotate(${rotation}deg)` }}
            draggable={false}
          />
        ) : (
          <div className="text-neutral-400 dark:text-neutral-600 text-xs">Loading...</div>
        )}
      </div>

      {/* Page Number */}
      <div className={`text-center py-1.5 text-[10px] font-semibold transition-colors
        ${isActive
          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
          : 'bg-neutral-50 dark:bg-neutral-800/50 text-neutral-500 dark:text-neutral-400'
        }`}>
        Page {pageNumber}
      </div>
    </div>
  );
}

interface PagesSidebarProps {
  onInsertPdf?: (files: File[]) => void;
}

export default function PagesSidebar({ onInsertPdf }: PagesSidebarProps) {
  const pageOrder = useEditorStore((s) => s.pageOrder);
  const pages = useEditorStore((s) => s.pages);
  const activePageId = useEditorStore((s) => s.activePageId);
  const setActivePageId = useEditorStore((s) => s.setActivePageId);
  const setPageOrder = useEditorStore((s) => s.setPageOrder);
  const rotatePage = useEditorStore((s) => s.rotatePage);
  const deletePage = useEditorStore((s) => s.deletePage);
  const duplicatePage = useEditorStore((s) => s.duplicatePage);
  const isOpen = useEditorStore((s) => s.isPagesSidebarOpen);

  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const insertInputRef = useRef<HTMLInputElement>(null);

  const visiblePages = useMemo(() => {
    return pageOrder
      .map((id, idx) => {
        const page = pages.find((p) => p.id === id);
        if (!page || page.deleted) return null;
        return { ...page, displayIndex: idx + 1 };
      })
      .filter(Boolean) as (typeof pages[number] & { displayIndex: number })[];
  }, [pageOrder, pages]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveDragId(null);
    if (active.id !== over?.id) {
      const oldIndex = pageOrder.indexOf(active.id as string);
      const newIndex = pageOrder.indexOf(over!.id as string);
      setPageOrder(arrayMove(pageOrder, oldIndex, newIndex));
    }
  }

  if (!isOpen) return null;

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="hidden lg:flex w-[180px] min-w-[180px] h-full overflow-y-auto border-r border-neutral-200/50 dark:border-neutral-800/80 bg-white/50 dark:bg-neutral-900/30 backdrop-blur-md p-3 flex-col gap-2"
    >
      <div className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider px-1 mb-1">
        Pages ({visiblePages.length})
      </div>

      <DndContext
        collisionDetection={closestCenter}
        onDragStart={({ active }) => setActiveDragId(active.id as string)}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={pageOrder} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-2 flex-1">
            {visiblePages.map((page) => (
              <SortablePageThumbnail
                key={page.id}
                pageId={page.id}
                pageNumber={page.displayIndex}
                thumbnailUrl={page.thumbnailUrl}
                isActive={activePageId === page.id}
                rotation={page.rotation}
                onSelect={() => setActivePageId(page.id)}
                onRotate={(deg) => rotatePage(page.id, deg)}
                onDuplicate={() => duplicatePage(page.id)}
                onDelete={() => deletePage(page.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Insert PDF Pages Button */}
      {onInsertPdf && (
        <>
          <input
            ref={insertInputRef}
            type="file"
            accept=".pdf,application/pdf"
            multiple
            className="hidden"
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              if (files.length > 0) onInsertPdf(files);
              e.target.value = '';
            }}
          />
          <button
            onClick={() => insertInputRef.current?.click()}
            className="mt-2 flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-emerald-500 dark:hover:border-emerald-500 text-neutral-500 dark:text-neutral-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all text-xs font-semibold"
          >
            <FilePlus2 className="w-3.5 h-3.5" />
            Insert Pages
          </button>
        </>
      )}
    </motion.aside>
  );
}
