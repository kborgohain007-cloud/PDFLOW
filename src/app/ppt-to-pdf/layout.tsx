import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Convert PowerPoint to PDF Online — Free & Secure | PDFlow',
  description: 'Convert PPTX slideshows to PDF documents. 100% private client-side conversion. Free forever, no registration needed.',
  alternates: {
    canonical: 'https://pdflow.in/ppt-to-pdf',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
