'use client';

import { useEditorStore } from '@/stores/editor-store';
import type { BrushType } from '@/types/editor';
import { Pen, Paintbrush, Palette } from 'lucide-react';
import { useCallback, useId } from 'react';
import { motion } from 'framer-motion';

// ============================================
// DrawTool — Right sidebar panel for draw options
// ============================================

const BRUSH_TYPES: { type: BrushType; label: string; icon: typeof Pen }[] = [
  { type: 'pen', label: 'Pen', icon: Pen },
  { type: 'marker', label: 'Marker', icon: Paintbrush },
];

export default function DrawTool() {
  const drawSettings = useEditorStore((s) => s.drawSettings);
  const setDrawSettings = useEditorStore((s) => s.setDrawSettings);
  const colorId = useId();
  const sizeId = useId();
  const opacityId = useId();

  const handleBrushType = useCallback(
    (brushType: BrushType) => setDrawSettings({ brushType }),
    [setDrawSettings],
  );

  const handleBrushSize = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setDrawSettings({ brushSize: Number(e.target.value) });
    },
    [setDrawSettings],
  );

  const handleColor = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setDrawSettings({ color: e.target.value });
    },
    [setDrawSettings],
  );

  const handleOpacity = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setDrawSettings({ opacity: Number(e.target.value) / 100 });
    },
    [setDrawSettings],
  );

  const opacityPercent = Math.round(drawSettings.opacity * 100);

  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 12 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="flex flex-col gap-5 p-4"
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 dark:bg-emerald-400/10">
          <Palette className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">
          Draw Options
        </h3>
      </div>

      {/* Brush Type */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          Brush Type
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {BRUSH_TYPES.map(({ type, label, icon: Icon }) => (
            <button
              key={type}
              type="button"
              onClick={() => handleBrushType(type)}
              className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                drawSettings.brushType === type
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600 shadow-sm dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-400'
                  : 'border-neutral-200 bg-white/70 text-neutral-600 hover:border-emerald-300 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800/70 dark:text-neutral-300 dark:hover:border-emerald-600 dark:hover:bg-neutral-800'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Brush Size */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor={sizeId}
            className="text-[11px] font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400"
          >
            Brush Size
          </label>
          <span className="text-xs font-medium tabular-nums text-neutral-600 dark:text-neutral-300">
            {drawSettings.brushSize}px
          </span>
        </div>
        <div className="flex items-center gap-3">
          <input
            id={sizeId}
            type="range"
            min={1}
            max={50}
            step={1}
            value={drawSettings.brushSize}
            onChange={handleBrushSize}
            className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-neutral-200 accent-emerald-500 dark:bg-neutral-700"
          />
          {/* Live Size Preview */}
          <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-white/50 dark:border-neutral-700 dark:bg-neutral-800/50">
            <div
              className="rounded-full transition-all duration-150"
              style={{
                width: `${Math.max(4, Math.min(drawSettings.brushSize, 44))}px`,
                height: `${Math.max(4, Math.min(drawSettings.brushSize, 44))}px`,
                backgroundColor: drawSettings.color,
                opacity: drawSettings.opacity,
              }}
            />
          </div>
        </div>
      </div>

      {/* Color Picker */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={colorId}
          className="text-[11px] font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400"
        >
          Stroke Color
        </label>
        <div className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white/70 px-3 py-2 shadow-sm backdrop-blur-md dark:border-neutral-700 dark:bg-neutral-800/70">
          <input
            id={colorId}
            type="color"
            value={drawSettings.color}
            onChange={handleColor}
            className="h-7 w-7 cursor-pointer rounded border-0 bg-transparent p-0 [&::-moz-color-swatch]:rounded [&::-moz-color-swatch]:border-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded [&::-webkit-color-swatch]:border-0"
          />
          <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400 uppercase">
            {drawSettings.color}
          </span>
        </div>
      </div>

      {/* Opacity */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor={opacityId}
            className="text-[11px] font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400"
          >
            Opacity
          </label>
          <span className="text-xs font-medium tabular-nums text-neutral-600 dark:text-neutral-300">
            {opacityPercent}%
          </span>
        </div>
        <input
          id={opacityId}
          type="range"
          min={0}
          max={100}
          step={1}
          value={opacityPercent}
          onChange={handleOpacity}
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-neutral-200 accent-emerald-500 dark:bg-neutral-700"
        />
      </div>

      {/* Drawing Tip */}
      <div className="rounded-lg border border-emerald-200/60 bg-emerald-50/50 px-3 py-2.5 dark:border-emerald-800/40 dark:bg-emerald-950/20">
        <p className="text-[11px] leading-relaxed text-emerald-700 dark:text-emerald-300">
          <span className="font-semibold">Tip:</span>{' '}
          {drawSettings.brushType === 'pen'
            ? 'Pen creates smooth, precise strokes ideal for writing and fine details.'
            : 'Marker creates wide, translucent strokes perfect for emphasis and annotations.'}
        </p>
      </div>
    </motion.div>
  );
}
