import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Convert PowerPoint to PDF Online — Free & Secure | PDFLOW',
  description: 'Convert PPTX/PPT slideshow presentations to high-quality PDF files. Secure, fast, and local browser-based file conversion.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
