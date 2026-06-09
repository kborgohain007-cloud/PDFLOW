'use client';

import React from 'react';
import ToolPageShell from '@/components/tool/ToolPageShell';
import { processExcelToPdf } from '@/utils/pdf-processors';

export default function ExcelToPdfPage() {
  return (
    <ToolPageShell
      toolId="excel-to-pdf"
      title="Excel to PDF"
      description="Convert Excel spreadsheets (XLSX, XLS) into structured PDF document grids."
      allowedTypes={['.xlsx', '.xls']}
      maxSizeMB={30}
      processFiles={processExcelToPdf}
      infoSections={[
        {
          title: "How to convert Excel to PDF",
          content: "1. Upload your spreadsheet file.\n2. Click start to process rows and columns.\n3. Instantly download the formatted PDF document."
        }
      ]}
    />
  );
}
