'use client';

import React from 'react';
import ToolPageShell from '@/components/tool/ToolPageShell';
import { processPdfToPpt } from '@/utils/pdf-processors';

export default function PdfToPptPage() {
  return (
    <ToolPageShell
      toolId="pdf-to-ppt"
      title="PDF to PPT"
      description="Convert PDF document structures into standard PowerPoint slides (.pptx) client-side."
      allowedTypes={['.pdf']}
      maxSizeMB={50}
      processFiles={processPdfToPpt}
      infoSections={[
        {
          title: "How to convert PDF to PPT",
          content: "1. Upload your PDF file.\n2. Click start to map page layout structures.\n3. The browser generates a PowerPoint presentation slideshow file."
        }
      ]}
    />
  );
}
