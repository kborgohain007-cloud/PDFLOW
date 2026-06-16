'use client';

import React from 'react';
import { useEditorStore, ToolType } from '@/store/use-editor-store';
import { MousePointer2, Type, Highlighter, PenTool, Eraser } from 'lucide-react';

export default function EditorProperties() {
  const activeTool = useEditorStore(state => state.activeTool);
  const setActiveTool = useEditorStore(state => state.setActiveTool);
  const toolSettings = useEditorStore(state => state.toolSettings);
  const updateToolSettings = useEditorStore(state => state.updateToolSettings);

  const tools: { id: ToolType; icon: React.ReactNode; label: string }[] = [
    { id: 'select', icon: <MousePointer2 className="w-5 h-5" />, label: 'Select' },
    { id: 'text', icon: <Type className="w-5 h-5" />, label: 'Text' },
    { id: 'draw', icon: <PenTool className="w-5 h-5" />, label: 'Draw' },
    { id: 'highlight', icon: <Highlighter className="w-5 h-5" />, label: 'Highlight' },
    { id: 'eraser', icon: <Eraser className="w-5 h-5" />, label: 'Eraser' },
  ];

  const colors = [
    '#000000', '#ef4444', '#f97316', '#f59e0b', '#84cc16', 
    '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef'
  ];
  
  const highlightColors = [
    'rgba(253, 224, 71, 0.5)', // Yellow
    'rgba(134, 239, 172, 0.5)', // Green
    'rgba(147, 197, 253, 0.5)', // Blue
    'rgba(249, 168, 212, 0.5)'  // Pink
  ];

  return (
    <div className="w-64 border-l border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col h-full shrink-0 shadow-sm z-10">
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
        <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3">Tools</h3>
        <div className="grid grid-cols-5 gap-1.5">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              title={tool.label}
              className={`aspect-square rounded-xl flex items-center justify-center transition-all ${
                activeTool === tool.id 
                  ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30' 
                  : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-400 border border-transparent'
              }`}
            >
              {tool.icon}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        {/* TEXT TOOL SETTINGS */}
        {activeTool === 'text' && (
          <div className="space-y-5">
            <div>
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-2">Font Size</label>
              <input 
                type="range" 
                min="8" max="72" 
                value={toolSettings.fontSize}
                onChange={(e) => updateToolSettings({ fontSize: parseInt(e.target.value) })}
                className="w-full accent-indigo-500"
              />
              <div className="text-right text-xs text-neutral-500 font-medium">{toolSettings.fontSize}px</div>
            </div>
            <div>
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-2">Text Color</label>
              <div className="flex flex-wrap gap-2">
                {colors.map(color => (
                  <button
                    key={color}
                    onClick={() => updateToolSettings({ textColor: color })}
                    className={`w-6 h-6 rounded-full border-2 ${toolSettings.textColor === color ? 'border-indigo-500 scale-110' : 'border-transparent hover:scale-110'} transition-transform shadow-sm`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-2">Font Family</label>
              <select 
                value={toolSettings.fontFamily}
                onChange={(e) => updateToolSettings({ fontFamily: e.target.value })}
                className="w-full text-sm p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200"
              >
                <option value="Helvetica">Helvetica (Standard)</option>
                <option value="Times-Roman">Times New Roman (Standard)</option>
                <option value="Courier">Courier (Standard)</option>
              </select>
              <p className="text-[10px] text-neutral-400 mt-1">Phase 1 uses standard fonts for high-speed export.</p>
            </div>
          </div>
        )}

        {/* DRAW TOOL SETTINGS */}
        {activeTool === 'draw' && (
          <div className="space-y-5">
            <div>
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-2">Stroke Width</label>
              <input 
                type="range" 
                min="1" max="20" 
                value={toolSettings.strokeWidth}
                onChange={(e) => updateToolSettings({ strokeWidth: parseInt(e.target.value) })}
                className="w-full accent-indigo-500"
              />
              <div className="text-right text-xs text-neutral-500 font-medium">{toolSettings.strokeWidth}px</div>
            </div>
            <div>
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-2">Stroke Color</label>
              <div className="flex flex-wrap gap-2">
                {colors.map(color => (
                  <button
                    key={color}
                    onClick={() => updateToolSettings({ strokeColor: color })}
                    className={`w-6 h-6 rounded-full border-2 ${toolSettings.strokeColor === color ? 'border-indigo-500 scale-110' : 'border-transparent hover:scale-110'} transition-transform shadow-sm`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* HIGHLIGHT TOOL SETTINGS */}
        {activeTool === 'highlight' && (
          <div className="space-y-5">
            <div>
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-2">Marker Width</label>
              <input 
                type="range" 
                min="10" max="60" 
                value={toolSettings.strokeWidth}
                onChange={(e) => updateToolSettings({ strokeWidth: parseInt(e.target.value) })}
                className="w-full accent-indigo-500"
              />
              <div className="text-right text-xs text-neutral-500 font-medium">{toolSettings.strokeWidth}px</div>
            </div>
            <div>
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-2">Marker Color</label>
              <div className="flex flex-wrap gap-2">
                {highlightColors.map(color => (
                  <button
                    key={color}
                    onClick={() => updateToolSettings({ strokeColor: color })}
                    className={`w-6 h-6 rounded-full border-2 ${toolSettings.strokeColor === color ? 'border-indigo-500 scale-110' : 'border-transparent hover:scale-110'} transition-transform shadow-sm`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* SELECT TOOL EXPLANATION */}
        {activeTool === 'select' && (
          <div className="text-sm text-neutral-500 dark:text-neutral-400 mt-4 bg-neutral-50 dark:bg-neutral-800 p-3 rounded-xl border border-neutral-100 dark:border-neutral-700">
            <span className="font-bold text-neutral-700 dark:text-neutral-300">Pointer Tool</span>
            <p className="mt-1">Click on objects like text blocks to move or resize them.</p>
          </div>
        )}
      </div>
    </div>
  );
}
