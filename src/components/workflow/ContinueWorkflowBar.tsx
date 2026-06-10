'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePDFlowStore } from '@/store/use-pdflow-store';
import { Download, Undo2, ArrowRight, Edit3, Check, FileCheck, Layers, Share2, Link2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from '@/hooks/use-toast';

interface ContinueWorkflowBarProps {
  file: File;
  fileName: string;
  fileSize: number;
  downloadUrl: string;
  onRename: (newName: string) => void;
  onUndo: () => void;
  sourceTool: string;
}

export default function ContinueWorkflowBar({
  file,
  fileName,
  fileSize,
  downloadUrl,
  onRename,
  onUndo,
  sourceTool,
}: ContinueWorkflowBarProps) {
  const router = useRouter();
  const setActiveWorkflowFile = usePDFlowStore((state) => state.setActiveWorkflowFile);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(fileName);
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    setTempName(fileName);
  }, [fileName]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShareUrl(window.location.origin + window.location.pathname);
    }
  }, []);

  const handleSaveRename = () => {
    if (!tempName.trim()) {
      toast({ title: 'Invalid filename', description: 'Name cannot be empty.', type: 'error' });
      return;
    }
    onRename(tempName);
    setIsEditingName(false);
    toast({ title: 'File renamed', description: `Saved as "${tempName}"`, type: 'success' });
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  // Determine compatible next steps based on output extension
  const extension = '.' + fileName.split('.').pop()?.toLowerCase();
  
  const getCompatibleTools = () => {
    if (extension === '.pdf') {
      return [
        { name: 'Compress PDF', route: '/compress-pdf' },
        { name: 'Extract Text (OCR)', route: '/ocr-pdf' },
        { name: 'PDF to Word', route: '/pdf-to-word' },
        { name: 'PDF to Image', route: '/pdf-to-image' },
        { name: 'PDF to Excel', route: '/pdf-to-excel' },
        { name: 'PDF to PPT', route: '/pdf-to-ppt' },
        { name: 'PDF to HTML', route: '/pdf-to-html' },
        { name: 'PDF to EPUB', route: '/pdf-to-epub' },
        { name: 'PDF to Text', route: '/pdf-to-txt' },
      ];
    } else if (['.jpg', '.jpeg', '.png', '.webp', '.bmp'].includes(extension)) {
      return [
        { name: 'Image to PDF', route: '/image-to-pdf' },
        { name: 'Extract Text (OCR)', route: '/ocr-pdf' },
      ];
    } else if (extension === '.docx') {
      return [{ name: 'Word to PDF', route: '/word-to-pdf' }];
    } else if (extension === '.xlsx') {
      return [{ name: 'Excel to PDF', route: '/excel-to-pdf' }];
    } else if (extension === '.pptx' || extension === '.ppt') {
      return [{ name: 'PPT to PDF', route: '/ppt-to-pdf' }];
    } else if (extension === '.txt') {
      return [{ name: 'Text to PDF', route: '/txt-to-pdf' }];
    } else if (extension === '.epub') {
      return [{ name: 'EPUB to PDF', route: '/epub-to-pdf' }];
    } else if (extension === '.html') {
      return [{ name: 'HTML to PDF', route: '/html-to-pdf' }];
    }
    return [];
  };

  const compatibleTools = getCompatibleTools();

  const handleChainWorkflow = (route: string, toolName: string) => {
    // Set transient file in Zustand store
    setActiveWorkflowFile({ file, sourceTool });
    toast({
      title: 'Chaining workflow',
      description: `Loaded file into ${toolName}`,
      type: 'info',
    });
    router.push(route);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      className="matte-surface bg-white/95 dark:bg-neutral-900/90 shadow-xl border border-indigo-500/20 rounded-3xl p-6 sm:p-8 backdrop-blur-md max-w-2xl mx-auto mt-8 relative overflow-hidden"
    >
      {/* Decorative ambient gradient inside the card */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 dark:bg-indigo-400/5 blur-2xl pointer-events-none" />

      <div className="flex flex-col gap-6">
        {/* Output details */}
        <div className="flex items-start gap-4">
          {['.jpg', '.jpeg', '.png', '.webp', '.bmp'].includes(extension) ? (
            <div className="w-12 h-12 rounded-xl border border-neutral-250 dark:border-neutral-850 overflow-hidden shrink-0 bg-neutral-100 dark:bg-neutral-950">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={downloadUrl} alt="Preview" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
              <FileCheck className="w-6 h-6 animate-pulse" />
            </div>
          )}
          <div className="flex-grow min-w-0">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
              Operation Successful
            </span>
            {isEditingName ? (
              <div className="flex items-center gap-2 mt-1.5 w-full">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-sm font-semibold text-neutral-800 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveRename()}
                />
                <button
                  onClick={handleSaveRename}
                  className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer transition-colors shadow-sm"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 mt-1 min-w-0">
                <h4 className="text-base font-bold text-neutral-800 dark:text-neutral-100 truncate">
                  {fileName}
                </h4>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="text-neutral-400 hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-300 p-1 rounded-lg transition-colors cursor-pointer"
                  aria-label="Rename file"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
            )}
            <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">
              Size: {formatBytes(fileSize)}
            </p>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Main Download Button */}
          <a
            href={downloadUrl}
            download={fileName}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 active:scale-[0.98] transition-all cursor-pointer text-sm"
          >
            <Download className="w-5 h-5" />
            Download Output File
          </a>

          {/* Undo Button */}
          <button
            onClick={onUndo}
            className="px-6 py-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 font-semibold text-neutral-700 dark:text-neutral-300 transition-colors flex items-center justify-center gap-2 cursor-pointer text-sm"
          >
            <Undo2 className="w-4.5 h-4.5" />
            Undo
          </button>
        </div>

        {/* Share Growth Loop Block */}
        <div className="flex flex-col gap-3.5 p-4.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/10 border border-indigo-500/10">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-indigo-500" />
            <h5 className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
              Your PDF is ready! Share PDFlow to keep it free
            </h5>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(shareUrl);
                toast({ title: 'Link copied', description: 'URL saved to clipboard.', type: 'success' });
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/80 transition-colors cursor-pointer"
            >
              <Link2 className="w-3.5 h-3.5" />
              Copy Link
            </button>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this 100% private, free online PDF tool! No uploads, processes entirely in your browser: `)}&url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/80 transition-colors cursor-pointer"
            >
              Share on X
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/80 transition-colors cursor-pointer"
            >
              Share on LinkedIn
            </a>
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out this free private PDF tool: `)}${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/80 transition-colors cursor-pointer"
            >
              Share on WhatsApp
            </a>
          </div>
        </div>

        {/* Chaining / Continue Workflow Section */}
        {compatibleTools.length > 0 && (
          <div className="mt-2 pt-5 border-t border-neutral-100 dark:border-neutral-800/80">
            <h5 className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              Continue Workflow
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {compatibleTools.slice(0, 4).map((tool) => (
                <button
                  key={tool.route}
                  onClick={() => handleChainWorkflow(tool.route, tool.name)}
                  className="flex items-center justify-between p-3 rounded-2xl border border-neutral-200/50 dark:border-neutral-800/60 bg-neutral-50/30 dark:bg-neutral-950/20 hover:border-indigo-500/50 dark:hover:border-indigo-400/40 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/15 group transition-all text-left cursor-pointer"
                >
                  <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                    Send to {tool.name}
                  </span>
                  <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>
              ))}
            </div>
            {compatibleTools.length > 4 && (
              <div className="mt-2 text-right">
                <span className="text-[10px] font-semibold text-neutral-400 dark:text-neutral-500">
                  +{compatibleTools.length - 4} other compatible tools available
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
