'use client';

import React from 'react';
import ToolPageShell from '@/components/tool/ToolPageShell';
import { processPdfToExcel } from '@/utils/pdf-processors';

export default function PdfToExcelPage() {
  return (
    <ToolPageShell
      toolId="pdf-to-excel"
      title="PDF to Excel"
      description="Extract tables from PDF files into Excel files (.xlsx) for simple data analysis."
      allowedTypes={['.pdf']}
      maxSizeMB={30}
      processFiles={processPdfToExcel}
      infoSections={[
        {
          title: "How to extract tables to Excel",
          content: "1. Upload your PDF file containing tabular data.\n2. Click start. The engine parses data boundaries.\n3. The browser generates a downloadable XLSX spreadsheet file."
        }
      ]}
    />
  );
}
