import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Convert PDF to HTML Online — Free & Secure | PDFLOW',
  description: 'Convert PDF documents to clean, editable HTML webpage files. Secure, fast, and local browser-based file conversion.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
