import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Convert Excel to PDF Online — Free & Secure | PDFlow',
  description: 'Convert Excel spreadsheets (XLSX, XLS) to PDF files. Local browser-based conversion ensures 100% data privacy. No signup or fees.',
  alternates: {
    canonical: 'https://pdflow.in/excel-to-pdf',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
