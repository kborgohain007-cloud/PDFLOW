import React from 'react';
import { Metadata } from 'next';
import StaticPageShell from '@/components/ui/StaticPageShell';

export const metadata: Metadata = {
  title: 'Privacy Policy | PDFlow',
  description: 'Learn how PDFlow protects your data. We offer private, browser-based PDF processing.',
  alternates: {
    canonical: 'https://pdflow.in/privacy-policy',
  }
};

export default function PrivacyPolicyPage() {
  return (
    <StaticPageShell title="Privacy Policy">
      <p className="font-semibold">Effective Date: June 2026</p>
      
      <p>At PDFlow, accessible from pdflow.in, protecting user privacy is one of our highest priorities. This Privacy Policy explains how information is handled when you use our website and the tools provided through our platform.</p>

      <h2 className="text-xl font-bold mt-6 text-neutral-900 dark:text-white">1. Our Core Privacy Principle</h2>
      <p>PDFlow is designed with privacy in mind.</p>
      <p>Most file processing performed through PDFlow takes place directly within your browser on your own device. In general, files processed through our tools are not uploaded to our servers unless a specific feature clearly states otherwise.</p>
      <p>Our goal is to provide secure and private document utilities without unnecessary collection of user data.</p>

      <h2 className="text-xl font-bold mt-6 text-neutral-900 dark:text-white">2. Information We Do Not Collect</h2>
      <p>For standard file processing tools, we do not intentionally collect, store, or retain:</p>
      <ul className="list-disc pl-6 space-y-2">
        <li>PDF files uploaded for processing</li>
        <li>Word documents, spreadsheets, presentations, or image files</li>
        <li>Document contents or extracted text</li>
        <li>Personal files processed using browser-based tools</li>
      </ul>
      <p>Your files remain under your control throughout the processing workflow.</p>

      <h2 className="text-xl font-bold mt-6 text-neutral-900 dark:text-white">3. Analytics and Usage Information</h2>
      <p>To improve website performance and user experience, we may collect limited technical information such as:</p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Browser type and version</li>
        <li>Device type</li>
        <li>Pages visited</li>
        <li>Session duration</li>
        <li>General geographic region</li>
        <li>Anonymous usage statistics</li>
      </ul>
      <p>This information is collected in aggregated form and does not personally identify individual users.</p>

      <h2 className="text-xl font-bold mt-6 text-neutral-900 dark:text-white">4. Cookies</h2>
      <p>PDFlow may use cookies and similar technologies to:</p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Improve website functionality</li>
        <li>Remember user preferences</li>
        <li>Analyze website traffic patterns</li>
        <li>Support advertising services where applicable</li>
      </ul>
      <p>Users may disable cookies through browser settings if preferred.</p>

      <h2 className="text-xl font-bold mt-6 text-neutral-900 dark:text-white">5. Third-Party Services</h2>
      <p>PDFlow may use trusted third-party services for analytics, performance monitoring, and advertising, including but not limited to:</p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Google Analytics</li>
        <li>Google AdSense</li>
        <li>Hosting and CDN providers</li>
      </ul>
      <p>These third-party services operate under their own privacy policies.</p>

      <h2 className="text-xl font-bold mt-6 text-neutral-900 dark:text-white">6. Data Security</h2>
      <p>We take reasonable technical measures to maintain the security and integrity of the platform.</p>
      <p>While we strive to maintain secure systems, no website or internet transmission can be guaranteed to be completely secure under all circumstances.</p>

      <h2 className="text-xl font-bold mt-6 text-neutral-900 dark:text-white">7. External Links</h2>
      <p>Our website may contain links to third-party websites or services.</p>
      <p>We are not responsible for the privacy practices or content of external websites.</p>

      <h2 className="text-xl font-bold mt-6 text-neutral-900 dark:text-white">8. Children’s Privacy</h2>
      <p>PDFlow is not intended for children under the age of 13.</p>
      <p>We do not knowingly collect personal information from children.</p>

      <h2 className="text-xl font-bold mt-6 text-neutral-900 dark:text-white">9. Changes to This Policy</h2>
      <p>This Privacy Policy may be updated periodically to reflect improvements, legal requirements, or operational changes.</p>
      <p>Any changes will be published on this page.</p>

      <h2 className="text-xl font-bold mt-6 text-neutral-900 dark:text-white">10. Contact</h2>
      <p>For privacy-related questions, please contact:</p>
      <p>Email: <a href="mailto:admin@pdflow.in" className="text-emerald-600 hover:underline">admin@pdflow.in</a></p>
      <p>Website: pdflow.in</p>
    </StaticPageShell>
  );
}
