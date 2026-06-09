'use client';

import React from 'react';
import ToolPageShell from '@/components/tool/ToolPageShell';
import { processPdfToImage } from '@/utils/pdf-processors';

export default function PdfToImagePage() {
  return (
    <ToolPageShell
      toolId="pdf-to-image"
      title="PDF to Image"
      description="Extract pages from PDF and save them as PNG, JPG, or WebP images instantly."
      allowedTypes={['.pdf']}
      maxSizeMB={50}
      multiple={false}
      defaultOptions={{ format: 'png', quality: 90 }}
      processFiles={processPdfToImage}
      optionsComponent={({ options, setOptions }) => (
        <div className="flex flex-col gap-4">
          <h4 className="font-heading font-extrabold text-sm text-neutral-800 dark:text-neutral-200">
            Image Configurations
          </h4>
          <div className="grid grid-cols-4 gap-2">
            {(['png', 'jpg', 'jpeg', 'webp'] as const).map((fmt) => (
              <button
                key={fmt}
                onClick={() => setOptions({ ...options, format: fmt })}
                className={`py-2.5 rounded-xl text-xs font-bold border uppercase transition-all cursor-pointer ${
                  options.format === fmt
                    ? 'bg-neutral-900 border-neutral-900 text-white dark:bg-white dark:border-white dark:text-black shadow-sm'
                    : 'bg-white border-neutral-200 text-neutral-500 hover:border-neutral-350 dark:bg-neutral-950/20 dark:border-neutral-800 dark:text-neutral-400 dark:hover:border-neutral-700'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>
          <div>
            <div className="flex justify-between text-xs font-semibold text-neutral-400 dark:text-neutral-500 mb-1.5">
              <span>Resolution Quality</span>
              <span>{options.quality}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              value={options.quality}
              onChange={(e) => setOptions({ ...options, quality: parseInt(e.target.value) })}
              className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:accent-indigo-400"
            />
          </div>
        </div>
      )}
      infoSections={[
        {
          title: "How to convert PDF to Image",
          content: "1. Drag & drop your PDF file.\n2. Choose your preferred output image format (PNG, JPG, JPEG, WebP) and rendering quality slider.\n3. The browser will render each page client-side and download them directly as individual files in your chosen format (no zip compression)."
        }
      ]}
    />
  );
}
