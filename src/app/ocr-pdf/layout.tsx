import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free AI PDF OCR Online — Extract Text from PDF & Scans | PDFlow',
  description: 'Extract text from scanned PDFs, images, and documents for free. 100% browser-based OCR with Wasm. Files never leave your device. Export to Word or Text.',
  alternates: {
    canonical: 'https://pdflow.in/ocr-pdf',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
