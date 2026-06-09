'use client';

import React from 'react';
import ToolPageShell from '@/components/tool/ToolPageShell';
import { processWordToPdf } from '@/utils/pdf-processors';

export default function WordToPdfPage() {
  return (
    <ToolPageShell
      toolId="word-to-pdf"
      title="Word to PDF"
      description="Convert DOCX files to professional PDF documents instantly."
      allowedTypes={['.docx']}
      maxSizeMB={50}
      processFiles={processWordToPdf}
      infoSections={[
        {
          title: "How to convert Word to PDF",
          content: "1. Upload your DOCX Word file.\n2. Click start to reflow layout structures.\n3. The browser outputs a clean PDF file."
        }
      ]}
    />
  );
}
