import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Convert PDF to EPUB Online — Free & Secure | PDFlow',
  description: 'Convert PDF documents to EPUB format for e-readers. Secure, fast, and local browser-based file conversion.',
  alternates: {
    canonical: 'https://pdflow.in/pdf-to-epub',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
