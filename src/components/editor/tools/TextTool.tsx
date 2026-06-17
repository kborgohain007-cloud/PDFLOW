'use client';

import { useEditorStore } from '@/stores/editor-store';
import { AVAILABLE_FONTS } from '@/types/editor';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Type,
  ChevronDown,
} from 'lucide-react';
import { useCallback, useId } from 'react';
import { motion } from 'framer-motion';

// ============================================
// TextTool — Right sidebar panel for text options
// ============================================

export default function TextTool() {
  const textSettings = useEditorStore((s) => s.textSettings);
  const setTextSettings = useEditorStore((s) => s.setTextSettings);
  const colorId = useId();
  const sizeId = useId();
  const spacingId = useId();

  const handleFontFamily = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setTextSettings({ fontFamily: e.target.value });
    },
    [setTextSettings],
  );

  const handleFontSize = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = Math.max(8, Math.min(144, Number(e.target.value) || 8));
      setTextSettings({ fontSize: val });
    },
    [setTextSettings],
  );

  const handleFontColor = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTextSettings({ fontColor: e.target.value });
    },
    [setTextSettings],
  );

  const handleLetterSpacing = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTextSettings({ letterSpacing: Number(e.target.value) });
    },
    [setTextSettings],
  );

  const toggleBold = useCallback(
    () => setTextSettings({ bold: !textSettings.bold }),
    [setTextSettings, textSettings.bold],
  );
  const toggleItalic = useCallback(
    () => setTextSettings({ italic: !textSettings.italic }),
    [setTextSettings, textSettings.italic],
  );
  const toggleUnderline = useCallback(
    () => setTextSettings({ underline: !textSettings.underline }),
    [setTextSettings, textSettings.underline],
  );

  const setAlignment = useCallback(
    (alignment: 'left' | 'center' | 'right') =>
      setTextSettings({ alignment }),
    [setTextSettings],
  );

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
          <Type className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">
          Text Options
        </h3>
      </div>

      {/* Font Family */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          Font Family
        </label>
        <div className="relative">
          <select
            value={textSettings.fontFamily}
            onChange={handleFontFamily}
            className="w-full cursor-pointer appearance-none rounded-lg border border-neutral-200 bg-white/70 px-3 py-2 pr-8 text-sm text-neutral-800 shadow-sm backdrop-blur-md transition-colors hover:border-emerald-300 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-neutral-700 dark:bg-neutral-800/70 dark:text-neutral-100 dark:hover:border-emerald-600 dark:focus:border-emerald-500"
            style={{ fontFamily: textSettings.fontFamily }}
          >
            {AVAILABLE_FONTS.map((font) => (
              <option key={font} value={font} style={{ fontFamily: font }}>
                {font}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
        </div>
      </div>

      {/* Font Size & Color Row */}
      <div className="grid grid-cols-2 gap-3">
        {/* Font Size */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor={sizeId}
            className="text-[11px] font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400"
          >
            Size
          </label>
          <input
            id={sizeId}
            type="number"
            min={8}
            max={144}
            value={textSettings.fontSize}
            onChange={handleFontSize}
            className="w-full rounded-lg border border-neutral-200 bg-white/70 px-3 py-2 text-sm text-neutral-800 shadow-sm backdrop-blur-md transition-colors hover:border-emerald-300 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-neutral-700 dark:bg-neutral-800/70 dark:text-neutral-100 dark:hover:border-emerald-600 dark:focus:border-emerald-500"
          />
        </div>

        {/* Font Color */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor={colorId}
            className="text-[11px] font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400"
          >
            Color
          </label>
          <div className="relative flex items-center gap-2 rounded-lg border border-neutral-200 bg-white/70 px-3 py-1.5 shadow-sm backdrop-blur-md dark:border-neutral-700 dark:bg-neutral-800/70">
            <input
              id={colorId}
              type="color"
              value={textSettings.fontColor}
              onChange={handleFontColor}
              className="h-6 w-6 cursor-pointer rounded border-0 bg-transparent p-0 [&::-moz-color-swatch]:rounded [&::-moz-color-swatch]:border-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded [&::-webkit-color-swatch]:border-0"
            />
            <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400 uppercase">
              {textSettings.fontColor}
            </span>
          </div>
        </div>
      </div>

      {/* Text Style Toggles */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          Style
        </label>
        <div className="flex gap-1">
          <StyleToggle
            active={textSettings.bold}
            onClick={toggleBold}
            tooltip="Bold"
          >
            <Bold className="h-4 w-4" />
          </StyleToggle>
          <StyleToggle
            active={textSettings.italic}
            onClick={toggleItalic}
            tooltip="Italic"
          >
            <Italic className="h-4 w-4" />
          </StyleToggle>
          <StyleToggle
            active={textSettings.underline}
            onClick={toggleUnderline}
            tooltip="Underline"
          >
            <Underline className="h-4 w-4" />
          </StyleToggle>
        </div>
      </div>

      {/* Text Alignment */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          Alignment
        </label>
        <div className="flex gap-1">
          <StyleToggle
            active={textSettings.alignment === 'left'}
            onClick={() => setAlignment('left')}
            tooltip="Align Left"
          >
            <AlignLeft className="h-4 w-4" />
          </StyleToggle>
          <StyleToggle
            active={textSettings.alignment === 'center'}
            onClick={() => setAlignment('center')}
            tooltip="Align Center"
          >
            <AlignCenter className="h-4 w-4" />
          </StyleToggle>
          <StyleToggle
            active={textSettings.alignment === 'right'}
            onClick={() => setAlignment('right')}
            tooltip="Align Right"
          >
            <AlignRight className="h-4 w-4" />
          </StyleToggle>
        </div>
      </div>

      {/* Letter Spacing */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor={spacingId}
            className="text-[11px] font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400"
          >
            Letter Spacing
          </label>
          <span className="text-xs font-medium tabular-nums text-neutral-600 dark:text-neutral-300">
            {textSettings.letterSpacing}px
          </span>
        </div>
        <input
          id={spacingId}
          type="range"
          min={-5}
          max={20}
          step={0.5}
          value={textSettings.letterSpacing}
          onChange={handleLetterSpacing}
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-neutral-200 accent-emerald-500 dark:bg-neutral-700"
        />
      </div>

      {/* Live Preview */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          Preview
        </label>
        <div className="rounded-lg border border-neutral-200 bg-white/50 px-3 py-3 dark:border-neutral-700 dark:bg-neutral-800/50">
          <p
            className="truncate text-neutral-800 dark:text-neutral-100"
            style={{
              fontFamily: textSettings.fontFamily,
              fontSize: `${Math.min(textSettings.fontSize, 28)}px`,
              color: textSettings.fontColor,
              fontWeight: textSettings.bold ? 700 : 400,
              fontStyle: textSettings.italic ? 'italic' : 'normal',
              textDecoration: textSettings.underline ? 'underline' : 'none',
              letterSpacing: `${textSettings.letterSpacing}px`,
              textAlign: textSettings.alignment,
            }}
          >
            Sample Text
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ---- Style Toggle Button ----

function StyleToggle({
  active,
  onClick,
  tooltip,
  children,
}: {
  active: boolean;
  onClick: () => void;
  tooltip: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={tooltip}
      className={`flex h-9 w-9 items-center justify-center rounded-lg border text-sm transition-all duration-150 ${
        active
          ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600 shadow-sm dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-400'
          : 'border-transparent bg-neutral-100 text-neutral-500 hover:bg-neutral-200 hover:text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-200'
      }`}
    >
      {children}
    </button>
  );
}
