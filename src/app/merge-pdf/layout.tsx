import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Merge PDF Files Online — Combine PDFs Privately | PDFlow',
  description: 'Combine multiple PDF documents into a single file easily. Rearrange pages using drag-and-drop. 100% private client-side processing.',
  alternates: {
    canonical: 'https://pdflow.in/merge-pdf',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
