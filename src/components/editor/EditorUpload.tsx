'use client';

import React, { useCallback, useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  FileText,
  Clock,
  Trash2,
  Plus,
  ArrowRight,
  FilePlus2,
  AlertTriangle,
  Layers,
  X,
} from 'lucide-react';
import type { EditorProject } from '@/types/editor';
import { listProjects, deleteProject } from '@/lib/editor-db';

// ---- Constants ----
const MAX_TOTAL_BYTES = 100 * 1024 * 1024; // 100 MB

// ---- Props ----
interface EditorUploadProps {
  onFilesSelected: (files: File[]) => void;
  onProjectSelected: (projectId: number) => void;
}

// ---- Helpers ----
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function timeAgo(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return date.toLocaleDateString();
}

// ---- Component ----
export default function EditorUpload({
  onFilesSelected,
  onProjectSelected,
}: EditorUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentProjects, setRecentProjects] = useState<EditorProject[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const dragCounter = useRef(0);

  // Fetch recent projects on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const projects = await listProjects();
        if (!cancelled) setRecentProjects(projects);
      } catch {
        // IndexedDB may not be available in SSR/test
      } finally {
        if (!cancelled) setLoadingProjects(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Validate and handle files
  const processFiles = useCallback(
    (fileList: FileList | File[]) => {
      setError(null);
      const files = Array.from(fileList);
      const pdfFiles = files.filter(
        (f) => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'),
      );

      if (pdfFiles.length === 0) {
        setError('Please select PDF files only.');
        return;
      }

      const totalSize = pdfFiles.reduce((sum, f) => sum + f.size, 0);
      if (totalSize > MAX_TOTAL_BYTES) {
        setError(`Total file size exceeds 100 MB (${formatBytes(totalSize)} selected).`);
        return;
      }

      onFilesSelected(pdfFiles);
    },
    [onFilesSelected],
  );

  // Drag handlers
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    if (dragCounter.current === 1) setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current === 0) setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter.current = 0;
      setIsDragging(false);
      if (e.dataTransfer.files.length > 0) {
        processFiles(e.dataTransfer.files);
      }
    },
    [processFiles],
  );

  const handleBrowse = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        processFiles(e.target.files);
        e.target.value = '';
      }
    },
    [processFiles],
  );

  const handleDeleteProject = useCallback(
    async (e: React.MouseEvent, projectId: number) => {
      e.stopPropagation();
      setDeletingId(projectId);
      try {
        await deleteProject(projectId);
        setRecentProjects((prev) => prev.filter((p) => p.id !== projectId));
      } catch {
        // Fail silently
      } finally {
        setDeletingId(null);
      }
    },
    [],
  );

  // ---- Animation variants ----
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, stiffness: 300, damping: 24 },
    },
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 bg-gradient-to-br from-slate-50 via-white to-emerald-50/40 dark:from-neutral-950 dark:via-neutral-900 dark:to-emerald-950/20"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold tracking-wide uppercase">
            <FilePlus2 className="w-3.5 h-3.5" />
            PDF Editor Pro
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold tracking-tight text-neutral-900 dark:text-white">
            Open a PDF to get started
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm sm:text-base max-w-md mx-auto">
            Drag & drop your files below, or browse from your device.
            Multiple PDFs will be auto-merged into the editor.
          </p>
        </motion.div>

        {/* Drop zone */}
        <motion.div variants={itemVariants}>
          <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={handleBrowse}
            className={`
              relative cursor-pointer group rounded-2xl border-2 border-dashed transition-all duration-300
              ${
                isDragging
                  ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-900/20 scale-[1.01]'
                  : 'border-neutral-300 dark:border-neutral-700 hover:border-emerald-400 dark:hover:border-emerald-600 bg-white/70 dark:bg-neutral-900/50'
              }
              backdrop-blur-md shadow-lg hover:shadow-xl
            `}
          >
            {/* Gradient glow on hover */}
            <div
              className={`
                absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none
                bg-gradient-to-br from-emerald-500/5 via-cyan-500/5 to-indigo-500/5
                ${isDragging ? 'opacity-100' : ''}
              `}
            />

            <div className="relative flex flex-col items-center gap-4 py-12 sm:py-16 px-6">
              {/* Upload icon with animated ring */}
              <div className="relative">
                <div
                  className={`
                    absolute inset-0 rounded-full transition-all duration-500
                    ${isDragging ? 'animate-ping bg-emerald-400/30' : ''}
                  `}
                />
                <div
                  className={`
                    w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300
                    ${
                      isDragging
                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                        : 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-md group-hover:shadow-lg group-hover:shadow-emerald-500/25'
                    }
                  `}
                >
                  <Upload
                    className={`w-7 h-7 transition-transform duration-300 ${
                      isDragging ? '-translate-y-1' : 'group-hover:-translate-y-0.5'
                    }`}
                  />
                </div>
              </div>

              {/* Text */}
              <div className="text-center space-y-1.5">
                <p className="text-base font-semibold text-neutral-800 dark:text-neutral-100">
                  {isDragging ? 'Drop your PDFs here' : 'Drag & drop PDF files here'}
                </p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  or{' '}
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium underline underline-offset-2 decoration-emerald-500/40">
                    click to browse
                  </span>
                </p>
              </div>

              {/* Meta chips */}
              <div className="flex flex-wrap justify-center gap-2 mt-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-xs font-medium text-neutral-600 dark:text-neutral-400">
                  <FileText className="w-3 h-3" />
                  .pdf
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-xs font-medium text-neutral-600 dark:text-neutral-400">
                  <Layers className="w-3 h-3" />
                  Multi-file merge
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-xs font-medium text-neutral-600 dark:text-neutral-400">
                  Max 100 MB
                </span>
              </div>
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </motion.div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-400 text-sm"
            >
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setError(null);
                }}
                className="ml-auto p-0.5 rounded hover:bg-red-100 dark:hover:bg-red-800/30 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recent Projects */}
        <motion.div variants={itemVariants} className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <Clock className="w-4 h-4 text-neutral-400 dark:text-neutral-500" />
            <h2 className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
              Recent Projects
            </h2>
          </div>

          <div className="rounded-2xl border border-neutral-200/70 dark:border-neutral-800/70 bg-white/70 dark:bg-neutral-900/50 backdrop-blur-md overflow-hidden shadow-sm">
            {loadingProjects ? (
              <div className="flex items-center justify-center py-10">
                <div className="w-5 h-5 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
              </div>
            ) : recentProjects.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-3">
                  <FileText className="w-6 h-6 text-neutral-400 dark:text-neutral-600" />
                </div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">
                  No saved projects yet
                </p>
                <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
                  Projects you save will appear here
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                {recentProjects.slice(0, 5).map((project, index) => (
                  <motion.li
                    key={project.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, type: 'spring', stiffness: 300, damping: 24 }}
                  >
                    <button
                      onClick={() => onProjectSelected(project.id!)}
                      className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors group"
                    >
                      {/* File icon */}
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-50 to-cyan-50 dark:from-emerald-900/30 dark:to-cyan-900/20 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                        <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 truncate">
                          {project.name}
                        </p>
                        <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">
                          {project.pageCount} {project.pageCount === 1 ? 'page' : 'pages'}
                          {' · '}
                          {timeAgo(new Date(project.updatedAt))}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span
                          onClick={(e) => handleDeleteProject(e, project.id!)}
                          className={`
                            p-2 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all opacity-0 group-hover:opacity-100
                            ${deletingId === project.id ? 'animate-spin opacity-100' : ''}
                          `}
                          role="button"
                          tabIndex={0}
                          aria-label="Delete project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </span>
                        <span className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap">
                          Resume
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </button>
                  </motion.li>
                ))}
              </ul>
            )}
          </div>
        </motion.div>

        {/* New empty project shortcut */}
        <motion.div variants={itemVariants} className="flex justify-center">
          <button
            onClick={handleBrowse}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold text-sm hover:opacity-90 active:scale-[0.98] transition-all shadow-md hover:shadow-lg"
          >
            <Plus className="w-4 h-4" />
            Open PDF File
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
