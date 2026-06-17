'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Eraser, MousePointer, BoxSelect, Info } from 'lucide-react';

type EraserMode = 'single' | 'area';

export default function EraserTool() {
  const [mode, setMode] = useState<EraserMode>('single');

  const handleMode = useCallback((m: EraserMode) => setMode(m), []);

  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 12 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="flex flex-col gap-5 px-1"
    >
      {/* ── Header ── */}
      <div className="flex items-center gap-2">
        <Eraser className="w-4 h-4 text-emerald-500" />
        <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
          Eraser Tool
        </h3>
      </div>

      {/* ── Instruction Card ── */}
      <div className="rounded-xl bg-emerald-500/8 dark:bg-emerald-500/10 border border-emerald-500/20 p-3.5 flex items-start gap-3">
        <Info className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
        <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-300">
          Click on any annotation to remove it. Deleted objects can be recovered
          using <span className="font-semibold text-neutral-800 dark:text-neutral-100">Ctrl+Z</span> to undo.
        </p>
      </div>

      {/* ── Mode Toggle ── */}
      <section>
        <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-2.5">
          Eraser Mode
        </label>

        <div className="flex flex-col gap-1.5">
          {/* Single Object */}
          <button
            onClick={() => handleMode('single')}
            className={`
              flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all duration-150 cursor-pointer
              ${
                mode === 'single'
                  ? 'bg-emerald-500/12 dark:bg-emerald-500/15 ring-1 ring-emerald-500/40 text-emerald-700 dark:text-emerald-300'
                  : 'bg-neutral-100 dark:bg-neutral-800/60 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200/70 dark:hover:bg-neutral-700/50'
              }
            `}
          >
            <div
              className={`
                w-8 h-8 rounded-lg flex items-center justify-center shrink-0
                ${
                  mode === 'single'
                    ? 'bg-emerald-500/20 dark:bg-emerald-500/25'
                    : 'bg-neutral-200 dark:bg-neutral-700'
                }
              `}
            >
              <MousePointer className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-sm font-medium leading-tight">Single Object</div>
              <div className="text-[11px] mt-0.5 opacity-70 leading-snug">
                Click to remove one annotation at a time
              </div>
            </div>
          </button>

          {/* Area Select */}
          <button
            onClick={() => handleMode('area')}
            className={`
              flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all duration-150 cursor-pointer
              ${
                mode === 'area'
                  ? 'bg-emerald-500/12 dark:bg-emerald-500/15 ring-1 ring-emerald-500/40 text-emerald-700 dark:text-emerald-300'
                  : 'bg-neutral-100 dark:bg-neutral-800/60 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200/70 dark:hover:bg-neutral-700/50'
              }
            `}
          >
            <div
              className={`
                w-8 h-8 rounded-lg flex items-center justify-center shrink-0
                ${
                  mode === 'area'
                    ? 'bg-emerald-500/20 dark:bg-emerald-500/25'
                    : 'bg-neutral-200 dark:bg-neutral-700'
                }
              `}
            >
              <BoxSelect className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-sm font-medium leading-tight">Area Select</div>
              <div className="text-[11px] mt-0.5 opacity-70 leading-snug">
                Drag to select and remove multiple annotations
              </div>
            </div>
          </button>
        </div>
      </section>

      {/* ── Visual Hint ── */}
      <div className="mt-2 rounded-xl bg-neutral-100 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/50 p-4 flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-red-500/10 dark:bg-red-500/15 flex items-center justify-center">
          <Eraser className="w-6 h-6 text-red-400 dark:text-red-400" />
        </div>
        <p className="text-[11px] text-center text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-[180px]">
          Hover over annotations to see them highlighted in red before erasing
        </p>
      </div>
    </motion.div>
  );
}
