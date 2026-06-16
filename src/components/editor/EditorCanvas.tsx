'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useEditorStore, DrawingOperation, TextOperation } from '@/store/use-editor-store';
import { ZoomIn, ZoomOut, Minus, Plus } from 'lucide-react';

// ─── Single Page Renderer ────────────────────────────────────────────
function PageRenderer({ pageState, isActive }: { pageState: any; isActive: boolean }) {
  const pdfCanvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const textInputRef = useRef<HTMLTextAreaElement>(null);

  const documents = useEditorStore(s => s.documents);
  const activeTool = useEditorStore(s => s.activeTool);
  const toolSettings = useEditorStore(s => s.toolSettings);
  const addOperation = useEditorStore(s => s.addOperation);
  const setActivePage = useEditorStore(s => s.setActivePage);
  const zoomLevel = useEditorStore(s => s.zoomLevel);

  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<number[]>([]);
  const [textInput, setTextInput] = useState<{ x: number; y: number; visible: boolean }>({ x: 0, y: 0, visible: false });
  const [textValue, setTextValue] = useState('');

  const scale = zoomLevel / 100;

  // Render the PDF page onto the background canvas
  useEffect(() => {
    let renderTask: any = null;

    const render = async () => {
      if (!pdfCanvasRef.current || documents.length === 0) return;

      const doc = documents.find(d => d.id === pageState.documentId);
      if (!doc) return;

      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

      const pdf = await pdfjsLib.getDocument({ data: doc.originalBuffer }).promise;
      const page = await pdf.getPage(pageState.originalPageIndex + 1);
      const viewport = page.getViewport({ scale: scale, rotation: pageState.rotation });

      const canvas = pdfCanvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      renderTask = page.render({ canvasContext: ctx, viewport, canvas } as any);

      try {
        await renderTask.promise;
      } catch (err: any) {
        if (err?.name !== 'RenderingCancelledException') console.error(err);
      }
    };

    render();

    return () => {
      if (renderTask) renderTask.cancel();
    };
  }, [pageState.documentId, pageState.originalPageIndex, pageState.rotation, documents, scale]);

  // Re-render the overlay canvas whenever operations change
  useEffect(() => {
    if (!overlayCanvasRef.current || !pdfCanvasRef.current) return;

    const overlay = overlayCanvasRef.current;
    const ctx = overlay.getContext('2d');
    if (!ctx) return;

    overlay.width = pdfCanvasRef.current.width;
    overlay.height = pdfCanvasRef.current.height;
    ctx.clearRect(0, 0, overlay.width, overlay.height);

    for (const op of pageState.operations) {
      if (op.type === 'draw' || op.type === 'highlight') {
        const pts = op.points;
        if (pts.length < 4) continue;

        ctx.save();
        ctx.globalAlpha = op.opacity;
        ctx.strokeStyle = op.stroke;
        ctx.lineWidth = op.strokeWidth * scale;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        if (op.type === 'highlight') {
          ctx.globalCompositeOperation = 'multiply';
        }

        ctx.beginPath();
        ctx.moveTo(pts[0] * scale, pts[1] * scale);
        for (let i = 2; i < pts.length; i += 2) {
          ctx.lineTo(pts[i] * scale, pts[i + 1] * scale);
        }
        ctx.stroke();
        ctx.restore();
      } else if (op.type === 'text') {
        ctx.save();
        ctx.globalAlpha = 1;
        const style = op.isBold ? 'bold ' : '';
        const italic = op.isItalic ? 'italic ' : '';
        ctx.font = `${italic}${style}${op.fontSize * scale}px ${op.fontFamily}, sans-serif`;
        ctx.fillStyle = op.fill;
        ctx.fillText(op.text, op.x * scale, op.y * scale + op.fontSize * scale);
        ctx.restore();
      }
    }
  }, [pageState.operations, scale]);

  // ─── Mouse / Pointer Handlers ──────────────────────────────────────
  const getCanvasCoords = (e: React.MouseEvent): { x: number; y: number } => {
    const rect = overlayCanvasRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: (e.clientX - rect.left) / scale,
      y: (e.clientY - rect.top) / scale,
    };
  };

  const handlePointerDown = (e: React.MouseEvent) => {
    setActivePage(pageState.id);

    if (activeTool === 'draw' || activeTool === 'highlight') {
      const { x, y } = getCanvasCoords(e);
      setIsDrawing(true);
      setCurrentPath([x, y]);
    }

    if (activeTool === 'text') {
      const { x, y } = getCanvasCoords(e);
      setTextInput({ x, y, visible: true });
      setTextValue('');
      setTimeout(() => textInputRef.current?.focus(), 50);
    }
  };

  const handlePointerMove = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    const { x, y } = getCanvasCoords(e);
    setCurrentPath(prev => [...prev, x, y]);

    // Live preview stroke on the overlay
    const overlay = overlayCanvasRef.current;
    const ctx = overlay?.getContext('2d');
    if (!ctx || !overlay) return;

    // Clear and redraw all existing ops + in-progress stroke
    ctx.clearRect(0, 0, overlay.width, overlay.height);

    // Existing ops
    for (const op of pageState.operations) {
      if (op.type === 'draw' || op.type === 'highlight') {
        const pts = op.points;
        if (pts.length < 4) continue;
        ctx.save();
        ctx.globalAlpha = op.opacity;
        ctx.strokeStyle = op.stroke;
        ctx.lineWidth = op.strokeWidth * scale;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        if (op.type === 'highlight') ctx.globalCompositeOperation = 'multiply';
        ctx.beginPath();
        ctx.moveTo(pts[0] * scale, pts[1] * scale);
        for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i] * scale, pts[i + 1] * scale);
        ctx.stroke();
        ctx.restore();
      } else if (op.type === 'text') {
        ctx.save();
        const style = op.isBold ? 'bold ' : '';
        const italic = op.isItalic ? 'italic ' : '';
        ctx.font = `${italic}${style}${op.fontSize * scale}px ${op.fontFamily}, sans-serif`;
        ctx.fillStyle = op.fill;
        ctx.fillText(op.text, op.x * scale, op.y * scale + op.fontSize * scale);
        ctx.restore();
      }
    }

    // In-progress stroke
    const allPts = [...currentPath, x, y];
    ctx.save();
    ctx.globalAlpha = activeTool === 'highlight' ? 0.4 : toolSettings.opacity;
    ctx.strokeStyle = toolSettings.strokeColor;
    ctx.lineWidth = toolSettings.strokeWidth * scale;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    if (activeTool === 'highlight') ctx.globalCompositeOperation = 'multiply';
    ctx.beginPath();
    ctx.moveTo(allPts[0] * scale, allPts[1] * scale);
    for (let i = 2; i < allPts.length; i += 2) ctx.lineTo(allPts[i] * scale, allPts[i + 1] * scale);
    ctx.stroke();
    ctx.restore();
  };

  const handlePointerUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if (currentPath.length >= 4) {
      const opType = activeTool === 'highlight' ? 'highlight' : 'draw';
      const newOp: DrawingOperation = {
        id: crypto.randomUUID(),
        type: opType as 'draw' | 'highlight',
        points: currentPath,
        stroke: toolSettings.strokeColor,
        strokeWidth: toolSettings.strokeWidth,
        opacity: activeTool === 'highlight' ? 0.4 : toolSettings.opacity,
      };
      addOperation(pageState.id, newOp);
    }
    setCurrentPath([]);
  };

  const commitText = () => {
    if (textValue.trim() && textInput.visible) {
      const newOp: TextOperation = {
        id: crypto.randomUUID(),
        type: 'text',
        text: textValue.trim(),
        x: textInput.x,
        y: textInput.y,
        fontSize: toolSettings.fontSize,
        fontFamily: toolSettings.fontFamily,
        fill: toolSettings.textColor,
      };
      addOperation(pageState.id, newOp);
    }
    setTextInput({ x: 0, y: 0, visible: false });
    setTextValue('');
  };

  const handleTextKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      commitText();
    }
    if (e.key === 'Escape') {
      setTextInput({ x: 0, y: 0, visible: false });
      setTextValue('');
    }
  };

  const canvasWidth = (pageState.rotation % 180 !== 0 ? pageState.height : pageState.width) * scale;
  const canvasHeight = (pageState.rotation % 180 !== 0 ? pageState.width : pageState.height) * scale;

  return (
    <div
      ref={containerRef}
      className={`relative shrink-0 mx-auto shadow-xl rounded-sm transition-shadow duration-200 ${
        isActive ? 'ring-2 ring-indigo-500/60 shadow-indigo-500/10' : ''
      }`}
      style={{ width: canvasWidth, height: canvasHeight }}
      onClick={() => setActivePage(pageState.id)}
    >
      {/* PDF background layer */}
      <canvas
        ref={pdfCanvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Interactive overlay layer */}
      <canvas
        ref={overlayCanvasRef}
        className={`absolute inset-0 w-full h-full ${
          activeTool === 'draw' || activeTool === 'highlight'
            ? 'cursor-crosshair'
            : activeTool === 'text'
            ? 'cursor-text'
            : 'cursor-default'
        }`}
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
      />

      {/* Floating text input */}
      {textInput.visible && isActive && (
        <textarea
          ref={textInputRef}
          value={textValue}
          onChange={(e) => setTextValue(e.target.value)}
          onBlur={commitText}
          onKeyDown={handleTextKeyDown}
          placeholder="Type here..."
          className="absolute z-30 bg-white/90 dark:bg-neutral-900/90 border-2 border-indigo-500 rounded-lg p-2 text-sm shadow-lg backdrop-blur-sm resize-none outline-none min-w-[120px] min-h-[40px]"
          style={{
            left: textInput.x * scale,
            top: textInput.y * scale,
            fontSize: toolSettings.fontSize * scale * 0.6,
            color: toolSettings.textColor,
            fontFamily: toolSettings.fontFamily,
          }}
        />
      )}
    </div>
  );
}

// ─── Main EditorCanvas ───────────────────────────────────────────────
export default function EditorCanvas() {
  const pages = useEditorStore(s => s.pages);
  const activePageId = useEditorStore(s => s.activePageId);
  const zoomLevel = useEditorStore(s => s.zoomLevel);
  const setZoom = useEditorStore(s => s.setZoom);
  const undo = useEditorStore(s => s.undo);
  const redo = useEditorStore(s => s.redo);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Global keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        redo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [undo, redo]);

  // Zoom with ctrl+scroll
  const handleWheel = useCallback((e: WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -10 : 10;
      setZoom(zoomLevel + delta);
    }
  }, [zoomLevel, setZoom]);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) {
      el.addEventListener('wheel', handleWheel, { passive: false });
      return () => el.removeEventListener('wheel', handleWheel);
    }
  }, [handleWheel]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-neutral-200 dark:bg-neutral-950/80 relative">
      {/* Scrollable page area */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-auto p-8"
        style={{ backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.05) 1px, transparent 1px)', backgroundSize: '20px 20px' }}
      >
        <div className="flex flex-col items-center gap-8 pb-20">
          {pages.map((page) => (
            <PageRenderer
              key={page.id}
              pageState={page}
              isActive={activePageId === page.id}
            />
          ))}
        </div>
      </div>

      {/* Bottom Zoom Controls */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 rounded-2xl px-4 py-2.5 shadow-lg z-20">
        <button
          onClick={() => setZoom(zoomLevel - 25)}
          disabled={zoomLevel <= 25}
          className="p-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 disabled:opacity-30 transition-colors"
        >
          <Minus className="w-4 h-4" />
        </button>

        <div className="w-32 flex items-center gap-2">
          <input
            type="range"
            min={25}
            max={400}
            step={5}
            value={zoomLevel}
            onChange={(e) => setZoom(parseInt(e.target.value))}
            className="w-full accent-indigo-500 h-1"
          />
        </div>

        <button
          onClick={() => setZoom(zoomLevel + 25)}
          disabled={zoomLevel >= 400}
          className="p-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 disabled:opacity-30 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>

        <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 w-12 text-center tabular-nums">
          {zoomLevel}%
        </span>
      </div>
    </div>
  );
}
