'use client';

import React from 'react';
import ToolPageShell from '@/components/tool/ToolPageShell';
import { processImageToPdf } from '@/utils/pdf-processors';

export default function ImageToPdfPage() {
  return (
    <ToolPageShell
      toolId="image-to-pdf"
      title="Image to PDF"
      description="Combine multiple images (JPG, PNG, WebP, BMP) into a single PDF document."
      allowedTypes={['.jpg', '.jpeg', '.png', '.webp', '.bmp', 'image/*']}
      maxSizeMB={50}
      multiple={true}
      defaultOptions={{ orientation: 'portrait', margin: 10, size: 'original' }}
      processFiles={processImageToPdf}
      optionsComponent={({ options, setOptions }) => (
        <div className="flex flex-col gap-4">
          <h4 className="font-heading font-extrabold text-sm text-neutral-800 dark:text-neutral-200">
            Layout Configuration
          </h4>
          
          <div>
            <span className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 mb-1.5 block">Orientation</span>
            <div className="grid grid-cols-2 gap-2">
              {(['portrait', 'landscape'] as const).map((orient) => (
                <button
                  key={orient}
                  onClick={() => setOptions({ ...options, orientation: orient })}
                  className={`py-2.5 rounded-xl text-xs font-bold border capitalize transition-all cursor-pointer ${
                    options.orientation === orient
                      ? 'bg-neutral-900 border-neutral-900 text-white dark:bg-white dark:border-white dark:text-black shadow-sm'
                      : 'bg-white border-neutral-200 text-neutral-500 hover:border-neutral-300 dark:bg-neutral-950/20 dark:border-neutral-800 dark:text-neutral-400 dark:hover:border-neutral-700'
                  }`}
                >
                  {orient}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 mb-1.5 block">Page Size</span>
            <div className="grid grid-cols-2 gap-2">
              {(['original', 'a4'] as const).map((sz) => (
                <button
                  key={sz}
                  onClick={() => setOptions({ ...options, size: sz })}
                  className={`py-2.5 rounded-xl text-xs font-bold border uppercase transition-all cursor-pointer ${
                    options.size === sz
                      ? 'bg-neutral-900 border-neutral-900 text-white dark:bg-white dark:border-white dark:text-black shadow-sm'
                      : 'bg-white border-neutral-200 text-neutral-500 hover:border-neutral-300 dark:bg-neutral-950/20 dark:border-neutral-800 dark:text-neutral-400 dark:hover:border-neutral-700'
                  }`}
                >
                  {sz === 'original' ? 'Original Size' : 'A4 Size'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 mb-1.5 block">Margins</span>
            <div className="grid grid-cols-3 gap-2">
              {([0, 10, 20] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setOptions({ ...options, margin: m })}
                  className={`py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    options.margin === m
                      ? 'bg-neutral-900 border-neutral-900 text-white dark:bg-white dark:border-white dark:text-black shadow-sm'
                      : 'bg-white border-neutral-200 text-neutral-500 hover:border-neutral-300 dark:bg-neutral-950/20 dark:border-neutral-800 dark:text-neutral-400 dark:hover:border-neutral-700'
                  }`}
                >
                  {m === 0 ? 'None' : `${m}px`}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      infoSections={[
        {
          title: "How to compile Images to PDF",
          content: "1. Upload one or more image files (multi-file batch supported).\n2. Select margins, orientation, and whether to stretch/scale image pages to standard A4 size.\n3. Click start. The PDF will compile instantly."
        }
      ]}
    />
  );
}
