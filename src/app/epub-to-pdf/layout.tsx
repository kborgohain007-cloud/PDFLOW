import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Convert EPUB to PDF Online — Free & Secure | PDFlow',
  description: 'Convert EPUB e-books to standardized PDF files. 100% private browser processing. Free forever, no signup.',
  alternates: {
    canonical: 'https://pdflow.in/epub-to-pdf',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
