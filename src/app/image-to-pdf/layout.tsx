import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Convert Images to PDF Online — Free & Local | PDFlow',
  description: 'Convert JPG, PNG, WebP images to a single PDF document. Drag to reorder, set margins, A4 sizes. 100% browser-first processing.',
  alternates: {
    canonical: 'https://pdflow.in/image-to-pdf',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
