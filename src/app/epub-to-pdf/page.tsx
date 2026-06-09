'use client';

import React from 'react';
import ToolPageShell from '@/components/tool/ToolPageShell';
import { processEpubToPdf } from '@/utils/pdf-processors';

export default function EpubToPdfPage() {
  return (
    <ToolPageShell
      toolId="epub-to-pdf"
      title="EPUB to PDF"
      description="Convert EPUB ebooks to standardized PDFs for reading across devices."
      allowedTypes={['.epub']}
      maxSizeMB={20}
      processFiles={processEpubToPdf}
      infoSections={[
        {
          title: "How to convert EPUB to PDF",
          content: "1. Upload your .epub book file.\n2. Click start to reflow and paginate paragraphs.\n3. The browser generates a printable PDF file."
        }
      ]}
    />
  );
}
