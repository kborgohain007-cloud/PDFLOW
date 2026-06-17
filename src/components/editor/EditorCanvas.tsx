'use client';

import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { useEditorStore } from '@/stores/editor-store';
import type {
  Annotation,
  TextAnnotation,
  DrawAnnotation,
  HighlightAnnotation,
  ShapeAnnotation,
  PageData,
} from '@/types/editor';

// Dynamic imports for Konva (client-only)
let Stage: any = null;
let Layer: any = null;
let Rect: any = null;
let Circle: any = null;
let Line: any = null;
let Arrow: any = null;
let Text: any = null;
let Image: any = null;
let Transformer: any = null;
let Group: any = null;

// ---- PDF Page Renderer ----

interface PageCanvasProps {
  page: PageData;
  pdfBytes: Uint8Array;
  zoom: number;
  annotations: Annotation[];
  isActive: boolean;
  activeTool: string;
  selectedAnnotationId: string | null;
  onPageClick: () => void;
}

function PageCanvas({
  page,
  pdfBytes,
  zoom,
  annotations,
  isActive,
  activeTool,
  selectedAnnotationId,
  onPageClick,
}: PageCanvasProps) {
  const pdfCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const transformerRef = useRef<any>(null);
  const [pdfRendered, setPdfRendered] = useState(false);
  const [konvaLoaded, setKonvaLoaded] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawPoints, setDrawPoints] = useState<number[]>([]);
  const [highlightStart, setHighlightStart] = useState<{ x: number; y: number } | null>(null);
  const [shapeStart, setShapeStart] = useState<{ x: number; y: number } | null>(null);
  const [tempShape, setTempShape] = useState<{ x: number; y: number; w: number; h: number } | null>(null);

  const addAnnotation = useEditorStore((s) => s.addAnnotation);
  const updateAnnotation = useEditorStore((s) => s.updateAnnotation);
  const deleteAnnotation = useEditorStore((s) => s.deleteAnnotation);
  const setSelectedAnnotation = useEditorStore((s) => s.setSelectedAnnotation);
  const textSettings = useEditorStore((s) => s.textSettings);
  const drawSettings = useEditorStore((s) => s.drawSettings);
  const highlightSettings = useEditorStore((s) => s.highlightSettings);
  const shapeSettings = useEditorStore((s) => s.shapeSettings);

  const scaledWidth = page.width * zoom;
  const scaledHeight = page.height * zoom;

  // Load Konva components dynamically
  useEffect(() => {
    async function loadKonva() {
      const RK = await import('react-konva');
      Stage = RK.Stage;
      Layer = RK.Layer;
      Rect = RK.Rect;
      Circle = RK.Circle;
      Line = RK.Line;
      Arrow = RK.Arrow;
      Text = RK.Text;
      Image = RK.Image;
      Transformer = RK.Transformer;
      Group = RK.Group;
      setKonvaLoaded(true);
    }
    loadKonva();
  }, []);

  // Render PDF page to canvas
  useEffect(() => {
    async function renderPdf() {
      if (!pdfCanvasRef.current || !pdfBytes) return;

      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

      const pdf = await pdfjsLib.getDocument({ data: pdfBytes }).promise;
      const pdfPage = await pdf.getPage(page.pageIndex + 1);
      const viewport = pdfPage.getViewport({ scale: zoom, rotation: page.rotation });

      const canvas = pdfCanvasRef.current;
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const ctx = canvas.getContext('2d')!;
      await pdfPage.render({ canvas, canvasContext: ctx, viewport } as any).promise;
      setPdfRendered(true);
    }

    renderPdf();
  }, [pdfBytes, page.pageIndex, page.rotation, zoom]);

  // Generate annotation ID
  const genId = () => `ann-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  // ---- Stage Event Handlers ----

  const handleStageMouseDown = useCallback(
    (e: any) => {
      const stage = e.target.getStage();
      const pos = stage.getPointerPosition();
      if (!pos) return;

      // If clicking on empty area in select mode, deselect
      if (e.target === stage) {
        setSelectedAnnotation(null);
      }

      if (activeTool === 'draw') {
        setIsDrawing(true);
        setDrawPoints([pos.x, pos.y]);
      } else if (activeTool === 'highlight') {
        setHighlightStart({ x: pos.x, y: pos.y });
      } else if (activeTool === 'shape') {
        setShapeStart({ x: pos.x, y: pos.y });
      } else if (activeTool === 'text' && e.target === stage) {
        // Add text annotation where clicked
        const newText: TextAnnotation = {
          id: genId(),
          type: 'text',
          pageId: page.id,
          x: pos.x,
          y: pos.y,
          width: 200,
          height: 30,
          rotation: 0,
          opacity: 1,
          zIndex: annotations.length,
          locked: false,
          text: 'Type here...',
          fontFamily: textSettings.fontFamily,
          fontSize: textSettings.fontSize,
          fontColor: textSettings.fontColor,
          bold: textSettings.bold,
          italic: textSettings.italic,
          underline: textSettings.underline,
          letterSpacing: textSettings.letterSpacing,
          alignment: textSettings.alignment,
        };
        addAnnotation(page.id, newText);
        setSelectedAnnotation(newText.id);
      }
    },
    [activeTool, page.id, annotations.length, textSettings, addAnnotation, setSelectedAnnotation],
  );

  const handleStageMouseMove = useCallback(
    (e: any) => {
      const stage = e.target.getStage();
      const pos = stage.getPointerPosition();
      if (!pos) return;

      if (activeTool === 'draw' && isDrawing) {
        setDrawPoints((prev) => [...prev, pos.x, pos.y]);
      } else if (activeTool === 'highlight' && highlightStart) {
        setTempShape({
          x: Math.min(highlightStart.x, pos.x),
          y: Math.min(highlightStart.y, pos.y),
          w: Math.abs(pos.x - highlightStart.x),
          h: Math.abs(pos.y - highlightStart.y),
        });
      } else if (activeTool === 'shape' && shapeStart) {
        setTempShape({
          x: Math.min(shapeStart.x, pos.x),
          y: Math.min(shapeStart.y, pos.y),
          w: Math.abs(pos.x - shapeStart.x),
          h: Math.abs(pos.y - shapeStart.y),
        });
      }
    },
    [activeTool, isDrawing, highlightStart, shapeStart],
  );

  const handleStageMouseUp = useCallback(
    (e: any) => {
      const stage = e.target.getStage();
      const pos = stage.getPointerPosition();

      if (activeTool === 'draw' && isDrawing && drawPoints.length >= 4) {
        const newDraw: DrawAnnotation = {
          id: genId(),
          type: 'draw',
          pageId: page.id,
          x: 0,
          y: 0,
          width: scaledWidth,
          height: scaledHeight,
          rotation: 0,
          opacity: drawSettings.opacity,
          zIndex: annotations.length,
          locked: false,
          points: drawPoints,
          strokeColor: drawSettings.color,
          strokeWidth: drawSettings.brushSize,
          brushType: drawSettings.brushType,
        };
        addAnnotation(page.id, newDraw);
      }
      setIsDrawing(false);
      setDrawPoints([]);

      if (activeTool === 'highlight' && highlightStart && tempShape && tempShape.w > 5 && tempShape.h > 5) {
        const newHighlight: HighlightAnnotation = {
          id: genId(),
          type: 'highlight',
          pageId: page.id,
          x: tempShape.x,
          y: tempShape.y,
          width: tempShape.w,
          height: tempShape.h,
          rotation: 0,
          opacity: highlightSettings.opacity,
          zIndex: annotations.length,
          locked: false,
          color: highlightSettings.color,
        };
        addAnnotation(page.id, newHighlight);
      }
      setHighlightStart(null);

      if (activeTool === 'shape' && shapeStart && tempShape && tempShape.w > 5 && tempShape.h > 5) {
        const newShape: ShapeAnnotation = {
          id: genId(),
          type: 'shape',
          pageId: page.id,
          x: tempShape.x,
          y: tempShape.y,
          width: tempShape.w,
          height: tempShape.h,
          rotation: 0,
          opacity: 1,
          zIndex: annotations.length,
          locked: false,
          shapeType: shapeSettings.shapeType,
          strokeColor: shapeSettings.strokeColor,
          fillColor: shapeSettings.fillColor,
          strokeWidth: shapeSettings.strokeWidth,
        };
        addAnnotation(page.id, newShape);
      }
      setShapeStart(null);
      setTempShape(null);
    },
    [
      activeTool, isDrawing, drawPoints, highlightStart, shapeStart, tempShape,
      page.id, scaledWidth, scaledHeight, annotations.length,
      drawSettings, highlightSettings, shapeSettings, addAnnotation,
    ],
  );

  // Handle annotation click (select or erase)
  const handleAnnotationClick = useCallback(
    (annotation: Annotation) => {
      if (activeTool === 'eraser') {
        deleteAnnotation(page.id, annotation.id);
      } else {
        setSelectedAnnotation(annotation.id);
      }
    },
    [activeTool, page.id, deleteAnnotation, setSelectedAnnotation],
  );

  // Handle annotation drag end
  const handleAnnotationDragEnd = useCallback(
    (annotation: Annotation, e: any) => {
      updateAnnotation(page.id, annotation.id, {
        x: e.target.x(),
        y: e.target.y(),
      });
    },
    [page.id, updateAnnotation],
  );

  // ---- Render Annotations ----

  const renderAnnotation = useCallback(
    (ann: Annotation) => {
      if (!konvaLoaded) return null;
      const isSelected = selectedAnnotationId === ann.id;
      const draggable = activeTool === 'select' && !ann.locked;

      switch (ann.type) {
        case 'text':
          return (
            <Text
              key={ann.id}
              x={ann.x}
              y={ann.y}
              text={ann.text}
              fontSize={ann.fontSize}
              fontFamily={ann.fontFamily}
              fill={ann.fontColor}
              fontStyle={`${ann.bold ? 'bold' : ''} ${ann.italic ? 'italic' : ''}`}
              textDecoration={ann.underline ? 'underline' : ''}
              align={ann.alignment}
              letterSpacing={ann.letterSpacing}
              opacity={ann.opacity}
              draggable={draggable}
              onClick={() => handleAnnotationClick(ann)}
              onTap={() => handleAnnotationClick(ann)}
              onDragEnd={(e: any) => handleAnnotationDragEnd(ann, e)}
              onDblClick={() => {
                // TODO: Inline text editing in Phase 2
              }}
            />
          );

        case 'draw':
          return (
            <Line
              key={ann.id}
              points={ann.points}
              stroke={ann.strokeColor}
              strokeWidth={ann.strokeWidth}
              opacity={ann.opacity}
              lineCap="round"
              lineJoin="round"
              tension={0.3}
              globalCompositeOperation={
                ann.brushType === 'marker' ? 'multiply' : 'source-over'
              }
              onClick={() => handleAnnotationClick(ann)}
              onTap={() => handleAnnotationClick(ann)}
              hitStrokeWidth={20}
            />
          );

        case 'highlight':
          return (
            <Rect
              key={ann.id}
              x={ann.x}
              y={ann.y}
              width={ann.width}
              height={ann.height}
              fill={ann.color}
              opacity={ann.opacity}
              draggable={draggable}
              onClick={() => handleAnnotationClick(ann)}
              onTap={() => handleAnnotationClick(ann)}
              onDragEnd={(e: any) => handleAnnotationDragEnd(ann, e)}
              cornerRadius={2}
            />
          );

        case 'shape': {
          const shapeProps = {
            x: ann.x,
            y: ann.y,
            stroke: ann.strokeColor,
            strokeWidth: ann.strokeWidth,
            fill: ann.fillColor === 'transparent' ? undefined : ann.fillColor,
            opacity: ann.opacity,
            draggable: draggable,
            onClick: () => handleAnnotationClick(ann),
            onTap: () => handleAnnotationClick(ann),
            onDragEnd: (e: any) => handleAnnotationDragEnd(ann, e),
          };

          switch (ann.shapeType) {
            case 'rectangle':
              return (
                <Rect
                  key={ann.id}
                  {...shapeProps}
                  width={ann.width}
                  height={ann.height}
                  cornerRadius={3}
                />
              );
            case 'circle':
              return (
                <Circle
                  key={ann.id}
                  {...shapeProps}
                  x={ann.x + ann.width / 2}
                  y={ann.y + ann.height / 2}
                  radiusX={ann.width / 2}
                  radiusY={ann.height / 2}
                  radius={Math.min(ann.width, ann.height) / 2}
                />
              );
            case 'arrow':
              return (
                <Arrow
                  key={ann.id}
                  points={[ann.x, ann.y, ann.x + ann.width, ann.y + ann.height]}
                  stroke={ann.strokeColor}
                  strokeWidth={ann.strokeWidth}
                  fill={ann.strokeColor}
                  opacity={ann.opacity}
                  draggable={draggable}
                  onClick={() => handleAnnotationClick(ann)}
                  onTap={() => handleAnnotationClick(ann)}
                  onDragEnd={(e: any) => handleAnnotationDragEnd(ann, e)}
                  pointerLength={10}
                  pointerWidth={10}
                />
              );
            case 'line':
              return (
                <Line
                  key={ann.id}
                  points={[ann.x, ann.y, ann.x + ann.width, ann.y + ann.height]}
                  stroke={ann.strokeColor}
                  strokeWidth={ann.strokeWidth}
                  opacity={ann.opacity}
                  draggable={draggable}
                  onClick={() => handleAnnotationClick(ann)}
                  onTap={() => handleAnnotationClick(ann)}
                  onDragEnd={(e: any) => handleAnnotationDragEnd(ann, e)}
                />
              );
            default:
              return null;
          }
        }

        default:
          return null;
      }
    },
    [konvaLoaded, selectedAnnotationId, activeTool, handleAnnotationClick, handleAnnotationDragEnd],
  );

  // Cursor style based on active tool
  const cursorStyle = useMemo(() => {
    switch (activeTool) {
      case 'text': return 'text';
      case 'draw': return 'crosshair';
      case 'highlight': return 'crosshair';
      case 'shape': return 'crosshair';
      case 'eraser': return 'pointer';
      default: return 'default';
    }
  }, [activeTool]);

  return (
    <div
      ref={containerRef}
      className={`relative mx-auto mb-6 shadow-xl rounded-lg overflow-hidden transition-shadow duration-200
        ${isActive ? 'ring-2 ring-emerald-500/50 shadow-emerald-500/10' : 'shadow-neutral-300 dark:shadow-neutral-800'}`}
      style={{
        width: scaledWidth,
        height: scaledHeight,
        cursor: cursorStyle,
      }}
      onClick={onPageClick}
    >
      {/* Layer 1: PDF Render */}
      <canvas
        ref={pdfCanvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ pointerEvents: 'none' }}
      />

      {/* Layer 2: Konva Interactive Overlay */}
      {konvaLoaded && Stage && pdfRendered && (
        <div className="absolute inset-0">
          <Stage
            width={scaledWidth}
            height={scaledHeight}
            onMouseDown={handleStageMouseDown}
            onMouseMove={handleStageMouseMove}
            onMouseUp={handleStageMouseUp}
            onTouchStart={handleStageMouseDown}
            onTouchMove={handleStageMouseMove}
            onTouchEnd={handleStageMouseUp}
          >
            <Layer>
              {/* Render existing annotations */}
              {annotations.map(renderAnnotation)}

              {/* Temp: Active drawing stroke */}
              {isDrawing && drawPoints.length >= 4 && Line && (
                <Line
                  points={drawPoints}
                  stroke={drawSettings.color}
                  strokeWidth={drawSettings.brushSize}
                  opacity={drawSettings.opacity}
                  lineCap="round"
                  lineJoin="round"
                  tension={0.3}
                />
              )}

              {/* Temp: Active highlight/shape preview */}
              {tempShape && (activeTool === 'highlight' || activeTool === 'shape') && Rect && (
                <Rect
                  x={tempShape.x}
                  y={tempShape.y}
                  width={tempShape.w}
                  height={tempShape.h}
                  fill={
                    activeTool === 'highlight'
                      ? highlightSettings.color
                      : shapeSettings.fillColor === 'transparent'
                        ? undefined
                        : shapeSettings.fillColor
                  }
                  stroke={
                    activeTool === 'shape' ? shapeSettings.strokeColor : undefined
                  }
                  strokeWidth={
                    activeTool === 'shape' ? shapeSettings.strokeWidth : 0
                  }
                  opacity={
                    activeTool === 'highlight' ? highlightSettings.opacity : 0.5
                  }
                  dash={[6, 3]}
                  cornerRadius={2}
                />
              )}
            </Layer>
          </Stage>
        </div>
      )}
    </div>
  );
}

// ---- Main Editor Canvas (Scrollable Multi-Page) ----

export default function EditorCanvas() {
  const pdfBytes = useEditorStore((s) => s.pdfBytes);
  const pageOrder = useEditorStore((s) => s.pageOrder);
  const pages = useEditorStore((s) => s.pages);
  const annotations = useEditorStore((s) => s.annotations);
  const activePageId = useEditorStore((s) => s.activePageId);
  const activeTool = useEditorStore((s) => s.activeTool);
  const selectedAnnotationId = useEditorStore((s) => s.selectedAnnotationId);
  const zoom = useEditorStore((s) => s.zoom);
  const setActivePageId = useEditorStore((s) => s.setActivePageId);
  const setZoom = useEditorStore((s) => s.setZoom);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Ctrl+scroll to zoom
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        setZoom(zoom + delta);
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [zoom, setZoom]);

  // Visible (non-deleted) pages in order
  const visiblePages = useMemo(() => {
    return pageOrder
      .map((id) => pages.find((p) => p.id === id))
      .filter((p): p is PageData => !!p && !p.deleted);
  }, [pageOrder, pages]);

  if (!pdfBytes || visiblePages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-neutral-400 dark:text-neutral-600">
        <p className="text-sm">No pages to display</p>
      </div>
    );
  }

  return (
    <div
      ref={scrollContainerRef}
      className="flex-1 overflow-auto bg-neutral-200/50 dark:bg-neutral-950/50 py-8"
    >
      <div className="flex flex-col items-center gap-2 px-4">
        {visiblePages.map((page) => (
          <PageCanvas
            key={page.id}
            page={page}
            pdfBytes={pdfBytes}
            zoom={zoom}
            annotations={annotations[page.id] || []}
            isActive={activePageId === page.id}
            activeTool={activeTool}
            selectedAnnotationId={selectedAnnotationId}
            onPageClick={() => setActivePageId(page.id)}
          />
        ))}
      </div>
    </div>
  );
}
