import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Convert HTML to PDF Online — Free & Secure | PDFlow',
  description: 'Convert HTML files or website source code to PDF. 100% private browser processing. Free, no signup, no logs.',
  alternates: {
    canonical: 'https://pdflow.in/html-to-pdf',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
