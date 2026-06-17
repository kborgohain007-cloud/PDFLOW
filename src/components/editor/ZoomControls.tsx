'use client';

import React, { useCallback, useMemo } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Minus,
} from 'lucide-react';
import { useEditorStore } from '@/stores/editor-store';

// ---- Zoom presets ----
const ZOOM_MIN = 0.25;
const ZOOM_MAX = 4;
const ZOOM_STEP = 0.1;

// ---- Component ----
export default function ZoomControls() {
  const zoom = useEditorStore((s) => s.zoom);
  const setZoom = useEditorStore((s) => s.setZoom);
  const pageOrder = useEditorStore((s) => s.pageOrder);
  const activePageId = useEditorStore((s) => s.activePageId);
  const setActivePageId = useEditorStore((s) => s.setActivePageId);

  // Calculate current page index
  const currentPageIndex = useMemo(() => {
    if (!activePageId) return 0;
    const idx = pageOrder.indexOf(activePageId);
    return idx >= 0 ? idx : 0;
  }, [activePageId, pageOrder]);

  const totalPages = pageOrder.length;
  const displayPage = totalPages > 0 ? currentPageIndex + 1 : 0;

  // Zoom handlers
  const handleZoomIn = useCallback(() => {
    setZoom(Math.min(ZOOM_MAX, Math.round((zoom + ZOOM_STEP) * 100) / 100));
  }, [zoom, setZoom]);

  const handleZoomOut = useCallback(() => {
    setZoom(Math.max(ZOOM_MIN, Math.round((zoom - ZOOM_STEP) * 100) / 100));
  }, [zoom, setZoom]);

  const handleZoomSlider = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setZoom(parseFloat(e.target.value));
    },
    [setZoom],
  );

  const handleFitPage = useCallback(() => {
    setZoom(1);
  }, [setZoom]);

  const handleFitWidth = useCallback(() => {
    // Approximate "fit to width" — set zoom to 1.25 as a sensible width-fill default.
    // In a full implementation this would compute based on viewport and page dimensions.
    setZoom(1.25);
  }, [setZoom]);

  // Page navigation
  const handlePrevPage = useCallback(() => {
    if (currentPageIndex > 0) {
      setActivePageId(pageOrder[currentPageIndex - 1]);
    }
  }, [currentPageIndex, pageOrder, setActivePageId]);

  const handleNextPage = useCallback(() => {
    if (currentPageIndex < totalPages - 1) {
      setActivePageId(pageOrder[currentPageIndex + 1]);
    }
  }, [currentPageIndex, totalPages, pageOrder, setActivePageId]);

  const zoomPercent = Math.round(zoom * 100);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-center pointer-events-none pb-3 px-3">
      <div className="pointer-events-auto flex items-center gap-1 sm:gap-2 px-3 py-2 rounded-2xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200/50 dark:border-neutral-700/50 shadow-xl shadow-black/5 dark:shadow-black/30">
        {/* ---- Zoom Out ---- */}
        <button
          onClick={handleZoomOut}
          disabled={zoom <= ZOOM_MIN}
          className={`p-1.5 rounded-lg transition-all ${
            zoom > ZOOM_MIN
              ? 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white active:scale-90'
              : 'text-neutral-300 dark:text-neutral-700 cursor-not-allowed'
          }`}
          title="Zoom out"
          aria-label="Zoom out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        {/* ---- Zoom Slider ---- */}
        <div className="hidden sm:flex items-center gap-2 w-28">
          <input
            type="range"
            min={ZOOM_MIN}
            max={ZOOM_MAX}
            step={0.01}
            value={zoom}
            onChange={handleZoomSlider}
            className="w-full h-1 appearance-none rounded-full bg-neutral-200 dark:bg-neutral-700 cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-500 [&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:shadow-emerald-500/30 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110
              [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-emerald-500 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-sm [&::-moz-range-thumb]:cursor-pointer"
            title={`Zoom: ${zoomPercent}%`}
            aria-label="Zoom level"
          />
        </div>

        {/* ---- Zoom In ---- */}
        <button
          onClick={handleZoomIn}
          disabled={zoom >= ZOOM_MAX}
          className={`p-1.5 rounded-lg transition-all ${
            zoom < ZOOM_MAX
              ? 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white active:scale-90'
              : 'text-neutral-300 dark:text-neutral-700 cursor-not-allowed'
          }`}
          title="Zoom in"
          aria-label="Zoom in"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        {/* ---- Zoom Percentage ---- */}
        <button
          onClick={handleFitPage}
          className="min-w-[3.25rem] text-center px-2 py-1 rounded-lg text-xs font-semibold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors tabular-nums"
          title="Reset zoom to 100%"
        >
          {zoomPercent}%
        </button>

        {/* ---- Divider ---- */}
        <div className="h-5 w-px bg-neutral-200 dark:bg-neutral-700 mx-0.5" />

        {/* ---- Fit Page ---- */}
        <button
          onClick={handleFitPage}
          className="p-1.5 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white active:scale-90 transition-all"
          title="Fit to page"
          aria-label="Fit to page"
        >
          <Maximize className="w-4 h-4" />
        </button>

        {/* ---- Fit Width ---- */}
        <button
          onClick={handleFitWidth}
          className="p-1.5 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white active:scale-90 transition-all"
          title="Fit to width"
          aria-label="Fit to width"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* ---- Divider ---- */}
        <div className="h-5 w-px bg-neutral-200 dark:bg-neutral-700 mx-0.5" />

        {/* ---- Page Navigation ---- */}
        <button
          onClick={handlePrevPage}
          disabled={currentPageIndex <= 0 || totalPages === 0}
          className={`p-1.5 rounded-lg transition-all ${
            currentPageIndex > 0 && totalPages > 0
              ? 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white active:scale-90'
              : 'text-neutral-300 dark:text-neutral-700 cursor-not-allowed'
          }`}
          title="Previous page"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span className="text-xs font-medium text-neutral-600 dark:text-neutral-300 tabular-nums whitespace-nowrap px-1">
          {totalPages > 0 ? (
            <>
              Page{' '}
              <span className="font-semibold text-neutral-800 dark:text-white">
                {displayPage}
              </span>{' '}
              of{' '}
              <span className="font-semibold text-neutral-800 dark:text-white">
                {totalPages}
              </span>
            </>
          ) : (
            <span className="text-neutral-400 dark:text-neutral-600">
              No pages
            </span>
          )}
        </span>

        <button
          onClick={handleNextPage}
          disabled={currentPageIndex >= totalPages - 1 || totalPages === 0}
          className={`p-1.5 rounded-lg transition-all ${
            currentPageIndex < totalPages - 1 && totalPages > 0
              ? 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white active:scale-90'
              : 'text-neutral-300 dark:text-neutral-700 cursor-not-allowed'
          }`}
          title="Next page"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
