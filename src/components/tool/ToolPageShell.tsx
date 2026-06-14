'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePDFlowStore } from '@/store/use-pdflow-store';
import { seoContentMap } from '@/data/seo-content';
import UploadZone from '@/components/upload/UploadZone';
import ContinueWorkflowBar from '@/components/workflow/ContinueWorkflowBar';
import { ArrowLeft, Sparkles, HelpCircle, FileCheck, Shield, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';

interface ToolPageShellProps {
  toolId: string;
  title: string;
  description: string;
  allowedTypes: string[];
  maxSizeMB: number;
  multiple?: boolean;
  optionsComponent?: (props: { 
    files: File[]; 
    options: any; 
    setOptions: React.Dispatch<React.SetStateAction<any>>;
    onTriggerProcess: () => void;
  }) => React.ReactNode;
  defaultOptions?: any;
  processFiles: (
    files: File[],
    options: any,
    onProgress: (progress: number, status: string) => void
  ) => Promise<{ blob: Blob; fileName: string }>;
  infoSections?: { title: string; content: string }[];
  isSecureCloud?: boolean;
}

export default function ToolPageShell({
  toolId,
  title,
  description,
  allowedTypes,
  maxSizeMB,
  multiple = false,
  optionsComponent,
  defaultOptions = {},
  processFiles,
  infoSections = [],
  isSecureCloud = false,
}: ToolPageShellProps) {
  const { activeWorkflowFile, setActiveWorkflowFile, addHistoryItem, exportBrandingEnabled, setExportBrandingEnabled } = usePDFlowStore();
  const seoData = seoContentMap[toolId];

  // Dynamic JSON-LD structured data schemas
  const softwareSchema = seoData ? {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": seoData.h1,
    "operatingSystem": "All",
    "applicationCategory": "UtilityApplication",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    }
  } : null;

  const faqSchema = seoData && seoData.faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": seoData.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  } : null;

  const breadcrumbSchema = seoData ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://pdflow.in"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": seoData.h1,
        "item": `https://pdflow.in/${toolId}`
      }
    ]
  } : null;
  const [files, setFiles] = useState<File[]>([]);
  
  // Processing States
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processingStatus, setProcessingStatus] = useState('');
  
  // Output States
  const [outputFile, setOutputFile] = useState<File | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string>('');
  const [originalFileBackup, setOriginalFileBackup] = useState<File[]>([]);

  // Configurations
  const [options, setOptions] = useState<any>(defaultOptions);

  // 1. Chaining Check on mount
  useEffect(() => {
    if (activeWorkflowFile) {
      const fileExtension = '.' + activeWorkflowFile.file.name.split('.').pop()?.toLowerCase();
      const isAllowed = allowedTypes.some((t) => {
        if (t.endsWith('/*')) return activeWorkflowFile.file.type.startsWith(t.split('/')[0]);
        return t.toLowerCase() === fileExtension;
      });

      if (isAllowed) {
        setFiles([activeWorkflowFile.file]);
        toast({
          title: 'File loaded from workflow',
          description: `Imported "${activeWorkflowFile.file.name}" from ${activeWorkflowFile.sourceTool}.`,
          type: 'success',
        });
      } else {
        toast({
          title: 'Incompatible file format',
          description: `The file from "${activeWorkflowFile.sourceTool}" is not supported by ${title}.`,
          type: 'warning',
        });
      }
      setActiveWorkflowFile(null);
    }
  }, [activeWorkflowFile, allowedTypes, setActiveWorkflowFile, title]);

  // Clean up blob URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    };
  }, [downloadUrl]);

  // Reset file queue
  const handleReset = () => {
    setFiles([]);
    setProgress(0);
    setProcessingStatus('');
    setOutputFile(null);
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
      setDownloadUrl('');
    }
  };

  // Triggers conversion operation
  const handleProcess = async (selectedFiles = files) => {
    if (selectedFiles.length === 0) return;
    
    // Save backup of original files for Undo support
    setOriginalFileBackup([...selectedFiles]);
    setIsProcessing(true);
    setProgress(10);
    setProcessingStatus('Reading file structures...');

    try {
      // Execute custom tool processor logic
      const result = await processFiles(selectedFiles, options, (p, status) => {
        setProgress(p);
        setProcessingStatus(status);
      });

      // Wrap result in a new File object
      const processedFile = new File([result.blob], result.fileName, { type: result.blob.type });
      const url = URL.createObjectURL(result.blob);

      setOutputFile(processedFile);
      setDownloadUrl(url);
      setProgress(100);
      setProcessingStatus('Completed successfully!');

      // Register session history logs
      // Try to read base64 asynchronously for local caching
      const reader = new FileReader();
      reader.onloadend = () => {
        addHistoryItem({
          toolName: title,
          toolSlug: toolId,
          inputFileName: selectedFiles[0].name,
          inputFileSize: selectedFiles[0].size,
          outputFileName: result.fileName,
          outputFileSize: result.blob.size,
          outputFileDataUrl: reader.result as string,
        });
      };
      reader.readAsDataURL(result.blob);

      // Trigger Confetti Celebration
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#6366F1', '#4F46E5', '#10B981']
      });

      toast({
        title: 'Operation successful',
        description: `Successfully generated "${result.fileName}"`,
        type: 'success',
      });
    } catch (err: any) {
      console.error(err);
      toast({
        title: 'Processing failed',
        description: err.message || 'An error occurred during file compilation.',
        type: 'error',
      });
      setProgress(0);
      setProcessingStatus('');
    } finally {
      setIsProcessing(false);
    }
  };

  // Re-run process (e.g. after options changes)
  const handleOptionChangeTrigger = () => {
    if (files.length > 0) {
      handleProcess();
    }
  };

  // Undo Handler
  const handleUndo = () => {
    setFiles(originalFileBackup);
    setOutputFile(null);
    setProgress(0);
    setProcessingStatus('');
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
      setDownloadUrl('');
    }
    toast({
      title: 'Action reverted',
      description: 'Returned to previous input files.',
      type: 'info',
    });
  };

  // Handles renaming outputs
  const handleRename = (newName: string) => {
    if (!outputFile) return;
    const renamed = new File([outputFile], newName, { type: outputFile.type });
    setOutputFile(renamed);
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex flex-col gap-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Tools
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Left Side: Upload zone, options, outputs */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="text-left">
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-neutral-900 dark:text-neutral-50 flex items-center gap-2.5">
              {title}
            </h1>
            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mt-1">
              {description}
            </p>
            {isSecureCloud && (
              <div className="flex flex-wrap items-center gap-3 mt-4">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 text-xs font-bold">
                  <Shield className="w-3.5 h-3.5" />
                  Bank-Level Encrypted Server
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 text-xs font-bold">
                  <FileCheck className="w-3.5 h-3.5" />
                  Zero-Retention (Files Deleted Instantly)
                </div>
              </div>
            )}
          </div>

          <AnimatePresence mode="wait">
            {!outputFile ? (
              <motion.div
                key="upload-section"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-6"
              >
                <UploadZone
                  allowedTypes={allowedTypes}
                  multiple={multiple}
                  maxSizeMB={maxSizeMB}
                  onFilesSelected={(s) => handleProcess(s)}
                  isProcessing={isProcessing}
                  progress={progress}
                  processingStatus={processingStatus}
                  onReset={handleReset}
                  files={files}
                  setFiles={setFiles}
                />

                {/* Intermediate Step: Options configurations & Convert CTA */}
                {files.length > 0 && !isProcessing && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-4"
                  >
                    <div className="flex items-center gap-2.5 px-4.5 py-3.5 rounded-2xl bg-emerald-500/10 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/15">
                      <FileCheck className="w-4.5 h-4.5" />
                      <span>File successfully uploaded. Configure settings below to convert.</span>
                    </div>

                    {optionsComponent && (
                      <div className="matte-surface bg-white/70 dark:bg-neutral-900/50 p-6 rounded-2xl border border-neutral-200/50 dark:border-neutral-800/80 backdrop-blur-sm">
                        {optionsComponent({ 
                          files, 
                          options, 
                          setOptions,
                          onTriggerProcess: () => {} 
                        })}
                      </div>
                    )}

                    {/* Subtle branding toggle option */}
                    <div className="flex items-center gap-2.5 px-1 py-1 text-xs text-neutral-500 dark:text-neutral-400 font-semibold select-none">
                      <input
                        type="checkbox"
                        id="branding-toggle"
                        checked={exportBrandingEnabled}
                        onChange={(e) => setExportBrandingEnabled(e.target.checked)}
                        className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-700 text-indigo-650 focus:ring-indigo-500/20 cursor-pointer accent-indigo-600 shrink-0"
                      />
                      <label htmlFor="branding-toggle" className="cursor-pointer hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors">
                        Add a small &ldquo;Processed with PDFlow&rdquo; footer to generated files (helps keep PDFlow 100% free)
                      </label>
                    </div>

                    <button
                      onClick={() => handleProcess()}
                      className="w-full py-4.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-heading font-extrabold text-sm shadow-md shadow-indigo-600/15 hover:shadow-indigo-650/25 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2 mt-1"
                    >
                      <Sparkles className="w-4 h-4" />
                      {toolId === 'compress-pdf' ? 'Compress PDF' : toolId === 'ocr-pdf' ? 'Extract Text (OCR)' : toolId === 'image-to-pdf' ? 'Compile PDF' : 'Start Conversion'}
                    </button>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="output-section"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <ContinueWorkflowBar
                  file={outputFile}
                  fileName={outputFile.name}
                  fileSize={outputFile.size}
                  downloadUrl={downloadUrl}
                  onRename={handleRename}
                  onUndo={handleUndo}
                  sourceTool={title}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Side: Informative panel */}
        <div className="w-full lg:w-80 flex flex-col gap-4">
          {isSecureCloud ? (
            <div className="matte-surface bg-white/40 dark:bg-neutral-900/10 p-5.5 rounded-2xl border border-neutral-200/50 dark:border-neutral-800/60 backdrop-blur-sm">
              <h3 className="font-heading font-extrabold text-sm text-neutral-800 dark:text-neutral-200 mb-3 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-indigo-500 shrink-0" />
                Secure Cloud Server
              </h3>
              <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 leading-relaxed">
                This tool requires advanced ML models to reconstruct layouts. Files are transmitted via end-to-end encryption to our secure cloud server, processed instantly, and permanently deleted with a strict Zero-Retention policy.
              </p>
            </div>
          ) : (
            <div className="matte-surface bg-white/40 dark:bg-neutral-900/10 p-5.5 rounded-2xl border border-neutral-200/50 dark:border-neutral-800/60 backdrop-blur-sm">
              <h3 className="font-heading font-extrabold text-sm text-neutral-800 dark:text-neutral-200 mb-3 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-500 shrink-0" />
                Privacy Sandboxed
              </h3>
              <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 leading-relaxed">
                This tool converts files client-side. WebAssembly models execute computations within your browser window, securing document containment.
              </p>
            </div>
          )}

          {infoSections.map((sec, idx) => (
            <div
              key={idx}
              className="matte-surface bg-white/40 dark:bg-neutral-900/10 p-5.5 rounded-2xl border border-neutral-200/50 dark:border-neutral-800/60 backdrop-blur-sm"
            >
              <h3 className="font-heading font-extrabold text-sm text-neutral-800 dark:text-neutral-200 mb-2.5 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-indigo-500 shrink-0" />
                {sec.title}
              </h3>
              <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 leading-relaxed whitespace-pre-line">
                {sec.content}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Dynamic JSON-LD SEO Schemas */}
      {softwareSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
        />
      )}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}

      {/* Detailed SEO Content Article */}
      {seoData && (
        <article className="max-w-4xl mx-auto mt-20 border-t border-neutral-200/50 dark:border-neutral-800/40 pt-12 flex flex-col gap-10 text-neutral-600 dark:text-neutral-300">
          <div className="flex flex-col gap-3">
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-neutral-900 dark:text-neutral-50">
              {seoData.h1}
            </h2>
            <p className="text-sm font-semibold leading-relaxed text-neutral-500 dark:text-neutral-450">
              {seoData.intro}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {seoData.benefits.map((b, idx) => (
              <div key={idx} className="matte-surface bg-white/40 dark:bg-neutral-900/20 p-5 rounded-2xl border border-neutral-200/40 dark:border-neutral-800/50">
                <h3 className="font-heading font-extrabold text-sm text-neutral-800 dark:text-neutral-200 mb-2">
                  {b.title}
                </h3>
                <p className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 leading-relaxed">
                  {b.description}
                </p>
              </div>
            ))}
          </div>

          <div 
            className="prose prose-neutral dark:prose-invert max-w-none text-sm leading-relaxed flex flex-col gap-4.5"
            dangerouslySetInnerHTML={{ __html: seoData.guideHtml }}
          />

          {seoData.faqs.length > 0 && (
            <div className="flex flex-col gap-6">
              <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-neutral-900 dark:text-neutral-50 border-b border-neutral-100 dark:border-neutral-900 pb-3">
                Frequently Asked Questions
              </h2>
              <div className="flex flex-col gap-3">
                {seoData.faqs.map((faq, idx) => (
                  <div key={idx} className="matte-surface bg-white/30 dark:bg-neutral-900/10 border border-neutral-200/40 dark:border-neutral-800/50 p-5 rounded-2xl flex flex-col gap-2">
                    <h3 className="font-heading font-extrabold text-sm text-neutral-800 dark:text-neutral-200">
                      {faq.q}
                    </h3>
                    <p className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-neutral-100 dark:border-neutral-900 pt-8 flex flex-col gap-3.5">
            <h4 className="text-xs font-bold text-neutral-450 dark:text-neutral-500 uppercase tracking-widest">
              Related PDF Utilities
            </h4>
            <div className="flex items-center gap-3 flex-wrap">
              {seoData.relatedTools.map((slug) => {
                const targetTool = seoContentMap[slug];
                if (!targetTool) return null;
                return (
                  <Link
                    key={slug}
                    href={`/${slug}`}
                    className="px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/40 dark:bg-neutral-900/30 hover:border-indigo-500/50 dark:hover:border-indigo-400/40 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs font-semibold transition-all cursor-pointer"
                  >
                    {targetTool.metaTitle.split(' — ')[0].split(' | ')[0]}
                  </Link>
                );
              })}
            </div>
          </div>
        </article>
      )}
    </div>
  );
}
