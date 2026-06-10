import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Convert PDF to Text Online — Free & Secure | PDFLOW',
  description: 'Extract clean plain text from PDF documents. Secure, fast, and local browser-based file conversion.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
