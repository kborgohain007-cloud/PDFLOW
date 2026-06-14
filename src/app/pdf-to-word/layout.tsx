import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Convert PDF to Word Online — Secure & Fast | PDFlow',
  description: 'Convert PDF files to editable Microsoft Word DOCX documents. Uses end-to-end encryption to a secure server with a strict zero-retention policy. No signup required.',
  alternates: {
    canonical: 'https://pdflow.in/pdf-to-word',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
