import React from 'react';
import { Metadata } from 'next';
import EditorClientWrapper from '@/components/editor/EditorClientWrapper';

export const metadata: Metadata = {
  title: 'PDF Editor Pro | PDFlow',
  description: 'Advanced browser-based PDF editing engine. Edit PDFs visually with zero uploads.',
  alternates: {
    canonical: 'https://pdflow.in/editor',
  }
};

export default function EditorPage() {
  return (
    // We use a fixed full-screen overlay to cover the standard Navbar and Footer
    // to give the user a true application-like workspace experience.
    <div className="fixed inset-0 z-[100] bg-neutral-100 dark:bg-neutral-950 flex flex-col overflow-hidden">
      <EditorClientWrapper />
    </div>
  );
}
