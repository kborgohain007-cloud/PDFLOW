import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Convert Excel to PDF Online — Free & Secure | PDFLOW',
  description: 'Convert Excel spreadsheets (XLSX, XLS) to professional PDF documents. Secure, fast, and local browser-based file conversion.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
