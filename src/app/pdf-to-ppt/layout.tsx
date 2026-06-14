import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Convert PDF to PowerPoint Online — Free & Secure | PDFlow',
  description: 'Convert PDF documents to editable PowerPoint slideshows (PPTX). 100% private client-side conversion. Free, no account.',
  alternates: {
    canonical: 'https://pdflow.in/pdf-to-ppt',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
