import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI-Powered PDF OCR Online — Extract Text from PDF | PDFLOW',
  description: 'Extract text from scanned PDFs or images using built-in Wasm-based OCR. Secure, fast, and local browser-based text recognition.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
