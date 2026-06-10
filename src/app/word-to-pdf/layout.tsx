import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Convert Word to PDF Online — Free & Secure | PDFLOW',
  description: 'Convert Microsoft Word files (DOCX, DOC) to professional PDF documents. Secure, fast, and local browser-based file conversion.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
