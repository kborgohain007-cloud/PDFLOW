import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Convert Images to PDF Online — Free & Secure | PDFlow',
  description: 'Compile JPG, PNG, WebP images into a single high-quality PDF document. Secure, fast, and local browser-based file conversion.',
  alternates: {
    canonical: 'https://pdflow.in/image-to-pdf',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
