import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Convert Images to PDF Online — Free & Secure | PDFLOW',
  description: 'Compile JPG, PNG, WebP images into a single high-quality PDF document. Secure, fast, and local browser-based file conversion.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
