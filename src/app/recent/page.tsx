'use client';

import React, { useState, useEffect } from 'react';
import { usePDFlowStore, FileOperation } from '@/store/use-pdflow-store';
import { useRouter } from 'next/navigation';
import { 
  History, 
  Trash2, 
  Download, 
  ArrowRight, 
  Layers, 
  FileText, 
  Calendar,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/hooks/use-toast';

export default function RecentHistoryPage() {
  const router = useRouter();
  const { history, clearHistory, setActiveWorkflowFile } = usePDFlowStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const handleDownload = (item: FileOperation) => {
    if (!item.outputFileDataUrl) {
      toast({ title: 'Download unavailable', description: 'File data was cleared after session closure.', type: 'error' });
      return;
    }
    const a = document.createElement('a');
    a.href = item.outputFileDataUrl;
    a.download = item.outputFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast({ title: 'Download started', description: `Saved "${item.outputFileName}"`, type: 'success' });
  };

  const handleChainWorkflow = (item: FileOperation) => {
    if (!item.outputFileDataUrl) {
      toast({ title: 'Operation unavailable', description: 'File content was cleared from memory.', type: 'error' });
      return;
    }

    // Convert base64 data url back into a File object
    fetch(item.outputFileDataUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], item.outputFileName, { type: blob.type });
        setActiveWorkflowFile({ file, sourceTool: item.toolName });
        
        // Find next compatible route
        const extension = '.' + item.outputFileName.split('.').pop()?.toLowerCase();
        let targetRoute = '/compress-pdf'; // default fallback
        
        if (extension === '.pdf') {
          targetRoute = '/compress-pdf';
        } else if (['.jpg', '.png', '.webp'].includes(extension)) {
          targetRoute = '/image-to-pdf';
        } else if (extension === '.docx') {
          targetRoute = '/word-to-pdf';
        } else if (extension === '.xlsx') {
          targetRoute = '/excel-to-pdf';
        } else if (extension === '.pptx' || extension === '.ppt') {
          targetRoute = '/ppt-to-pdf';
        }

        toast({
          title: 'File loaded',
          description: `Transferred "${item.outputFileName}" to the next stage.`,
          type: 'success',
        });
        router.push(targetRoute);
      })
      .catch(() => {
        toast({ title: 'Chaining failed', description: 'Could not rebuild file from history.', type: 'error' });
      });
  };

  if (!mounted) return null;

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-neutral-100 dark:border-neutral-800/40">
            <History className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-heading font-extrabold text-2xl text-neutral-900 dark:text-neutral-50">
              Session History
            </h1>
            <p className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 mt-0.5">
              Access and chain files processed during your active session.
            </p>
          </div>
        </div>
        {history.length > 0 && (
          <button
            onClick={() => {
              clearHistory();
              toast({ title: 'History cleared', description: 'Session logs removed.', type: 'success' });
            }}
            className="inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl border border-neutral-200 hover:border-rose-500 hover:bg-rose-50/50 dark:border-neutral-800 dark:hover:border-rose-950/20 dark:hover:bg-rose-950/10 text-neutral-600 dark:text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors text-xs font-semibold cursor-pointer shrink-0"
          >
            <Trash2 className="w-4 h-4" />
            Clear Session Log
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {history.length > 0 ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="flex flex-col gap-3.5"
          >
            {history.map((item) => (
              <div
                key={item.id}
                className="matte-surface bg-white/60 dark:bg-neutral-900/40 p-5 rounded-2xl border border-neutral-200/50 dark:border-neutral-800/60 hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative overflow-hidden group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 border border-neutral-100 dark:border-neutral-800/40">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/10">
                        {item.toolName}
                      </span>
                      <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-semibold flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <h3 className="font-heading font-extrabold text-sm text-neutral-800 dark:text-neutral-100 truncate mt-1.5 max-w-xs sm:max-w-md">
                      {item.outputFileName}
                    </h3>
                    <p className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-0.5">
                      Input: {item.inputFileName} ({formatBytes(item.inputFileSize)}) &rarr; Output: {formatBytes(item.outputFileSize)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleDownload(item)}
                    className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/80 text-neutral-700 dark:text-neutral-300 transition-colors flex items-center gap-1.5 cursor-pointer text-xs font-semibold"
                    title="Download File"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                  <button
                    onClick={() => handleChainWorkflow(item)}
                    className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer text-xs font-semibold"
                    title="Chain Workflow"
                  >
                    <Layers className="w-4 h-4" />
                    <span>Chain</span>
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="matte-surface bg-white/40 dark:bg-neutral-900/20 border border-neutral-200/50 dark:border-neutral-800/60 p-12 rounded-3xl text-center backdrop-blur-sm min-h-[320px] flex flex-col items-center justify-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-neutral-100 dark:bg-neutral-950 flex items-center justify-center text-neutral-400 dark:text-neutral-600 mb-5 border border-neutral-200/20 shadow-inner">
              <History className="w-7 h-7" />
            </div>
            <h3 className="font-heading font-extrabold text-lg text-neutral-800 dark:text-neutral-200">
              No recent files found
            </h3>
            <p className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 max-w-xs mt-1.5 leading-relaxed">
              Files you process in this session will display here for downloading and chaining.
            </p>
            <button
              onClick={() => router.push('/')}
              className="mt-6 inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/10 cursor-pointer transition-all"
            >
              Start Converting
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
