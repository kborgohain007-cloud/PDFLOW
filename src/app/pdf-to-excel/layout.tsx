import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Convert PDF to Excel Online — Free & Local | PDFlow',
  description: 'Extract table grids from PDF files and save them as Excel XLSX sheets for free. 100% private browser processing. No signup.',
  alternates: {
    canonical: 'https://pdflow.in/pdf-to-excel',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
