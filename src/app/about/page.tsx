import React from 'react';
import { Metadata } from 'next';
import StaticPageShell from '@/components/ui/StaticPageShell';

export const metadata: Metadata = {
  title: 'About Us | PDFlow',
  description: 'Learn about PDFlow and our mission to build fast, private, and accessible browser-based document tools.',
  alternates: {
    canonical: 'https://pdflow.in/about',
  }
};

export default function AboutPage() {
  return (
    <StaticPageShell title="About PDFlow">
      <p>PDFlow was created with a simple idea:</p>
      
      <p>Document tools should be fast, private, and accessible without forcing users to upload sensitive files to unknown servers.</p>
      
      <p>In a world where many online document services require cloud uploads and account creation, PDFlow takes a different approach.</p>
      
      <p>Our platform focuses on browser-based document processing, allowing users to perform common PDF and document-related tasks quickly while maintaining greater control over their files.</p>
      
      <p>Whether you need to convert documents, compress PDFs, extract text, or work with file formats across devices, PDFlow is designed to provide a clean and efficient experience without unnecessary complexity.</p>

      <h2 className="text-xl font-bold mt-6 text-neutral-900 dark:text-white">Our Mission</h2>
      <p>To build reliable online document tools that prioritize:</p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Privacy</li>
        <li>Speed</li>
        <li>Simplicity</li>
        <li>Accessibility</li>
        <li>Trust</li>
      </ul>

      <h2 className="text-xl font-bold mt-6 text-neutral-900 dark:text-white">Why PDFlow Exists</h2>
      <p>Many online file conversion services rely heavily on cloud processing, often requiring users to upload sensitive documents to remote servers.</p>
      <p>PDFlow aims to reduce that dependency by using modern browser technologies that allow many operations to happen locally on the user’s device whenever possible.</p>
      <p>This approach helps improve both privacy and speed.</p>

      <h2 className="text-xl font-bold mt-6 text-neutral-900 dark:text-white">Our Commitment</h2>
      <p>We believe utility websites should respect users.</p>
      <p>That means:</p>
      <ul className="list-disc pl-6 space-y-2">
        <li>No unnecessary account creation</li>
        <li>No hidden charges for basic tools</li>
        <li>No complicated workflows</li>
        <li>No unnecessary data collection</li>
      </ul>

      <p className="mt-4">We continue to improve PDFlow by expanding useful document tools while maintaining a privacy-first philosophy.</p>
      <p className="font-semibold text-emerald-600">Thank you for using PDFlow.</p>
    </StaticPageShell>
  );
}
