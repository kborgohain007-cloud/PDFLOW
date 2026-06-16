'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useEditorStore, CanvasOperation, DrawingOperation, TextOperation } from '@/store/use-editor-store';
import * as pdfjsLib from 'pdfjs-dist';
import dynamic from 'next/dynamic';

// Konva components must be loaded dynamically because they access window/document
const Stage = dynamic(() => import('react-konva').then((mod) => mod.Stage), { ssr: false });
const Layer = dynamic(() => import('react-konva').then((mod) => mod.Layer), { ssr: false });
const Line = dynamic(() => import('react-konva').then((mod) => mod.Line), { ssr: false });
const Text = dynamic(() => import('react-konva').then((mod) => mod.Text), { ssr: false });

export default function EditorCanvas() {
  const activePageId = useEditorStore(state => state.activePageId);
  const pages = useEditorStore(state => state.pages);
  const documents = useEditorStore(state => state.documents);
  const zoomLevel = useEditorStore(state => state.zoomLevel);
  const activeTool = useEditorStore(state => state.activeTool);
  const toolSettings = useEditorStore(state => state.toolSettings);
  const addOperation = useEditorStore(state => state.addOperation);
  const updateOperation = useEditorStore(state => state.updateOperation);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentLine, setCurrentLine] = useState<DrawingOperation | null>(null);

  const activePage = pages.find(p => p.id === activePageId);
  const activeDoc = activePage ? documents.find(d => d.id === activePage.documentId) : null;

  // Render Background PDF
  useEffect(() => {
    let renderTask: any = null;
    let isCancelled = false;

    const renderPdfPage = async () => {
      if (!canvasRef.current || !activePage || !activeDoc) return;

      const pdf = await pdfjsLib.getDocument({ data: activeDoc.originalBuffer }).promise;
      const pdfPage = await pdf.getPage(activePage.originalPageIndex + 1);
      
      const scale = zoomLevel / 100;
      const viewport = pdfPage.getViewport({ scale, rotation: activePage.rotation });
      
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (!context) return;

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      renderTask = pdfPage.render({
        canvasContext: context,
        viewport: viewport
      } as any);

      try {
        await renderTask.promise;
      } catch (err: any) {
        if (err.name !== 'RenderingCancelledException') {
          console.error(err);
        }
      }
    };

    renderPdfPage();

    return () => {
      isCancelled = true;
      if (renderTask) {
        renderTask.cancel();
      }
    };
  }, [activePageId, activePage?.rotation, zoomLevel, documents]);

  if (!activePage || !activeDoc) {
    return <div className="flex-1 bg-neutral-200 dark:bg-neutral-900 flex items-center justify-center">Select a page</div>;
  }

  const scale = zoomLevel / 100;
  // Approximated scaled dimensions based on base dimensions
  const scaledWidth = activePage.width * scale;
  const scaledHeight = activePage.height * scale;

  // Handle Canvas Mouse Events
  const handleMouseDown = (e: any) => {
    if (activeTool === 'select') return;
    
    const pos = e.target.getStage().getPointerPosition();
    if (!pos) return;

    if (activeTool === 'draw' || activeTool === 'highlight') {
      setIsDrawing(true);
      setCurrentLine({
        id: crypto.randomUUID(),
        type: activeTool,
        points: [pos.x / scale, pos.y / scale], // store normalized coords
        stroke: toolSettings.strokeColor,
        strokeWidth: toolSettings.strokeWidth,
        opacity: activeTool === 'highlight' ? 0.5 : toolSettings.opacity
      });
    }

    if (activeTool === 'text') {
      const newTextOp: TextOperation = {
        id: crypto.randomUUID(),
        type: 'text',
        text: 'Double click to edit',
        x: pos.x / scale,
        y: pos.y / scale,
        fontSize: toolSettings.fontSize,
        fontFamily: toolSettings.fontFamily,
        fill: toolSettings.textColor,
      };
      addOperation(activePageId as string, newTextOp);
    }
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing || !currentLine) return;
    
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    if (!point) return;

    setCurrentLine({
      ...currentLine,
      points: currentLine.points.concat([point.x / scale, point.y / scale])
    });
  };

  const handleMouseUp = () => {
    if (isDrawing && currentLine) {
      addOperation(activePageId as string, currentLine);
    }
    setIsDrawing(false);
    setCurrentLine(null);
  };

  return (
    <div className="flex-1 overflow-auto bg-neutral-200 dark:bg-neutral-900 custom-scrollbar flex p-8 justify-center items-start">
      <div 
        className="relative bg-white shadow-xl transition-all"
        style={{ 
          width: scaledWidth, 
          height: scaledHeight,
          cursor: activeTool === 'draw' || activeTool === 'highlight' ? 'crosshair' : activeTool === 'text' ? 'text' : 'default'
        }}
      >
        {/* PDF Background Render */}
        <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

        {/* Konva Interactive Layer */}
        <div className="absolute inset-0">
          {/* Note: Konva Stage dynamic import requires checking for rendering safety */}
          <Stage 
            width={scaledWidth} 
            height={scaledHeight}
            onMouseDown={handleMouseDown}
            onMousemove={handleMouseMove}
            onMouseup={handleMouseUp}
          >
            <Layer>
              {activePage.operations.map((op) => {
                if (op.type === 'draw' || op.type === 'highlight') {
                  const dOp = op as DrawingOperation;
                  return (
                    <Line
                      key={dOp.id}
                      points={dOp.points.map(p => p * scale)} // scale points for view
                      stroke={dOp.stroke}
                      strokeWidth={dOp.strokeWidth * scale}
                      tension={0.5}
                      lineCap="round"
                      lineJoin="round"
                      opacity={dOp.opacity}
                      globalCompositeOperation={
                        dOp.type === 'highlight' ? 'multiply' : 'source-over'
                      }
                    />
                  );
                }
                
                if (op.type === 'text') {
                  const tOp = op as TextOperation;
                  return (
                    <Text
                      key={tOp.id}
                      x={tOp.x * scale}
                      y={tOp.y * scale}
                      text={tOp.text}
                      fontSize={tOp.fontSize * scale}
                      fontFamily={tOp.fontFamily}
                      fill={tOp.fill}
                      draggable={activeTool === 'select'}
                      onDragEnd={(e) => {
                        updateOperation(activePageId as string, tOp.id, {
                          x: e.target.x() / scale,
                          y: e.target.y() / scale
                        });
                      }}
                      onDblClick={(e) => {
                        if (activeTool === 'select') {
                          const newText = window.prompt('Edit Text:', tOp.text);
                          if (newText !== null) {
                            updateOperation(activePageId as string, tOp.id, { text: newText });
                          }
                        }
                      }}
                    />
                  );
                }
                
                return null;
              })}

              {/* Draw current line in progress */}
              {isDrawing && currentLine && (
                <Line
                  points={currentLine.points.map(p => p * scale)}
                  stroke={currentLine.stroke}
                  strokeWidth={currentLine.strokeWidth * scale}
                  tension={0.5}
                  lineCap="round"
                  lineJoin="round"
                  opacity={currentLine.opacity}
                  globalCompositeOperation={
                    currentLine.type === 'highlight' ? 'multiply' : 'source-over'
                  }
                />
              )}
            </Layer>
          </Stage>
        </div>
      </div>
    </div>
  );
}
