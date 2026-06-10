import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Convert EPUB to PDF Online — Free & Secure | PDFlow',
  description: 'Convert EPUB ebooks to high-quality PDF documents. Secure, fast, and local browser-based file conversion.',
  alternates: {
    canonical: 'https://pdflow.in/epub-to-pdf',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
