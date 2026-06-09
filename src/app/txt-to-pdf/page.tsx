'use client';

import React from 'react';
import ToolPageShell from '@/components/tool/ToolPageShell';
import { processTxtToPdf } from '@/utils/pdf-processors';

export default function TxtToPdfPage() {
  return (
    <ToolPageShell
      toolId="txt-to-pdf"
      title="TXT to PDF"
      description="Create customized PDFs from plain text documents (.txt) with layout margins."
      allowedTypes={['.txt']}
      maxSizeMB={10}
      defaultOptions={{ fontSize: 11 }}
      processFiles={processTxtToPdf}
      optionsComponent={({ options, setOptions }) => (
        <div className="flex flex-col gap-4">
          <h4 className="font-heading font-extrabold text-sm text-neutral-800 dark:text-neutral-200">
            Font Settings
          </h4>
          <div>
            <div className="flex justify-between text-xs font-semibold text-neutral-400 dark:text-neutral-500 mb-1.5">
              <span>Font Size</span>
              <span>{options.fontSize}pt</span>
            </div>
            <input
              type="range"
              min="8"
              max="24"
              value={options.fontSize}
              onChange={(e) => setOptions({ ...options, fontSize: parseInt(e.target.value) })}
              className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:accent-indigo-400"
            />
          </div>
        </div>
      )}
      infoSections={[
        {
          title: "How to convert Text to PDF",
          content: "1. Upload your plain text .txt file.\n2. Adjust font size parameter.\n3. Click start. The PDF compiles and aligns margins instantly."
        }
      ]}
    />
  );
}
