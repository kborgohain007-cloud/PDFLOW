import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Convert PDF to Image Online — Free & Secure | PDFLOW',
  description: 'Convert PDF pages into high-quality JPG, PNG, or WebP images. Secure, fast, and local browser-based file conversion.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
