import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Convert PDF to EPUB Online — Free & Secure | PDFlow',
  description: 'Convert PDF documents to e-reader compatible EPUB format. 100% private browser-based conversion. Free, no signup.',
  alternates: {
    canonical: 'https://pdflow.in/pdf-to-epub',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
