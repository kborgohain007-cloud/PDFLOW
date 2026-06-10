import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Convert HTML to PDF Online — Free & Secure | PDFlow',
  description: 'Convert HTML files or webpage code to high-quality PDF documents. Secure, fast, and local browser-based file conversion.',
  alternates: {
    canonical: 'https://pdflow.in/html-to-pdf',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
