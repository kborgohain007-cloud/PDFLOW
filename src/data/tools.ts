import { 
  FileText, 
  FileSpreadsheet, 
  FileImage, 
  FileCode, 
  BookOpen, 
  Layers, 
  Zap,
  Bot,
  Scissors,
  FileCheck,
  Binary,
  Type
} from 'lucide-react';

export interface ToolItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: 'conversion' | 'optimization' | 'ocr-ai' | 'editor-pro';
  inputFormats: string[];
  outputFormats: string[];
  maxSizeMB: number;
  batchSupport: boolean;
  iconName: string;
}

export const toolsData: ToolItem[] = [
  // Conversion Tools
  {
    id: 'pdf-to-word',
    name: 'PDF to Word',
    slug: 'pdf-to-word',
    description: 'Convert PDF files to editable Word documents client-side.',
    category: 'conversion',
    inputFormats: ['.pdf'],
    outputFormats: ['.docx'],
    maxSizeMB: 50,
    batchSupport: false,
    iconName: 'docx'
  },
  {
    id: 'word-to-pdf',
    name: 'Word to PDF',
    slug: 'word-to-pdf',
    description: 'Convert DOCX files to professional PDF documents instantly.',
    category: 'conversion',
    inputFormats: ['.docx'],
    outputFormats: ['.pdf'],
    maxSizeMB: 50,
    batchSupport: false,
    iconName: 'pdf'
  },
  {
    id: 'pdf-to-image',
    name: 'PDF to Image',
    slug: 'pdf-to-image',
    description: 'Extract pages from PDF and save them as PNG, JPG, or WebP images.',
    category: 'conversion',
    inputFormats: ['.pdf'],
    outputFormats: ['.jpg', '.png', '.webp'],
    maxSizeMB: 50,
    batchSupport: true,
    iconName: 'image'
  },
  {
    id: 'image-to-pdf',
    name: 'Image to PDF',
    slug: 'image-to-pdf',
    description: 'Combine multiple images (JPG, PNG, WebP) into a single PDF.',
    category: 'conversion',
    inputFormats: ['.jpg', '.jpeg', '.png', '.webp', '.bmp'],
    outputFormats: ['.pdf'],
    maxSizeMB: 50,
    batchSupport: true,
    iconName: 'pdf'
  },
  {
    id: 'excel-to-pdf',
    name: 'Excel to PDF',
    slug: 'excel-to-pdf',
    description: 'Convert Excel spreadsheets (XLSX, XLS) into layout-perfect PDFs.',
    category: 'conversion',
    inputFormats: ['.xlsx', '.xls'],
    outputFormats: ['.pdf'],
    maxSizeMB: 30,
    batchSupport: false,
    iconName: 'pdf'
  },
  {
    id: 'pdf-to-excel',
    name: 'PDF to Excel',
    slug: 'pdf-to-excel',
    description: 'Extract tables from PDF files into Excel files for analysis.',
    category: 'conversion',
    inputFormats: ['.pdf'],
    outputFormats: ['.xlsx'],
    maxSizeMB: 30,
    batchSupport: false,
    iconName: 'excel'
  },
  {
    id: 'ppt-to-pdf',
    name: 'PPT to PDF',
    slug: 'ppt-to-pdf',
    description: 'Render PowerPoint slideshows into clean PDF files.',
    category: 'conversion',
    inputFormats: ['.pptx', '.ppt'],
    outputFormats: ['.pdf'],
    maxSizeMB: 50,
    batchSupport: false,
    iconName: 'pdf'
  },
  {
    id: 'pdf-to-ppt',
    name: 'PDF to PPT',
    slug: 'pdf-to-ppt',
    description: 'Create PowerPoint presentation slides from a PDF layout.',
    category: 'conversion',
    inputFormats: ['.pdf'],
    outputFormats: ['.pptx'],
    maxSizeMB: 50,
    batchSupport: false,
    iconName: 'ppt'
  },
  {
    id: 'html-to-pdf',
    name: 'HTML to PDF',
    slug: 'html-to-pdf',
    description: 'Save HTML code or web files directly into PDF documents.',
    category: 'conversion',
    inputFormats: ['.html'],
    outputFormats: ['.pdf'],
    maxSizeMB: 10,
    batchSupport: false,
    iconName: 'pdf'
  },
  {
    id: 'pdf-to-html',
    name: 'PDF to HTML',
    slug: 'pdf-to-html',
    description: 'Deconstruct PDF pages into a standard responsive HTML page.',
    category: 'conversion',
    inputFormats: ['.pdf'],
    outputFormats: ['.html'],
    maxSizeMB: 15,
    batchSupport: false,
    iconName: 'html'
  },
  {
    id: 'epub-to-pdf',
    name: 'EPUB to PDF',
    slug: 'epub-to-pdf',
    description: 'Convert EPUB e-books to standardized PDF files for easy reading.',
    category: 'conversion',
    inputFormats: ['.epub'],
    outputFormats: ['.pdf'],
    maxSizeMB: 20,
    batchSupport: false,
    iconName: 'pdf'
  },
  {
    id: 'pdf-to-epub',
    name: 'PDF to EPUB',
    slug: 'pdf-to-epub',
    description: 'Convert PDF documents into fluid, flowable EPUB format.',
    category: 'conversion',
    inputFormats: ['.pdf'],
    outputFormats: ['.epub'],
    maxSizeMB: 20,
    batchSupport: false,
    iconName: 'epub'
  },
  {
    id: 'txt-to-pdf',
    name: 'TXT to PDF',
    slug: 'txt-to-pdf',
    description: 'Create custom PDFs from simple text files with margin settings.',
    category: 'conversion',
    inputFormats: ['.txt'],
    outputFormats: ['.pdf'],
    maxSizeMB: 10,
    batchSupport: false,
    iconName: 'pdf'
  },
  {
    id: 'pdf-to-txt',
    name: 'PDF to TXT',
    slug: 'pdf-to-txt',
    description: 'Scrape and extract plain raw text from any PDF document.',
    category: 'conversion',
    inputFormats: ['.pdf'],
    outputFormats: ['.txt'],
    maxSizeMB: 10,
    batchSupport: false,
    iconName: 'txt'
  },
  
  // Optimization Tools
  {
    id: 'merge-pdf',
    name: 'Merge PDF',
    slug: 'merge-pdf',
    description: 'Combine multiple PDF files into one and easily rearrange pages.',
    category: 'optimization',
    inputFormats: ['.pdf'],
    outputFormats: ['.pdf'],
    maxSizeMB: 100,
    batchSupport: true,
    iconName: 'layers'
  },
  {
    id: 'compress-pdf',
    name: 'Compress PDF',
    slug: 'compress-pdf',
    description: 'Shrink your PDF size up to 90% without visible quality degradation.',
    category: 'optimization',
    inputFormats: ['.pdf'],
    outputFormats: ['.pdf'],
    maxSizeMB: 100,
    batchSupport: true,
    iconName: 'compress'
  },
  
  // OCR & AI Tools
  {
    id: 'ocr-pdf',
    name: 'OCR & AI PDF Text',
    slug: 'ocr-pdf',
    description: 'Extract text from scanned PDFs & images with AI cleanup and searchable PDF output.',
    category: 'ocr-ai',
    inputFormats: ['.pdf', '.jpg', '.jpeg', '.png', '.webp'],
    outputFormats: ['.txt', '.docx', '.pdf'],
    maxSizeMB: 50,
    batchSupport: true,
    iconName: 'ai'
  },
  
  // Editor Pro
  {
    id: 'editor-pro',
    name: 'PDF Editor Pro',
    slug: 'editor',
    description: 'Edit PDFs visually — just like Canva, directly in your browser.',
    category: 'editor-pro',
    inputFormats: ['.pdf'],
    outputFormats: ['.pdf'],
    maxSizeMB: 100,
    batchSupport: true,
    iconName: 'sparkles'
  }
];
