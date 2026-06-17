'use client';

import { useEditorStore } from '@/stores/editor-store';
import { HIGHLIGHT_COLORS } from '@/types/editor';
import { Highlighter } from 'lucide-react';
import { useCallback, useId } from 'react';
import { motion } from 'framer-motion';

// ============================================
// HighlightTool — Right sidebar panel for highlight options
// ============================================

export default function HighlightTool() {
  const highlightSettings = useEditorStore((s) => s.highlightSettings);
  const setHighlightSettings = useEditorStore((s) => s.setHighlightSettings);
  const opacityId = useId();

  const handleColor = useCallback(
    (color: string) => setHighlightSettings({ color }),
    [setHighlightSettings],
  );

  const handleOpacity = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setHighlightSettings({ opacity: Number(e.target.value) / 100 });
    },
    [setHighlightSettings],
  );

  const opacityPercent = Math.round(highlightSettings.opacity * 100);

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
          <Highlighter className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">
          Highlight Options
        </h3>
      </div>

      {/* Preset Colors */}
      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          Highlight Color
        </label>
        <div className="grid grid-cols-2 gap-2">
          {HIGHLIGHT_COLORS.map(({ name, value }) => {
            const isActive = highlightSettings.color === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => handleColor(value)}
                className={`group relative flex items-center gap-2.5 rounded-lg border px-3 py-2.5 transition-all duration-150 ${
                  isActive
                    ? 'border-neutral-300 bg-white shadow-sm dark:border-neutral-600 dark:bg-neutral-800'
                    : 'border-neutral-200 bg-white/70 hover:border-neutral-300 hover:bg-white dark:border-neutral-700 dark:bg-neutral-800/70 dark:hover:border-neutral-600 dark:hover:bg-neutral-800'
                }`}
              >
                {/* Color Swatch */}
                <div
                  className={`h-5 w-5 shrink-0 rounded-full transition-all duration-150 ${
                    isActive
                      ? 'ring-2 ring-offset-1 ring-offset-white dark:ring-offset-neutral-800'
                      : 'group-hover:scale-110'
                  }`}
                  style={{
                    backgroundColor: value,
                    ...(isActive
                      ? { boxShadow: `0 0 0 2px ${value}40`, ringColor: value }
                      : {}),
                  }}
                />
                <span
                  className={`text-xs font-medium ${
                    isActive
                      ? 'text-neutral-800 dark:text-neutral-100'
                      : 'text-neutral-600 dark:text-neutral-300'
                  }`}
                >
                  {name}
                </span>

                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="highlight-active-ring"
                    className="absolute inset-0 rounded-lg border-2"
                    style={{ borderColor: value }}
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
              </button>
            );
          })}
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
          min={10}
          max={80}
          step={1}
          value={opacityPercent}
          onChange={handleOpacity}
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-neutral-200 accent-emerald-500 dark:bg-neutral-700"
        />
      </div>

      {/* Live Preview */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          Preview
        </label>
        <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white px-4 py-3 dark:border-neutral-700 dark:bg-neutral-800">
          <div className="relative">
            <p className="text-sm leading-relaxed text-neutral-800 dark:text-neutral-100">
              The quick brown fox jumps over the lazy dog near the river bank.
            </p>
            {/* Simulated highlight overlay */}
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-full rounded-sm"
              style={{
                backgroundColor: highlightSettings.color,
                opacity: highlightSettings.opacity,
              }}
            />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="rounded-lg border border-emerald-200/60 bg-emerald-50/50 px-3 py-2.5 dark:border-emerald-800/40 dark:bg-emerald-950/20">
        <p className="text-[11px] leading-relaxed text-emerald-700 dark:text-emerald-300">
          <span className="font-semibold">Tip:</span> Click and drag across
          text on the page to apply the highlight. Lower opacity creates a
          subtler effect.
        </p>
      </div>
    </motion.div>
  );
}
