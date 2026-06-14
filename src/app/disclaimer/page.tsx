import React from 'react';
import { Metadata } from 'next';
import StaticPageShell from '@/components/ui/StaticPageShell';

export const metadata: Metadata = {
  title: 'Disclaimer | PDFlow',
  description: 'Read the PDFlow legal disclaimer regarding tool usage, file processing accuracy, and professional advice.',
  alternates: {
    canonical: 'https://pdflow.in/disclaimer',
  }
};

export default function DisclaimerPage() {
  return (
    <StaticPageShell title="Disclaimer">
      <p>The information, tools, and services provided on PDFlow are offered for general informational and utility purposes.</p>
      
      <p>While we make reasonable efforts to ensure that all tools function accurately and reliably, PDFlow makes no guarantees regarding absolute accuracy, uninterrupted availability, or suitability for every specific use case.</p>

      <h2 className="text-xl font-bold mt-6 text-neutral-900 dark:text-white">File Processing</h2>
      <p>Users are responsible for verifying the accuracy and integrity of files processed using our tools.</p>
      <p>We recommend keeping backup copies of important documents before performing any file conversion or modification.</p>
      
      <p>PDFlow shall not be held responsible for:</p>
      <ul className="list-disc pl-6 space-y-2">
        <li>File corruption</li>
        <li>Loss of document formatting</li>
        <li>Conversion errors</li>
        <li>Incomplete extraction of content</li>
        <li>Unexpected compatibility issues between file formats</li>
      </ul>

      <h2 className="text-xl font-bold mt-6 text-neutral-900 dark:text-white">No Professional Advice</h2>
      <p>PDFlow provides technical utility tools only.</p>
      <p>Nothing on this website should be interpreted as legal, financial, business, or professional advice.</p>

      <h2 className="text-xl font-bold mt-6 text-neutral-900 dark:text-white">Third-Party Services</h2>
      <p>The website may use third-party services for hosting, analytics, advertising, or infrastructure support.</p>
      <p>We are not responsible for interruptions or issues caused by third-party providers.</p>

      <h2 className="text-xl font-bold mt-6 text-neutral-900 dark:text-white">Use At Your Own Risk</h2>
      <p>All services are provided on an “as available” and “use at your own risk” basis.</p>
      <p>Users assume full responsibility for how they use the platform and any consequences resulting from file processing activities.</p>
      <p>By using PDFlow, you acknowledge and accept this disclaimer.</p>
    </StaticPageShell>
  );
}
