'use client';

import React from 'react';
import ToolPageShell from '@/components/tool/ToolPageShell';
import { processPdfToWord } from '@/utils/pdf-processors';

export default function PdfToWordPage() {
  return (
    <ToolPageShell
      toolId="pdf-to-word"
      title="PDF to Word"
      description="Convert PDF files to perfectly formatted, editable Word documents (.docx)."
      isSecureCloud={true}
      allowedTypes={['.pdf']}
      maxSizeMB={50}
      processFiles={processPdfToWord}
      infoSections={[
        {
          title: "How to convert PDF to Word",
          content: "1. Upload your PDF file.\n2. Click start to process.\n3. The file is securely encrypted, sent to our automated layout engine, converted to an editable Word doc, and instantly deleted from our servers."
        }
      ]}
    />
  );
}
