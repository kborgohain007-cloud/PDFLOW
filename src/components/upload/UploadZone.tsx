'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Trash2, AlertCircle, CheckCircle2, FileUp, Loader } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface UploadZoneProps {
  allowedTypes: string[];
  multiple?: boolean;
  maxSizeMB?: number;
  onFilesSelected: (files: File[]) => void;
  isProcessing: boolean;
  progress: number;
  processingStatus: string;
  onReset: () => void;
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

export default function UploadZone({
  allowedTypes,
  multiple = false,
  maxSizeMB = 50,
  onFilesSelected,
  isProcessing,
  progress,
  processingStatus,
  onReset,
  files,
  setFiles,
}: UploadZoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Parse allowed types for extensions display (e.g. ".pdf, .jpg")
  const extensionsText = allowedTypes.join(', ').toUpperCase();

  // Validate files
  const validateAndAddFiles = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;
    const validFiles: File[] = [];

    Array.from(selectedFiles).forEach((file) => {
      const extension = '.' + file.name.split('.').pop()?.toLowerCase();
      const isValidType = allowedTypes.some((t) => {
        // Handle wildcards like image/*
        if (t.endsWith('/*')) {
          const mimePrefix = t.split('/')[0];
          return file.type.startsWith(mimePrefix);
        }
        return t.toLowerCase() === extension;
      });

      if (!isValidType) {
        toast({
          title: 'Invalid file format',
          description: `"${file.name}" is not supported. Please upload: ${extensionsText}`,
          type: 'error',
        });
        return;
      }

      if (file.size > maxSizeMB * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: `"${file.name}" exceeds the ${maxSizeMB}MB file limit.`,
          type: 'error',
        });
        return;
      }

      validFiles.push(file);
    });

    if (validFiles.length > 0) {
      if (multiple) {
        setFiles((prev) => [...prev, ...validFiles]);
      } else {
        setFiles([validFiles[0]]);
      }
    }
  };

  // Drag handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    validateAndAddFiles(e.dataTransfer.files);
  };

  // Click handlers
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    validateAndAddFiles(e.target.files);
  };

  // Remove file
  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Paste from clipboard support
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (isProcessing) return;
      const items = e.clipboardData?.items;
      if (!items) return;

      const pastedFiles: File[] = [];
      for (let i = 0; i < items.length; i++) {
        if (items[i].kind === 'file') {
          const file = items[i].getAsFile();
          if (file) pastedFiles.push(file);
        }
      }

      if (pastedFiles.length > 0) {
        // Convert to FileList-like structure or validate directly
        const extension = '.' + pastedFiles[0].name.split('.').pop()?.toLowerCase();
        const isValid = allowedTypes.some((t) => {
          if (t.endsWith('/*')) return pastedFiles[0].type.startsWith(t.split('/')[0]);
          return t.toLowerCase() === extension;
        });

        if (isValid) {
          if (multiple) {
            setFiles((prev) => [...prev, ...pastedFiles]);
          } else {
            setFiles([pastedFiles[0]]);
          }
          toast({
            title: 'File pasted',
            description: `Successfully loaded file from clipboard.`,
            type: 'success',
          });
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [allowedTypes, multiple, isProcessing, setFiles]);

  // Auto-trigger disabled to allow intermediate settings steps

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={allowedTypes.join(',')}
        onChange={handleFileInputChange}
        className="hidden"
      />

      <AnimatePresence mode="wait">
        {/* State 1: Uploading/Processing */}
        {isProcessing ? (
          <motion.div
            key="processing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="matte-surface border-2 border-dashed border-indigo-500/50 bg-white/80 dark:bg-neutral-900/60 p-8 sm:p-12 rounded-3xl flex flex-col items-center justify-center text-center backdrop-blur-sm min-h-[300px]"
          >
            <div className="relative flex items-center justify-center mb-6">
              <Loader className="w-16 h-16 text-indigo-500 animate-spin" />
              <div className="absolute font-semibold text-xs text-neutral-900 dark:text-neutral-100">
                {Math.round(progress)}%
              </div>
            </div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-50 mb-2">
              {processingStatus || 'Processing Files...'}
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm mb-6">
              Please keep this page open while we process your document.
            </p>

            {/* Custom styled progress bar */}
            <div className="w-full max-w-md bg-neutral-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-full rounded-full"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.2 }}
              />
            </div>
          </motion.div>
        ) : files.length > 0 ? (
          /* State 2: Files Loaded (Queue / Custom Options show before processing) */
          <motion.div
            key="queue"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="matte-surface bg-white/90 dark:bg-neutral-900/80 p-6 rounded-3xl shadow-lg backdrop-blur-sm"
          >
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="font-heading font-bold text-lg text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
                <FileUp className="w-5 h-5 text-indigo-500" />
                Queue ({files.length} {files.length === 1 ? 'file' : 'files'})
              </h3>
              <button
                onClick={onReset}
                className="text-xs font-semibold text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors px-3 py-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
              >
                Clear All
              </button>
            </div>

            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {files.map((file, idx) => (
                <motion.div
                  key={`${file.name}-${idx}`}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex items-center justify-between p-3.5 rounded-2xl border border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/30"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 truncate pr-4">
                        {file.name}
                      </p>
                      <p className="text-xs text-neutral-400 dark:text-neutral-500">
                        {formatBytes(file.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(idx)}
                    className="p-2 rounded-xl text-neutral-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all cursor-pointer"
                    aria-label="Delete file"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Drag & Drop to add more if multiple */}
            {multiple && (
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={handleButtonClick}
                className={`mt-4 py-4 px-6 border border-dashed rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  isDragActive
                    ? 'border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/20'
                    : 'border-neutral-200 hover:border-neutral-300 dark:border-neutral-800 dark:hover:border-neutral-700 bg-neutral-50/20 dark:bg-neutral-900/10'
                }`}
              >
                <Upload className="w-4 h-4 text-neutral-400" />
                <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                  Drag more files or <span className="text-indigo-600 dark:text-indigo-400">browse</span>
                </span>
              </div>
            )}
          </motion.div>
        ) : (
          /* State 3: Idle Upload Area */
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={handleButtonClick}
            className={`matte-surface border-2 border-dashed p-8 sm:p-14 rounded-3xl flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 relative overflow-hidden group select-none min-h-[300px] ${
              isDragActive
                ? 'border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/20 scale-[1.01]'
                : 'border-neutral-200 dark:border-neutral-800 bg-white/40 dark:bg-neutral-900/10 hover:border-indigo-400/70 hover:shadow-md'
            }`}
          >
            {/* Hover Glow Light */}
            <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-indigo-500/10 dark:bg-indigo-400/5 blur-3xl pointer-events-none group-hover:scale-150 transition-all duration-500" />

            <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6 group-hover:scale-110 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 transition-all duration-300 shadow-sm border border-neutral-100 dark:border-neutral-800/40">
              <Upload className="w-7 h-7" />
            </div>

            <h3 className="font-heading font-extrabold text-xl text-neutral-800 dark:text-neutral-100 mb-2.5">
              Drag & Drop your file here
            </h3>
            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 max-w-sm mb-6 leading-relaxed">
              Or click to <span className="text-indigo-600 dark:text-indigo-400 font-semibold group-hover:underline">browse files</span> from your device
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3.5">
              <span className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-neutral-100/70 dark:bg-neutral-800/80 text-neutral-500 dark:text-neutral-400 border border-neutral-200/20">
                Formats: {extensionsText}
              </span>
              <span className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-neutral-100/70 dark:bg-neutral-800/80 text-neutral-500 dark:text-neutral-400 border border-neutral-200/20">
                Max size: {maxSizeMB}MB
              </span>
              <span className="hidden sm:inline-block text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200/10">
                Clipboard Paste Active
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
