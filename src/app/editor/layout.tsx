import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PDF Editor Pro — Edit PDFs Online Free Like Canva | PDFlow',
  description: 'Edit PDF files visually in your browser. Add text, draw, highlight, rearrange pages, insert shapes, and export — all free and private. No signup required.',
  alternates: {
    canonical: 'https://pdflow.in/editor',
  },
  openGraph: {
    title: 'PDF Editor Pro — Edit PDFs Online Free | PDFlow',
    description: 'Edit PDF files visually in your browser like Canva. Add text, draw, highlight, and export — free and private.',
    url: 'https://pdflow.in/editor',
    siteName: 'PDFlow',
    type: 'website',
  },
};

export default function EditorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
