'use client';

import React from 'react';
import { useEditorStore } from '@/store/use-editor-store';
import EditorNavbar from './EditorNavbar';
import EditorSidebar from './EditorSidebar';
import EditorCanvas from './EditorCanvas';
import EditorProperties from './EditorProperties';
import UploadZone from '../upload/UploadZone';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
}

export default function EditorWorkspace() {
  const documents = useEditorStore((state) => state.documents);
  const addDocument = useEditorStore((state) => state.addDocument);

  // Initialize uploaded PDF
  const handleUpload = async (files: File[]) => {
    if (files.length === 0) return;
    
    try {
      const file = files[0];
      const arrayBuffer = await file.arrayBuffer();
      
      // Load with PDF.js to get page dimensions and thumbnails
      const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
      const pdf = await loadingTask.promise;
      
      const docId = crypto.randomUUID();
      
      // Extract pages info
      const initPages = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.0 });
        
        initPages.push({
          id: crypto.randomUUID(),
          documentId: docId,
          originalPageIndex: i - 1,
          rotation: 0,
          width: viewport.width,
          height: viewport.height,
          thumbnailUrl: null, // Will be generated asynchronously later
          operations: []
        });
      }

      addDocument({
        id: docId,
        name: file.name,
        originalBuffer: arrayBuffer,
        pageCount: pdf.numPages
      }, initPages);
    } catch (err) {
      console.error("PDF Load Error:", err);
      alert("Failed to load PDF. Check browser console for worker details.");
    }
  };

  // Local state to bridge the UploadZone component
  const [localFiles, setLocalFiles] = React.useState<File[]>([]);
  
  React.useEffect(() => {
    if (localFiles.length > 0) {
      handleUpload(localFiles);
    }
  }, [localFiles]);

  if (documents.length === 0) {
    const seoData = require('@/data/seo-content').seoContentMap['editor-pro'];
    return (
      <div className="w-full min-h-screen bg-background flex flex-col relative z-20">
        <div className="pt-20 pb-16 px-4 relative overflow-hidden flex-1">
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h1 className="text-4xl sm:text-5xl font-heading font-black text-neutral-800 dark:text-neutral-100 mb-6 drop-shadow-sm leading-tight">
              {seoData.h1}
            </h1>
            <p className="text-lg sm:text-xl text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
              {seoData.intro}
            </p>
            
            <div className="relative mx-auto max-w-2xl bg-white/40 dark:bg-neutral-900/40 rounded-3xl p-1 shadow-2xl backdrop-blur-xl border border-white/20 dark:border-neutral-800/30">
              <UploadZone 
                allowedTypes={['.pdf']}
                multiple={true}
                maxSizeMB={100}
                onFilesSelected={(files) => setLocalFiles(files)}
                isProcessing={false}
                progress={0}
                processingStatus=""
                onReset={() => {}}
                files={localFiles}
                setFiles={setLocalFiles as any}
              />
            </div>
            
            {/* Detailed SEO Content Article to match other tools */}
            <article className="max-w-4xl mx-auto mt-20 border-t border-neutral-200/50 dark:border-neutral-800/40 pt-12 flex flex-col gap-10 text-neutral-600 dark:text-neutral-300 text-left">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {seoData.benefits.map((b: any, idx: number) => (
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
                    {seoData.faqs.map((faq: any, idx: number) => (
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
            </article>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 font-sans">
      <EditorNavbar />
      <div className="flex-1 flex overflow-hidden">
        <EditorSidebar />
        <EditorCanvas />
        <EditorProperties />
      </div>
    </div>
  );
}
