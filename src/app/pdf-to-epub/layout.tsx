import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Convert PDF to EPUB Online — Free & Secure | PDFLOW',
  description: 'Convert PDF documents to EPUB format for e-readers. Secure, fast, and local browser-based file conversion.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
