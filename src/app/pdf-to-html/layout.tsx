import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Convert PDF to HTML Online — Free & Secure | PDFlow',
  description: 'Convert PDF documents to responsive HTML code files. 100% private client-side conversion. Free, no uploads.',
  alternates: {
    canonical: 'https://pdflow.in/pdf-to-html',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
