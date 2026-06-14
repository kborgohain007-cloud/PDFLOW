import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Convert Word to PDF Online — Free & 100% Local | PDFlow',
  description: 'Convert Microsoft Word DOCX documents to professional PDF files. Local browser processing ensures 100% file privacy. No uploads, free forever.',
  alternates: {
    canonical: 'https://pdflow.in/word-to-pdf',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
