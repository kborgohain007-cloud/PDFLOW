import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Convert Excel to PDF Online — Free & Secure | PDFlow',
  description: 'Convert Excel spreadsheets (XLSX, XLS) to professional PDF documents. Secure, fast, and local browser-based file conversion.',
  alternates: {
    canonical: 'https://pdflow.in/excel-to-pdf',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
