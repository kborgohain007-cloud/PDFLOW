import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Convert Text to PDF Online — Free & Secure | PDFLOW',
  description: 'Convert plain text files (TXT) to clean, professional PDF documents. Secure, fast, and local browser-based file conversion.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
