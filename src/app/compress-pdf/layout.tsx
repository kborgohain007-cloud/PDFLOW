import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free PDF Compressor Online — Shrink PDF File Size Privately | PDFlow',
  description: 'Compress PDF files online for free. Reduce PDF file size up to 90% in your browser. 100% private, files never leave your device. No email or signup required.',
  alternates: {
    canonical: 'https://pdflow.in/compress-pdf',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
