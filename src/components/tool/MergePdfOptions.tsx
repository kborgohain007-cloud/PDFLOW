'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, GripVertical, AlertCircle, Loader } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  TouchSensor
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface PageItem {
  id: string;
  fileIndex: number;
  pageIndex: number;
  thumbnailUrl: string;
  fileName: string;
}

const SortablePageItem = ({ item, onDelete }: { item: PageItem; onDelete: (id: string) => void }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
    scale: isDragging ? 1.05 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group flex flex-col items-center bg-white/50 dark:bg-neutral-900/50 border border-neutral-200/50 dark:border-neutral-800/50 rounded-xl p-2 shadow-sm hover:shadow-md transition-shadow">
      <button
        onClick={() => onDelete(item.id)}
        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-20"
        title="Delete page"
      >
        <Trash2 className="w-3 h-3" />
      </button>
      
      <div 
        {...attributes} 
        {...listeners}
        className="absolute top-2 left-2 bg-white/80 dark:bg-black/50 backdrop-blur text-neutral-500 rounded p-1 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity z-20"
      >
        <GripVertical className="w-4 h-4" />
      </div>

      <div className="w-full aspect-[1/1.4] bg-neutral-100/50 dark:bg-neutral-800/50 rounded-lg overflow-hidden flex items-center justify-center relative border border-neutral-200 dark:border-neutral-700">
        <img src={item.thumbnailUrl} alt={`Page ${item.pageIndex + 1}`} className="w-full h-full object-contain pointer-events-none" />
        <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[10px] px-1.5 rounded-sm font-medium backdrop-blur-sm pointer-events-none">
          {item.pageIndex + 1}
        </div>
      </div>
      <div className="w-full text-center mt-2">
        <p className="text-[10px] font-semibold text-neutral-500 truncate w-full px-1 pointer-events-none" title={item.fileName}>
          {item.fileName}
        </p>
      </div>
    </div>
  );
};

interface MergePdfOptionsProps {
  files: File[];
  options: any;
  setOptions: React.Dispatch<React.SetStateAction<any>>;
  onTriggerProcess: () => void;
}

export const MergePdfOptions: React.FC<MergePdfOptionsProps> = ({ files, options, setOptions, onTriggerProcess }) => {
  const [items, setItems] = useState<PageItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const initializedFiles = useRef<Set<string>>(new Set());

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const loadThumbnails = async () => {
      // Create a composite key for current files
      const filesKey = files.map(f => f.name + f.size).join('-');
      if (initializedFiles.current.has(filesKey)) return;
      
      setIsLoading(true);
      const newItems: PageItem[] = [];

      try {
        const pdfjsLib = await import('pdfjs-dist');
        pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

        for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
          const file = files[fileIndex];
          const arrayBuffer = await file.arrayBuffer();
          const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
          const numPages = pdf.numPages;

          for (let pageIndex = 0; pageIndex < numPages; pageIndex++) {
            const page = await pdf.getPage(pageIndex + 1);
            const viewport = page.getViewport({ scale: 0.3 }); // Low res for thumbnail
            const canvas = document.createElement('canvas');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            const ctx = canvas.getContext('2d');
            
            if (ctx) {
              await page.render({ canvasContext: ctx, viewport } as any).promise;
              const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.6);
              newItems.push({
                id: `${fileIndex}-${pageIndex}`,
                fileIndex,
                pageIndex,
                thumbnailUrl,
                fileName: file.name
              });
            }
          }
        }
        
        setItems(newItems);
        // Initialize options with the default order
        setOptions({ ...options, pageOrder: newItems.map(i => ({ fileIndex: i.fileIndex, pageIndex: i.pageIndex })) });
        initializedFiles.current.add(filesKey);
      } catch (err) {
        console.error('Failed to load thumbnails', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (files.length > 0) {
      loadThumbnails();
    } else {
      setItems([]);
      setOptions({ ...options, pageOrder: [] });
    }
  }, [files]);

  // Sync items to options whenever items array changes
  useEffect(() => {
    if (items.length > 0) {
      setOptions({ ...options, pageOrder: items.map(i => ({ fileIndex: i.fileIndex, pageIndex: i.pageIndex })) });
    }
  }, [items]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleDelete = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  if (isLoading) {
    return (
      <div className="w-full py-12 flex flex-col items-center justify-center border border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl">
        <Loader className="w-8 h-8 text-brand-500 animate-spin mb-4" />
        <p className="text-sm font-semibold text-neutral-600 dark:text-neutral-400">Loading document pages...</p>
      </div>
    );
  }

  if (items.length === 0 && !isLoading) {
    return null;
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">Arrange Pages</h3>
          <p className="text-sm text-neutral-500">Drag and drop to reorder. Hover over a page to delete it.</p>
        </div>
        <div className="text-xs font-bold bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 px-3 py-1.5 rounded-full">
          {items.length} Page{items.length !== 1 ? 's' : ''} Selected
        </div>
      </div>

      <div className="bg-white/30 dark:bg-neutral-900/30 rounded-2xl p-6 border border-neutral-200/50 dark:border-neutral-800/50">
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={items.map(i => i.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
              {items.map((item) => (
                <SortablePageItem key={item.id} item={item} onDelete={handleDelete} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {items.length === 0 && (
        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-500/10 p-4 rounded-xl">
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm font-medium">You have deleted all pages. Please upload documents to merge.</p>
        </div>
      )}

    </div>
  );
};
