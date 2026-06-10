import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Convert PDF to Excel Online — Free & Secure | PDFlow',
  description: 'Extract tables from PDF documents into Excel spreadsheets (XLSX). Secure, fast, and local browser-based file conversion.',
  alternates: {
    canonical: 'https://pdflow.in/pdf-to-excel',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
