'use client';

import React from 'react';
import ToolPageShell from '@/components/tool/ToolPageShell';
import { processCompressPdf } from '@/utils/pdf-processors';

export default function CompressPdfPage() {
  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <ToolPageShell
      toolId="compress-pdf"
      title="Compress PDF"
      description="Shrink the size of your PDF documents while keeping optimal image resolution and text structures."
      allowedTypes={['.pdf']}
      maxSizeMB={100}
      multiple={false}
      defaultOptions={{ level: 'medium', targetReduction: 50 }}
      processFiles={processCompressPdf}
      optionsComponent={({ files, options, setOptions }) => {
        const file = files[0];
        const originalSize = file ? file.size : 0;
        const targetReduction = options.targetReduction || 50;
        const estimatedSize = Math.round(originalSize * (1 - targetReduction / 100));
        
        const getQualityText = (val: number) => {
          if (val <= 30) return 'Lossless — High resolution, structural metadata cleaned';
          if (val <= 70) return 'Balanced — Recommended ratio of size to quality';
          return 'Maximum Compression — Smallest file size, compressed image streams';
        };

        return (
          <div className="flex flex-col gap-5">
            <h4 className="font-heading font-extrabold text-sm text-neutral-800 dark:text-neutral-200">
              Compression Settings
            </h4>
            
            <div>
              <div className="flex justify-between text-xs font-semibold text-neutral-400 dark:text-neutral-500 mb-2">
                <span>Target Size Reduction</span>
                <span className="text-indigo-650 dark:text-indigo-400 font-bold">{targetReduction}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="90"
                value={targetReduction}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  const level = val <= 30 ? 'low' : val <= 70 ? 'medium' : 'high';
                  setOptions({ ...options, targetReduction: val, level });
                }}
                className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:accent-indigo-400"
              />
            </div>

            <div className="p-4.5 rounded-2xl bg-neutral-50 dark:bg-neutral-950/40 border border-neutral-100 dark:border-neutral-900 flex flex-col gap-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-neutral-400">Original Size:</span>
                <span className="text-neutral-700 dark:text-neutral-300 font-bold">{formatBytes(originalSize)}</span>
              </div>
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-neutral-400">Estimated Compressed Size:</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">~ {formatBytes(estimatedSize)}</span>
              </div>
              <div className="text-[10px] font-semibold text-neutral-400 dark:text-neutral-500 mt-2 border-t border-neutral-100/50 dark:border-neutral-900/50 pt-2 leading-relaxed">
                <span className="font-bold text-neutral-500 dark:text-neutral-400">Profile: </span>
                {getQualityText(targetReduction)}
              </div>
            </div>
          </div>
        );
      }}
      infoSections={[
        {
          title: "How to compress PDF",
          content: "1. Upload your PDF file (up to 100MB limit).\n2. Drag the slider to set your desired output target size.\n3. Verify the estimated file size reduction.\n4. Click 'Compress PDF' to start."
        }
      ]}
    />
  );
}
