import React from 'react';
import { Metadata } from 'next';
import EditorWorkspace from '@/components/editor/EditorWorkspace';

export const metadata: Metadata = {
  title: 'PDF Editor Pro — Edit PDFs Like Canva | PDFlow',
  description:
    'Advanced browser-based PDF editor. Add text, draw, highlight, rotate pages, and export — all without uploads. Free and private.',
  alternates: { canonical: 'https://pdflow.in/editor' },
  openGraph: {
    title: 'PDF Editor Pro | PDFlow',
    description: 'Edit PDFs visually in your browser — no uploads, no sign-up.',
    url: 'https://pdflow.in/editor',
    siteName: 'PDFlow',
    type: 'website',
  },
};

export default function EditorPage() {
  return (
    <div className="fixed inset-0 z-[100] bg-neutral-100 dark:bg-neutral-950 flex flex-col overflow-hidden">
      <EditorWorkspace />
    </div>
  );
}
