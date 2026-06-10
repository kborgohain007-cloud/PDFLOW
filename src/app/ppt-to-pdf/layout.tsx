import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Convert PowerPoint to PDF Online — Free & Secure | PDFlow',
  description: 'Convert PPTX/PPT slideshow presentations to high-quality PDF files. Secure, fast, and local browser-based file conversion.',
  alternates: {
    canonical: 'https://pdflow.in/ppt-to-pdf',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
