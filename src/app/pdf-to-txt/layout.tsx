import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Convert PDF to Text Online — Free & Secure | PDFlow',
  description: 'Extract plain text from PDF documents. 100% private browser-based scraping. Free, no sign-up or limits.',
  alternates: {
    canonical: 'https://pdflow.in/pdf-to-txt',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
