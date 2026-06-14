import React from 'react';
import { Metadata } from 'next';
import StaticPageShell from '@/components/ui/StaticPageShell';

export const metadata: Metadata = {
  title: 'Contact Us | PDFlow',
  description: 'Get in touch with PDFlow for general support, technical issues, or business partnerships.',
  alternates: {
    canonical: 'https://pdflow.in/contact',
  }
};

export default function ContactPage() {
  return (
    <StaticPageShell title="Contact Us">
      <p>We value user feedback and are always working to improve PDFlow.</p>
      
      <p>If you have questions, suggestions, technical issues, partnership inquiries, or would like to report a problem with any tool, please feel free to contact us.</p>

      <h2 className="text-xl font-bold mt-6 text-neutral-900 dark:text-white">General Support</h2>
      <p>Email: <a href="mailto:admin@pdflow.in" className="text-emerald-600 hover:underline">admin@pdflow.in</a></p>

      <h2 className="text-xl font-bold mt-6 text-neutral-900 dark:text-white">Business and Partnership Inquiries</h2>
      <p>Email: <a href="mailto:admin@pdflow.in" className="text-emerald-600 hover:underline">admin@pdflow.in</a></p>

      <h2 className="text-xl font-bold mt-6 text-neutral-900 dark:text-white">Report Technical Issues</h2>
      <p>If you encounter any issues while using our tools, please include the following information when contacting us:</p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Tool name used</li>
        <li>Browser name and version</li>
        <li>Device type</li>
        <li>Description of the issue encountered</li>
      </ul>
      <p>This helps us investigate and resolve issues more efficiently.</p>

      <h2 className="text-xl font-bold mt-6 text-neutral-900 dark:text-white">Response Time</h2>
      <p>We aim to respond to all legitimate inquiries as quickly as possible, typically within 2–5 business days.</p>
      
      <p className="mt-4 font-semibold text-emerald-600">Thank you for reaching out to PDFlow.</p>
    </StaticPageShell>
  );
}
