'use client';

import React from 'react';
import ToolPageShell from '@/components/tool/ToolPageShell';
import { processPdfToTxt } from '@/utils/pdf-processors';

export default function PdfToTxtPage() {
  return (
    <ToolPageShell
      toolId="pdf-to-txt"
      title="PDF to TXT"
      description="Extract and scrape all plain text from your PDF documents client-side."
      allowedTypes={['.pdf']}
      maxSizeMB={10}
      processFiles={processPdfToTxt}
      infoSections={[
        {
          title: "How to extract text from PDF",
          content: "1. Upload your PDF file.\n2. Click start to run extraction scripts.\n3. The browser downloads a plain text .txt file containing the parsed content."
        }
      ]}
    />
  );
}
