'use client';

import React from 'react';
import ToolPageShell from '@/components/tool/ToolPageShell';
import { processOcrPdf } from '@/utils/pdf-processors';

export default function OcrPdfPage() {
  const languages = [
    { code: 'eng', name: 'English' },
    { code: 'spa', name: 'Spanish (Español)' },
    { code: 'fra', name: 'French (Français)' },
    { code: 'deu', name: 'German (Deutsch)' },
    { code: 'jpn', name: 'Japanese (日本語)' },
    { code: 'chi_sim', name: 'Chinese Simple (简体中文)' },
  ];

  return (
    <ToolPageShell
      toolId="ocr-pdf"
      title="OCR & AI PDF Text"
      description="Extract text from scanned PDFs, layouts, or images using private client-side OCR."
      allowedTypes={['.pdf', '.jpg', '.jpeg', '.png', '.webp', 'image/*']}
      maxSizeMB={50}
      multiple={false}
      defaultOptions={{ language: 'eng', format: 'pdf' }}
      processFiles={processOcrPdf}
      optionsComponent={({ options, setOptions }) => (
        <div className="flex flex-col gap-4">
          <h4 className="font-heading font-extrabold text-sm text-neutral-800 dark:text-neutral-200">
            OCR Configuration
          </h4>
          
          <div>
            <span className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 mb-1.5 block">Document Language</span>
            <select
              value={options.language}
              onChange={(e) => setOptions({ ...options, language: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-xs font-semibold text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <span className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 mb-1.5 block">Output Format</span>
            <div className="grid grid-cols-2 gap-2">
              {(['pdf', 'docx'] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setOptions({ ...options, format: fmt })}
                  className={`py-2.5 rounded-xl text-xs font-bold border uppercase transition-all cursor-pointer ${
                    options.format === fmt
                      ? 'bg-neutral-900 border-neutral-900 text-white dark:bg-white dark:border-white dark:text-black shadow-sm'
                      : 'bg-white border-neutral-200 text-neutral-500 hover:border-neutral-350 dark:bg-neutral-950/20 dark:border-neutral-800 dark:text-neutral-400 dark:hover:border-neutral-700'
                  }`}
                >
                  {fmt === 'pdf' ? 'Searchable PDF (.pdf)' : 'Word Doc (.docx)'}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      infoSections={[
        {
          title: "How OCR works",
          content: "1. Upload a scanned PDF or image.\n2. Select the matching language of the document.\n3. The WebAssembly model processes characters locally.\n4. Export as a structured TXT or openable Word document."
        }
      ]}
    />
  );
}
