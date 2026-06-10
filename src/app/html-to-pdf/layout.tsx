import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Convert HTML to PDF Online — Free & Secure | PDFLOW',
  description: 'Convert HTML files or webpage code to high-quality PDF documents. Secure, fast, and local browser-based file conversion.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
