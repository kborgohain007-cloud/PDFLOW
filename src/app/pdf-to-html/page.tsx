'use client';

import React from 'react';
import ToolPageShell from '@/components/tool/ToolPageShell';
import { processPdfToHtml } from '@/utils/pdf-processors';

export default function PdfToHtmlPage() {
  return (
    <ToolPageShell
      toolId="pdf-to-html"
      title="PDF to HTML"
      description="Deconstruct PDF pages into a standard responsive HTML document structure."
      allowedTypes={['.pdf']}
      maxSizeMB={15}
      processFiles={processPdfToHtml}
      infoSections={[
        {
          title: "How to convert PDF to HTML",
          content: "1. Upload your PDF file.\n2. Click start to run text layout mappings.\n3. The engine outputs a responsive HTML document web page."
        }
      ]}
    />
  );
}
