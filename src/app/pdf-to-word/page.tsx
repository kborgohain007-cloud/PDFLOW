'use client';

import React from 'react';
import ToolPageShell from '@/components/tool/ToolPageShell';
import { processPdfToWord } from '@/utils/pdf-processors';

export default function PdfToWordPage() {
  return (
    <ToolPageShell
      toolId="pdf-to-word"
      title="PDF to Word"
      description="Convert PDF files to editable Word documents (.docx) client-side."
      allowedTypes={['.pdf']}
      maxSizeMB={50}
      processFiles={processPdfToWord}
      infoSections={[
        {
          title: "How to convert PDF to Word",
          content: "1. Upload your PDF file.\n2. Click start to parse text layout.\n3. The browser will compile an editable Word document for immediate download."
        }
      ]}
    />
  );
}
