import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Convert PDF to Excel Online — Free & Secure | PDFLOW',
  description: 'Extract tables from PDF documents into Excel spreadsheets (XLSX). Secure, fast, and local browser-based file conversion.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
