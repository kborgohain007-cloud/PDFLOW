import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Convert PDF to Text Online — Free & Secure | PDFlow',
  description: 'Extract clean plain text from PDF documents. Secure, fast, and local browser-based file conversion.',
  alternates: {
    canonical: 'https://pdflow.in/pdf-to-txt',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
