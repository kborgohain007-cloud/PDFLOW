'use client';

import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Square,
  Circle,
  MoveRight,
  Minus,
  Palette,
  Ban,
} from 'lucide-react';
import { useEditorStore } from '@/stores/editor-store';
import type { ShapeType } from '@/types/editor';

const SHAPE_OPTIONS: { type: ShapeType; icon: React.ElementType; label: string }[] = [
  { type: 'rectangle', icon: Square, label: 'Rectangle' },
  { type: 'circle', icon: Circle, label: 'Circle' },
  { type: 'arrow', icon: MoveRight, label: 'Arrow' },
  { type: 'line', icon: Minus, label: 'Line' },
];

const STROKE_PRESETS = [
  '#000000', '#374151', '#6B7280',
  '#EF4444', '#F97316', '#EAB308',
  '#22C55E', '#10B981', '#06B6D4',
  '#3B82F6', '#6366F1', '#A855F7',
  '#EC4899', '#F43F5E', '#FFFFFF',
];

const FILL_PRESETS = [
  'transparent',
  '#000000', '#374151',
  '#EF4444', '#F97316', '#EAB308',
  '#22C55E', '#10B981', '#06B6D4',
  '#3B82F6', '#6366F1', '#A855F7',
  '#EC4899', '#F43F5E', '#FFFFFF',
];

export default function ShapeTool() {
  const shapeSettings = useEditorStore((s) => s.shapeSettings);
  const setShapeSettings = useEditorStore((s) => s.setShapeSettings);

  const handleShapeType = useCallback(
    (shapeType: ShapeType) => setShapeSettings({ shapeType }),
    [setShapeSettings],
  );

  const handleStrokeColor = useCallback(
    (strokeColor: string) => setShapeSettings({ strokeColor }),
    [setShapeSettings],
  );

  const handleFillColor = useCallback(
    (fillColor: string) => setShapeSettings({ fillColor }),
    [setShapeSettings],
  );

  const handleStrokeWidth = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setShapeSettings({ strokeWidth: Number(e.target.value) }),
    [setShapeSettings],
  );

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
        <Palette className="w-4 h-4 text-emerald-500" />
        <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
          Shape Tool
        </h3>
      </div>

      {/* ── Shape Type Grid ── */}
      <section>
        <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-2">
          Shape
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {SHAPE_OPTIONS.map(({ type, icon: Icon, label }) => {
            const active = shapeSettings.shapeType === type;
            return (
              <button
                key={type}
                onClick={() => handleShapeType(type)}
                title={label}
                className={`
                  flex flex-col items-center justify-center gap-1 rounded-xl p-2.5 text-xs font-medium
                  transition-all duration-150 cursor-pointer
                  ${
                    active
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/40'
                      : 'bg-neutral-100 dark:bg-neutral-800/60 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200/70 dark:hover:bg-neutral-700/50'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="truncate leading-none">{label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Stroke Color ── */}
      <section>
        <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-2">
          Stroke Color
        </label>

        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-8 h-8 rounded-lg border-2 border-neutral-300 dark:border-neutral-600 shadow-sm"
            style={{ backgroundColor: shapeSettings.strokeColor }}
          />
          <input
            type="color"
            value={shapeSettings.strokeColor}
            onChange={(e) => handleStrokeColor(e.target.value)}
            className="w-0 h-0 opacity-0 absolute"
            id="shape-stroke-color"
          />
          <label
            htmlFor="shape-stroke-color"
            className="text-xs text-neutral-500 dark:text-neutral-400 font-mono bg-neutral-100 dark:bg-neutral-800 rounded-md px-2 py-1 cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
          >
            {shapeSettings.strokeColor.toUpperCase()}
          </label>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {STROKE_PRESETS.map((color) => (
            <button
              key={`stroke-${color}`}
              onClick={() => handleStrokeColor(color)}
              title={color}
              className={`
                w-6 h-6 rounded-md border transition-all duration-100 cursor-pointer
                hover:scale-110 hover:shadow-md
                ${
                  shapeSettings.strokeColor === color
                    ? 'ring-2 ring-emerald-500 ring-offset-1 ring-offset-white dark:ring-offset-neutral-900 border-transparent'
                    : 'border-neutral-300 dark:border-neutral-600'
                }
              `}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </section>

      {/* ── Fill Color ── */}
      <section>
        <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-2">
          Fill Color
        </label>

        <div className="flex items-center gap-2 mb-2">
          {shapeSettings.fillColor === 'transparent' ? (
            <div className="w-8 h-8 rounded-lg border-2 border-dashed border-neutral-300 dark:border-neutral-600 flex items-center justify-center">
              <Ban className="w-4 h-4 text-neutral-400 dark:text-neutral-500" />
            </div>
          ) : (
            <div
              className="w-8 h-8 rounded-lg border-2 border-neutral-300 dark:border-neutral-600 shadow-sm"
              style={{ backgroundColor: shapeSettings.fillColor }}
            />
          )}
          <input
            type="color"
            value={shapeSettings.fillColor === 'transparent' ? '#ffffff' : shapeSettings.fillColor}
            onChange={(e) => handleFillColor(e.target.value)}
            className="w-0 h-0 opacity-0 absolute"
            id="shape-fill-color"
          />
          <label
            htmlFor="shape-fill-color"
            className="text-xs text-neutral-500 dark:text-neutral-400 font-mono bg-neutral-100 dark:bg-neutral-800 rounded-md px-2 py-1 cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
          >
            {shapeSettings.fillColor === 'transparent'
              ? 'NONE'
              : shapeSettings.fillColor.toUpperCase()}
          </label>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {FILL_PRESETS.map((color) => {
            const isTransparent = color === 'transparent';
            const isActive = shapeSettings.fillColor === color;
            return (
              <button
                key={`fill-${color}`}
                onClick={() => handleFillColor(color)}
                title={isTransparent ? 'None / Transparent' : color}
                className={`
                  w-6 h-6 rounded-md border transition-all duration-100 cursor-pointer
                  hover:scale-110 hover:shadow-md
                  ${
                    isActive
                      ? 'ring-2 ring-emerald-500 ring-offset-1 ring-offset-white dark:ring-offset-neutral-900 border-transparent'
                      : 'border-neutral-300 dark:border-neutral-600'
                  }
                  ${isTransparent ? 'bg-white dark:bg-neutral-800' : ''}
                `}
                style={isTransparent ? undefined : { backgroundColor: color }}
              >
                {isTransparent && (
                  <Ban className="w-full h-full p-0.5 text-neutral-400 dark:text-neutral-500" />
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Stroke Width ── */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
            Stroke Width
          </label>
          <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 rounded-md px-1.5 py-0.5">
            {shapeSettings.strokeWidth}px
          </span>
        </div>
        <input
          type="range"
          min={1}
          max={20}
          step={1}
          value={shapeSettings.strokeWidth}
          onChange={handleStrokeWidth}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer
            bg-neutral-200 dark:bg-neutral-700
            accent-emerald-500
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-emerald-500
            [&::-webkit-slider-thumb]:shadow-md
            [&::-webkit-slider-thumb]:border-2
            [&::-webkit-slider-thumb]:border-white
            [&::-webkit-slider-thumb]:dark:border-neutral-900
            [&::-webkit-slider-thumb]:transition-transform
            [&::-webkit-slider-thumb]:hover:scale-125
          "
        />
        <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
          <span>1px</span>
          <span>20px</span>
        </div>
      </section>

      {/* ── Preview ── */}
      <section>
        <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-2">
          Preview
        </label>
        <div className="h-20 rounded-xl bg-neutral-100 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/50 flex items-center justify-center overflow-hidden">
          <svg width="100" height="60" viewBox="0 0 100 60" className="drop-shadow-sm">
            {shapeSettings.shapeType === 'rectangle' && (
              <rect
                x={10}
                y={8}
                width={80}
                height={44}
                rx={3}
                stroke={shapeSettings.strokeColor}
                strokeWidth={shapeSettings.strokeWidth}
                fill={shapeSettings.fillColor}
              />
            )}
            {shapeSettings.shapeType === 'circle' && (
              <ellipse
                cx={50}
                cy={30}
                rx={38}
                ry={22}
                stroke={shapeSettings.strokeColor}
                strokeWidth={shapeSettings.strokeWidth}
                fill={shapeSettings.fillColor}
              />
            )}
            {shapeSettings.shapeType === 'arrow' && (
              <>
                <line
                  x1={10}
                  y1={30}
                  x2={78}
                  y2={30}
                  stroke={shapeSettings.strokeColor}
                  strokeWidth={shapeSettings.strokeWidth}
                  strokeLinecap="round"
                />
                <polyline
                  points="68,18 82,30 68,42"
                  stroke={shapeSettings.strokeColor}
                  strokeWidth={shapeSettings.strokeWidth}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </>
            )}
            {shapeSettings.shapeType === 'line' && (
              <line
                x1={10}
                y1={50}
                x2={90}
                y2={10}
                stroke={shapeSettings.strokeColor}
                strokeWidth={shapeSettings.strokeWidth}
                strokeLinecap="round"
              />
            )}
          </svg>
        </div>
      </section>
    </motion.div>
  );
}
