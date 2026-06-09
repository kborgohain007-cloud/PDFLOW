'use client';

import React from 'react';
import ToolPageShell from '@/components/tool/ToolPageShell';
import { processPdfToEpub } from '@/utils/pdf-processors';

export default function PdfToEpubPage() {
  return (
    <ToolPageShell
      toolId="pdf-to-epub"
      title="PDF to EPUB"
      description="Convert rigid PDF documents into fluid, flowable EPUB format."
      allowedTypes={['.pdf']}
      maxSizeMB={20}
      processFiles={processPdfToEpub}
      infoSections={[
        {
          title: "How to convert PDF to EPUB",
          content: "1. Upload your PDF file.\n2. Click start to run pagination reflows.\n3. The browser generates a standard EPUB ebook for download."
        }
      ]}
    />
  );
}
