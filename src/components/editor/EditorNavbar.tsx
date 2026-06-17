'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useStore } from 'zustand';
import {
  Undo2,
  Redo2,
  Save,
  Download,
  FileDown,
  PanelLeft,
  PanelRight,
  Loader2,
  Check,
} from 'lucide-react';
import Logo from '@/components/ui/Logo';
import { useEditorStore } from '@/stores/editor-store';

// ---- Props ----
interface EditorNavbarProps {
  onSave?: () => void;
  onExport?: () => void;
  onDownload?: () => void;
}

// ---- Helpers ----
function formatTimeSince(date: Date | null): string {
  if (!date) return '';
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 5) return 'Saved just now';
  if (seconds < 60) return `Saved ${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `Saved ${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `Saved ${hours}h ago`;
}

// ---- Component ----
export default function EditorNavbar({
  onSave,
  onExport,
  onDownload,
}: EditorNavbarProps) {
  // Editor store state
  const projectName = useEditorStore((s) => s.projectName);
  const setProjectName = useEditorStore((s) => s.setProjectName);
  const isDirty = useEditorStore((s) => s.isDirty);
  const isAutoSaving = useEditorStore((s) => s.isAutoSaving);
  const lastSavedAt = useEditorStore((s) => s.lastSavedAt);
  const isPagesSidebarOpen = useEditorStore((s) => s.isPagesSidebarOpen);
  const isToolsSidebarOpen = useEditorStore((s) => s.isToolsSidebarOpen);
  const togglePagesSidebar = useEditorStore((s) => s.togglePagesSidebar);
  const toggleToolsSidebar = useEditorStore((s) => s.toggleToolsSidebar);

  // Temporal (undo/redo) — reactive via useStore
  const { undo, redo, pastStates, futureStates } = useStore(
    useEditorStore.temporal,
  );

  const canUndo = pastStates.length > 0;
  const canRedo = futureStates.length > 0;

  // Inline project name editing
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(projectName);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setNameValue(projectName);
  }, [projectName]);

  useEffect(() => {
    if (isEditingName) {
      nameInputRef.current?.select();
    }
  }, [isEditingName]);

  const commitName = useCallback(() => {
    const trimmed = nameValue.trim();
    if (trimmed && trimmed !== projectName) {
      setProjectName(trimmed);
    } else {
      setNameValue(projectName);
    }
    setIsEditingName(false);
  }, [nameValue, projectName, setProjectName]);

  // Live "saved X ago" ticker
  const [, setTick] = useState(0);
  useEffect(() => {
    if (!lastSavedAt) return;
    const id = setInterval(() => setTick((t) => t + 1), 10_000);
    return () => clearInterval(id);
  }, [lastSavedAt]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey;
      if (mod && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (canUndo) undo();
      }
      if (mod && ((e.key === 'z' && e.shiftKey) || e.key === 'y')) {
        e.preventDefault();
        if (canRedo) redo();
      }
      if (mod && e.key === 's') {
        e.preventDefault();
        onSave?.();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [canUndo, canRedo, undo, redo, onSave]);

  // Save status
  const saveStatusLabel = isAutoSaving
    ? 'Saving…'
    : isDirty
      ? 'Unsaved changes'
      : formatTimeSince(lastSavedAt);

  return (
    <header className="sticky top-0 z-50 h-14 flex items-center bg-gradient-to-r from-[#0f172a] to-[#1e293b] border-b border-white/5 shadow-lg select-none">
      {/* ---- Left Section ---- */}
      <div className="flex items-center gap-2 pl-2 sm:pl-4 min-w-0 flex-shrink-0">
        {/* Pages sidebar toggle (mobile-first, always visible) */}
        <button
          onClick={togglePagesSidebar}
          className={`p-2 rounded-lg transition-colors ${
            isPagesSidebarOpen
              ? 'bg-white/10 text-white'
              : 'text-neutral-400 hover:text-white hover:bg-white/5'
          }`}
          title="Toggle pages sidebar"
          aria-label="Toggle pages sidebar"
        >
          <PanelLeft className="w-4.5 h-4.5" />
        </button>

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-1.5 group px-1"
          title="Back to PDFlow"
        >
          <Logo className="w-7 h-7 group-hover:scale-105 transition-transform" />
          <span className="hidden sm:inline font-heading font-extrabold text-base tracking-tight text-white">
            PDF<span className="text-indigo-400">LOW</span>
          </span>
        </Link>

        {/* Divider */}
        <div className="h-5 w-px bg-white/10 mx-1 hidden sm:block" />

        {/* Project name (editable) */}
        <div className="min-w-0 max-w-[180px] sm:max-w-[260px]">
          {isEditingName ? (
            <input
              ref={nameInputRef}
              type="text"
              value={nameValue}
              onChange={(e) => setNameValue(e.target.value)}
              onBlur={commitName}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitName();
                if (e.key === 'Escape') {
                  setNameValue(projectName);
                  setIsEditingName(false);
                }
              }}
              className="w-full bg-white/10 text-white text-sm font-medium px-2.5 py-1 rounded-lg border border-white/20 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/30 outline-none transition-all"
              maxLength={80}
            />
          ) : (
            <button
              onClick={() => setIsEditingName(true)}
              className="w-full text-left text-sm font-medium text-neutral-200 hover:text-white px-2.5 py-1 rounded-lg hover:bg-white/5 transition-colors truncate"
              title="Click to rename project"
            >
              {projectName}
            </button>
          )}
        </div>
      </div>

      {/* ---- Center Section ---- */}
      <div className="flex-1 flex items-center justify-center gap-1">
        <div className="flex items-center gap-0.5 bg-white/5 rounded-xl p-1">
          <button
            onClick={() => canUndo && undo()}
            disabled={!canUndo}
            className={`p-2 rounded-lg transition-all ${
              canUndo
                ? 'text-neutral-300 hover:text-white hover:bg-white/10 active:scale-95'
                : 'text-neutral-600 cursor-not-allowed'
            }`}
            title="Undo (Ctrl+Z)"
            aria-label="Undo"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => canRedo && redo()}
            disabled={!canRedo}
            className={`p-2 rounded-lg transition-all ${
              canRedo
                ? 'text-neutral-300 hover:text-white hover:bg-white/10 active:scale-95'
                : 'text-neutral-600 cursor-not-allowed'
            }`}
            title="Redo (Ctrl+Shift+Z)"
            aria-label="Redo"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ---- Right Section ---- */}
      <div className="flex items-center gap-1.5 pr-2 sm:pr-4 flex-shrink-0">
        {/* Save status indicator */}
        <div className="hidden md:flex items-center gap-1.5 mr-2">
          {isAutoSaving ? (
            <Loader2 className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
          ) : isDirty ? (
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          ) : lastSavedAt ? (
            <Check className="w-3.5 h-3.5 text-emerald-400" />
          ) : null}
          {saveStatusLabel && (
            <span
              className={`text-xs font-medium ${
                isDirty && !isAutoSaving
                  ? 'text-amber-400'
                  : 'text-neutral-400'
              }`}
            >
              {saveStatusLabel}
            </span>
          )}
        </div>

        {/* Save button */}
        <button
          onClick={onSave}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-neutral-300 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
          title="Save Progress (Ctrl+S)"
        >
          <Save className="w-4 h-4" />
          <span className="hidden sm:inline">Save</span>
        </button>

        {/* Export button */}
        <button
          onClick={onExport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-neutral-300 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
          title="Export PDF"
        >
          <FileDown className="w-4 h-4" />
          <span className="hidden sm:inline">Export</span>
        </button>

        {/* Download button */}
        <button
          onClick={onDownload}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold active:scale-95 transition-all shadow-sm shadow-emerald-600/20"
          title="Download PDF"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Download</span>
        </button>

        {/* Tools sidebar toggle */}
        <button
          onClick={toggleToolsSidebar}
          className={`p-2 rounded-lg transition-colors ml-1 ${
            isToolsSidebarOpen
              ? 'bg-white/10 text-white'
              : 'text-neutral-400 hover:text-white hover:bg-white/5'
          }`}
          title="Toggle tools sidebar"
          aria-label="Toggle tools sidebar"
        >
          <PanelRight className="w-4.5 h-4.5" />
        </button>
      </div>
    </header>
  );
}
