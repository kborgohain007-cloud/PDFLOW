'use client';

import React from 'react';
import ToolPageShell from '@/components/tool/ToolPageShell';
import { processPptToPdf } from '@/utils/pdf-processors';

export default function PptToPdfPage() {
  return (
    <ToolPageShell
      toolId="ppt-to-pdf"
      title="PPT to PDF"
      description="Render PowerPoint presentations (.pptx, .ppt) into standard PDF slides."
      allowedTypes={['.pptx', '.ppt']}
      maxSizeMB={50}
      processFiles={processPptToPdf}
      infoSections={[
        {
          title: "How to convert PPT to PDF",
          content: "1. Upload your PowerPoint slideshow file.\n2. Click start to process slide decks.\n3. Instantly download the compiled PDF presentation."
        }
      ]}
    />
  );
}
