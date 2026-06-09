'use client';

import React from 'react';
import ToolPageShell from '@/components/tool/ToolPageShell';
import { processHtmlToPdf } from '@/utils/pdf-processors';

export default function HtmlToPdfPage() {
  return (
    <ToolPageShell
      toolId="html-to-pdf"
      title="HTML to PDF"
      description="Save HTML source code or web pages directly into print-ready PDF files."
      allowedTypes={['.html']}
      maxSizeMB={10}
      processFiles={processHtmlToPdf}
      infoSections={[
        {
          title: "How to convert HTML to PDF",
          content: "1. Upload your .html file.\n2. Click start to parse DOM trees.\n3. The engine outputs a standard formatted PDF file."
        }
      ]}
    />
  );
}
