'use client';

import React from 'react';
import { useEditorStore, ToolType } from '@/store/use-editor-store';
import { MousePointer2, Type, Highlighter, PenTool, Eraser } from 'lucide-react';

// ─── Constants ───────────────────────────────────────────────────────

const TOOLS: { id: ToolType; icon: React.ReactNode; label: string }[] = [
  { id: 'select', icon: <MousePointer2 className="w-5 h-5" />, label: 'Select' },
  { id: 'text', icon: <Type className="w-5 h-5" />, label: 'Text' },
  { id: 'draw', icon: <PenTool className="w-5 h-5" />, label: 'Draw' },
  { id: 'highlight', icon: <Highlighter className="w-5 h-5" />, label: 'Highlight' },
  { id: 'eraser', icon: <Eraser className="w-5 h-5" />, label: 'Eraser' },
];

const PALETTE = [
  '#000000', '#ef4444', '#f97316', '#f59e0b', '#84cc16',
  '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef',
];

const HIGHLIGHT_PALETTE = [
  { label: 'Yellow', value: 'rgba(253, 224, 71, 0.5)' },
  { label: 'Green', value: 'rgba(134, 239, 172, 0.5)' },
  { label: 'Blue', value: 'rgba(147, 197, 253, 0.5)' },
  { label: 'Pink', value: 'rgba(249, 168, 212, 0.5)' },
];

// ─── Shared color swatch button ──────────────────────────────────────

function ColorSwatch({
  color,
  active,
  onClick,
}: {
  color: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-6 h-6 rounded-full border-2 transition-transform shadow-sm ${
        active ? 'border-indigo-500 scale-110' : 'border-transparent hover:scale-110'
      }`}
      style={{ backgroundColor: color }}
    />
  );
}

// ─── Component ───────────────────────────────────────────────────────

export default function EditorProperties() {
  const activeTool = useEditorStore((s) => s.activeTool);
  const setActiveTool = useEditorStore((s) => s.setActiveTool);
  const settings = useEditorStore((s) => s.toolSettings);
  const update = useEditorStore((s) => s.updateToolSettings);

  return (
    <aside className="w-64 border-l border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col h-full shrink-0 shadow-sm z-10">
      {/* Tool grid */}
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
        <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3">Tools</h3>
        <div className="grid grid-cols-5 gap-1.5">
          {TOOLS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTool(t.id)}
              title={t.label}
              className={`aspect-square rounded-xl flex items-center justify-center transition-all ${
                activeTool === t.id
                  ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30'
                  : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-400 border border-transparent'
              }`}
            >
              {t.icon}
            </button>
          ))}
        </div>
      </div>

      {/* Context-dependent settings */}
      <div className="p-4 flex-1 overflow-y-auto">
        {/* ── Select tool ─────────────────────────────────────────── */}
        {activeTool === 'select' && (
          <div className="text-sm text-neutral-500 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-800 p-3 rounded-xl border border-neutral-100 dark:border-neutral-700">
            <span className="font-bold text-neutral-700 dark:text-neutral-300">Pointer Tool</span>
            <p className="mt-1">Click on objects to move or resize them.</p>
          </div>
        )}

        {/* ── Text tool ───────────────────────────────────────────── */}
        {activeTool === 'text' && (
          <div className="space-y-5">
            <div>
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-2">
                Font Size
              </label>
              <input
                type="range"
                min={8}
                max={72}
                value={settings.fontSize}
                onChange={(e) => update({ fontSize: parseInt(e.target.value) })}
                className="w-full accent-indigo-500"
              />
              <div className="text-right text-xs text-neutral-500 font-medium">
                {settings.fontSize}px
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-2">
                Text Color
              </label>
              <div className="flex flex-wrap gap-2">
                {PALETTE.map((c) => (
                  <ColorSwatch
                    key={c}
                    color={c}
                    active={settings.textColor === c}
                    onClick={() => update({ textColor: c })}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-2">
                Font Family
              </label>
              <select
                value={settings.fontFamily}
                onChange={(e) => update({ fontFamily: e.target.value })}
                className="w-full text-sm p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200"
              >
                <option value="Helvetica">Helvetica</option>
                <option value="Times-Roman">Times New Roman</option>
                <option value="Courier">Courier</option>
              </select>
              <p className="text-[10px] text-neutral-400 mt-1">
                Standard PDF fonts for reliable export.
              </p>
            </div>
          </div>
        )}

        {/* ── Draw tool ───────────────────────────────────────────── */}
        {activeTool === 'draw' && (
          <div className="space-y-5">
            <div>
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-2">
                Stroke Width
              </label>
              <input
                type="range"
                min={1}
                max={20}
                value={settings.strokeWidth}
                onChange={(e) => update({ strokeWidth: parseInt(e.target.value) })}
                className="w-full accent-indigo-500"
              />
              <div className="text-right text-xs text-neutral-500 font-medium">
                {settings.strokeWidth}px
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-2">
                Stroke Color
              </label>
              <div className="flex flex-wrap gap-2">
                {PALETTE.map((c) => (
                  <ColorSwatch
                    key={c}
                    color={c}
                    active={settings.strokeColor === c}
                    onClick={() => update({ strokeColor: c })}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Highlight tool ──────────────────────────────────────── */}
        {activeTool === 'highlight' && (
          <div className="space-y-5">
            <div>
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-2">
                Marker Width
              </label>
              <input
                type="range"
                min={10}
                max={60}
                value={settings.strokeWidth}
                onChange={(e) => update({ strokeWidth: parseInt(e.target.value) })}
                className="w-full accent-indigo-500"
              />
              <div className="text-right text-xs text-neutral-500 font-medium">
                {settings.strokeWidth}px
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-2">
                Marker Color
              </label>
              <div className="flex flex-wrap gap-2">
                {HIGHLIGHT_PALETTE.map((h) => (
                  <ColorSwatch
                    key={h.value}
                    color={h.value}
                    active={settings.strokeColor === h.value}
                    onClick={() => update({ strokeColor: h.value })}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Eraser info ─────────────────────────────────────────── */}
        {activeTool === 'eraser' && (
          <div className="text-sm text-neutral-500 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-800 p-3 rounded-xl border border-neutral-100 dark:border-neutral-700">
            <span className="font-bold text-neutral-700 dark:text-neutral-300">Eraser Tool</span>
            <p className="mt-1">Click on annotations or drawing strokes to remove them. Full implementation coming in Phase 2.</p>
          </div>
        )}
      </div>
    </aside>
  );
}
