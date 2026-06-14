import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Convert Text to PDF Online — Free & Secure | PDFlow',
  description: 'Convert plain text TXT files to margin-adjusted PDF documents. 100% private browser processing. Free, no limits.',
  alternates: {
    canonical: 'https://pdflow.in/txt-to-pdf',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
