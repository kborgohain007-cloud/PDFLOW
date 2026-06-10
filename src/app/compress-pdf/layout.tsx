import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Compress PDF Online — High Fidelity PDF Compression | PDFLOW',
  description: 'Reduce the file size of your PDF documents while keeping maximum quality. Secure, fast, and local browser-based compression.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
