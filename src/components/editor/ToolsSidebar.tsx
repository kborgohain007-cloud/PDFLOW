'use client';

import React, { useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  MousePointer2,
  Type,
  Pen,
  Highlighter,
  Shapes,
  Eraser,
  PanelRightClose,
  PanelRightOpen,
  Lock,
  RotateCw,
} from 'lucide-react';
import { useEditorStore } from '@/stores/editor-store';
import type { ToolType, Annotation } from '@/types/editor';
import ShapeTool from './tools/ShapeTool';
import EraserTool from './tools/EraserTool';
import TextTool from './tools/TextTool';
import DrawTool from './tools/DrawTool';
import HighlightTool from './tools/HighlightTool';

// ── Tool definitions ──
interface ToolDef {
  type: ToolType;
  icon: React.ElementType;
  label: string;
}

const TOOLS: ToolDef[] = [
  { type: 'select', icon: MousePointer2, label: 'Select' },
  { type: 'text', icon: Type, label: 'Text' },
  { type: 'draw', icon: Pen, label: 'Draw' },
  { type: 'highlight', icon: Highlighter, label: 'Highlight' },
  { type: 'shape', icon: Shapes, label: 'Shape' },
  { type: 'eraser', icon: Eraser, label: 'Eraser' },
];

// ── Placeholder panels for tools not yet built ──
function TextToolPlaceholder() {
  return (
    <PlaceholderPanel
      icon={Type}
      title="Text Tool"
      description="Add and edit text annotations on your PDF pages. Configure font, size, color and alignment."
    />
  );
}

function DrawToolPlaceholder() {
  return (
    <PlaceholderPanel
      icon={Pen}
      title="Draw Tool"
      description="Freehand draw on your PDF with pen or marker brushes. Adjust size, color and opacity."
    />
  );
}

function HighlightToolPlaceholder() {
  return (
    <PlaceholderPanel
      icon={Highlighter}
      title="Highlight Tool"
      description="Highlight important sections of your PDF with colored overlays. Choose color and opacity."
    />
  );
}

function PlaceholderPanel({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 12 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="flex flex-col gap-4 px-1"
    >
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-emerald-500" />
        <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
          {title}
        </h3>
      </div>
      <p className="text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
        {description}
      </p>
    </motion.div>
  );
}

// ── Select Tool: annotation property inspector ──
function SelectToolPanel() {
  const selectedAnnotationId = useEditorStore((s) => s.selectedAnnotationId);
  const activePageId = useEditorStore((s) => s.activePageId);
  const annotations = useEditorStore((s) => s.annotations);

  const selectedAnnotation = useMemo<Annotation | null>(() => {
    if (!selectedAnnotationId || !activePageId) return null;
    const pageAnnotations = annotations[activePageId] || [];
    return pageAnnotations.find((a) => a.id === selectedAnnotationId) ?? null;
  }, [selectedAnnotationId, activePageId, annotations]);

  if (!selectedAnnotation) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 12 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="flex flex-col items-center justify-center gap-4 px-1 py-10 text-center"
      >
        <div className="w-14 h-14 rounded-2xl bg-neutral-100 dark:bg-neutral-800/60 flex items-center justify-center">
          <MousePointer2 className="w-7 h-7 text-neutral-400 dark:text-neutral-500" />
        </div>
        <div>
          <p className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
            Select an object to edit
          </p>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
            Click on any annotation on the canvas
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      key={selectedAnnotation.id}
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 12 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="flex flex-col gap-4 px-1"
    >
      <div className="flex items-center gap-2">
        <MousePointer2 className="w-4 h-4 text-emerald-500" />
        <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
          Properties
        </h3>
      </div>

      {/* Type badge */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 w-14">
          Type
        </span>
        <span className="text-xs font-semibold capitalize bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-md px-2 py-0.5">
          {selectedAnnotation.type}
        </span>
      </div>

      {/* Position */}
      <div className="grid grid-cols-2 gap-2">
        <PropertyField label="X" value={`${Math.round(selectedAnnotation.x)}px`} />
        <PropertyField label="Y" value={`${Math.round(selectedAnnotation.y)}px`} />
        <PropertyField label="W" value={`${Math.round(selectedAnnotation.width)}px`} />
        <PropertyField label="H" value={`${Math.round(selectedAnnotation.height)}px`} />
      </div>

      {/* Rotation & Opacity */}
      <div className="grid grid-cols-2 gap-2">
        <PropertyField
          label="Rotation"
          value={`${selectedAnnotation.rotation}°`}
          icon={RotateCw}
        />
        <PropertyField
          label="Opacity"
          value={`${Math.round(selectedAnnotation.opacity * 100)}%`}
        />
      </div>

      {/* Lock status */}
      <div className="flex items-center gap-2 mt-1">
        <Lock
          className={`w-3.5 h-3.5 ${
            selectedAnnotation.locked
              ? 'text-amber-500'
              : 'text-neutral-400 dark:text-neutral-500'
          }`}
        />
        <span className="text-xs text-neutral-500 dark:text-neutral-400">
          {selectedAnnotation.locked ? 'Locked' : 'Unlocked'}
        </span>
      </div>

      {/* Type-specific properties */}
      {selectedAnnotation.type === 'text' && (
        <div className="flex flex-col gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-700/50">
          <PropertyField label="Font" value={selectedAnnotation.fontFamily} />
          <PropertyField label="Size" value={`${selectedAnnotation.fontSize}px`} />
          <PropertyField label="Color" value={selectedAnnotation.fontColor} isColor />
          <PropertyField label="Align" value={selectedAnnotation.alignment} />
        </div>
      )}

      {selectedAnnotation.type === 'draw' && (
        <div className="flex flex-col gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-700/50">
          <PropertyField label="Brush" value={selectedAnnotation.brushType} />
          <PropertyField label="Width" value={`${selectedAnnotation.strokeWidth}px`} />
          <PropertyField label="Color" value={selectedAnnotation.strokeColor} isColor />
        </div>
      )}

      {selectedAnnotation.type === 'shape' && (
        <div className="flex flex-col gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-700/50">
          <PropertyField label="Shape" value={selectedAnnotation.shapeType} />
          <PropertyField label="Stroke" value={selectedAnnotation.strokeColor} isColor />
          <PropertyField label="Fill" value={selectedAnnotation.fillColor} isColor />
          <PropertyField label="Width" value={`${selectedAnnotation.strokeWidth}px`} />
        </div>
      )}

      {selectedAnnotation.type === 'highlight' && (
        <div className="flex flex-col gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-700/50">
          <PropertyField label="Color" value={selectedAnnotation.color} isColor />
        </div>
      )}
    </motion.div>
  );
}

function PropertyField({
  label,
  value,
  icon: Icon,
  isColor,
}: {
  label: string;
  value: string;
  icon?: React.ElementType;
  isColor?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800/60 rounded-lg px-2.5 py-1.5">
      {Icon && <Icon className="w-3 h-3 text-neutral-400" />}
      <span className="text-[10px] font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wider w-10 shrink-0">
        {label}
      </span>
      <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300 truncate flex items-center gap-1.5">
        {isColor && value !== 'transparent' && (
          <span
            className="w-3 h-3 rounded-sm border border-neutral-300 dark:border-neutral-600 inline-block shrink-0"
            style={{ backgroundColor: value }}
          />
        )}
        {value}
      </span>
    </div>
  );
}

// ── Main ToolsSidebar Component ──
export default function ToolsSidebar() {
  const activeTool = useEditorStore((s) => s.activeTool);
  const setActiveTool = useEditorStore((s) => s.setActiveTool);
  const isOpen = useEditorStore((s) => s.isToolsSidebarOpen);
  const toggle = useEditorStore((s) => s.toggleToolsSidebar);

  const renderToolPanel = () => {
    switch (activeTool) {
      case 'select':
        return <SelectToolPanel />;
      case 'text':
        return <TextTool />;
      case 'draw':
        return <DrawTool />;
      case 'highlight':
        return <HighlightTool />;
      case 'shape':
        return <ShapeTool />;
      case 'eraser':
        return <EraserTool />;
      default:
        return null;
    }
  };

  return (
    <>
      {/* ── Mobile toggle button (visible when sidebar is closed on small screens) ── */}
      <button
        onClick={toggle}
        className={`
          fixed right-3 top-20 z-50 lg:hidden
          w-10 h-10 rounded-xl
          bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md
          border border-neutral-200/50 dark:border-neutral-700/50
          shadow-lg shadow-black/5
          flex items-center justify-center
          text-neutral-600 dark:text-neutral-400
          hover:text-emerald-600 dark:hover:text-emerald-400
          transition-all duration-200
          ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}
        `}
        aria-label="Open tools sidebar"
      >
        <PanelRightOpen className="w-4.5 h-4.5" />
      </button>

      {/* ── Mobile backdrop ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={toggle}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* ── Sidebar ── */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.aside
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 32 }}
            className="
              fixed right-0 top-0 bottom-0 z-50
              lg:static lg:z-auto
              w-[280px] shrink-0
              flex flex-row
              bg-white/70 dark:bg-[#09090b]/70 backdrop-blur-md
              border-l border-neutral-200/40 dark:border-neutral-800/50
              shadow-2xl lg:shadow-none
            "
          >
            {/* ── Tool Panel Content ── */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-neutral-700">
              {/* Close button (mobile) */}
              <button
                onClick={toggle}
                className="lg:hidden mb-3 w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
                aria-label="Close tools sidebar"
              >
                <PanelRightClose className="w-4 h-4" />
              </button>

              <AnimatePresence mode="wait">
                <div key={activeTool}>{renderToolPanel()}</div>
              </AnimatePresence>
            </div>

            {/* ── Vertical Tool Strip ── */}
            <div className="w-12 shrink-0 border-l border-neutral-200/40 dark:border-neutral-800/50 bg-neutral-50/50 dark:bg-neutral-950/30 py-3 flex flex-col items-center gap-1">
              {TOOLS.map(({ type, icon: Icon, label }) => {
                const isActive = activeTool === type;
                return (
                  <button
                    key={type}
                    onClick={() => setActiveTool(type)}
                    title={label}
                    className={`
                      relative w-9 h-9 rounded-xl flex items-center justify-center
                      transition-all duration-150 cursor-pointer group
                      ${
                        isActive
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shadow-sm'
                          : 'text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200/60 dark:hover:bg-neutral-800/60 hover:text-neutral-700 dark:hover:text-neutral-300'
                      }
                    `}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeToolIndicator"
                        className="absolute inset-0 rounded-xl ring-1 ring-emerald-500/40"
                        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                      />
                    )}
                    <Icon className="w-4 h-4 relative z-10" />

                    {/* Tooltip */}
                    <span className="absolute right-full mr-2 px-2 py-1 rounded-md bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-[10px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 shadow-lg">
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
