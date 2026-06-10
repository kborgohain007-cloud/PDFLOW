import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Compress PDF Online — Shrink PDF File Size Privately | PDFlow',
  description: 'Reduce the file size of your PDF documents while keeping maximum quality. Secure, fast, and local browser-based compression.',
  alternates: {
    canonical: 'https://pdflow.in/compress-pdf',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
