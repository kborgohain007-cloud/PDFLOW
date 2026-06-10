import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Convert PDF to Word Online — Free & Secure | PDFLOW',
  description: 'Convert PDF documents to editable Microsoft Word files (DOCX). Secure, fast, and local browser-based file conversion.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
