import React from 'react';
import { Metadata } from 'next';
import StaticPageShell from '@/components/ui/StaticPageShell';

export const metadata: Metadata = {
  title: 'Terms and Conditions | PDFlow',
  description: 'Read the terms and conditions for using PDFlow. By accessing PDFlow, you agree to these service guidelines.',
  alternates: {
    canonical: 'https://pdflow.in/terms-and-conditions',
  }
};

export default function TermsPage() {
  return (
    <StaticPageShell title="Terms and Conditions">
      <p className="font-semibold">Effective Date: June 2026</p>
      
      <p>By accessing and using PDFlow, you agree to the following Terms and Conditions.</p>
      <p>If you do not agree with any part of these terms, please discontinue use of the website.</p>

      <h2 className="text-xl font-bold mt-6 text-neutral-900 dark:text-white">1. Use of Services</h2>
      <p>PDFlow provides online document processing and file utility tools for personal and general use.</p>
      <p>Users agree to use the website only for lawful purposes.</p>
      <p>You may not use PDFlow for activities that violate applicable laws or infringe upon the rights of others.</p>

      <h2 className="text-xl font-bold mt-6 text-neutral-900 dark:text-white">2. User Responsibility</h2>
      <p>Users are solely responsible for the files and content they choose to process using the platform.</p>
      <p>By using our services, you confirm that you have the legal right to access, modify, or process the files you submit.</p>

      <h2 className="text-xl font-bold mt-6 text-neutral-900 dark:text-white">3. Service Availability</h2>
      <p>We strive to maintain continuous service availability.</p>
      <p>However, we do not guarantee uninterrupted access at all times.</p>
      <p>Services may be temporarily unavailable due to maintenance, technical issues, or system upgrades.</p>

      <h2 className="text-xl font-bold mt-6 text-neutral-900 dark:text-white">4. Prohibited Activities</h2>
      <p>Users may not:</p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Attempt to disrupt website functionality</li>
        <li>Use automated systems to overload servers</li>
        <li>Attempt unauthorized access to infrastructure</li>
        <li>Use the platform for unlawful or fraudulent activities</li>
        <li>Abuse system resources in ways that negatively impact other users</li>
      </ul>

      <h2 className="text-xl font-bold mt-6 text-neutral-900 dark:text-white">5. Intellectual Property</h2>
      <p>All website design elements, branding, platform structure, content, and software associated with PDFlow remain the intellectual property of PDFlow unless otherwise stated.</p>
      <p>Unauthorized reproduction or misuse is prohibited.</p>

      <h2 className="text-xl font-bold mt-6 text-neutral-900 dark:text-white">6. Limitation of Liability</h2>
      <p>PDFlow is provided on an “as available” basis.</p>
      <p>We are not liable for:</p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Data loss</li>
        <li>File corruption</li>
        <li>Business interruption</li>
        <li>Technical errors during file processing</li>
        <li>Indirect damages arising from use of the platform</li>
      </ul>
      <p>Users are encouraged to keep backup copies of important files.</p>

      <h2 className="text-xl font-bold mt-6 text-neutral-900 dark:text-white">7. Third-Party Services</h2>
      <p>Certain features may rely on third-party infrastructure providers, analytics services, or advertising partners.</p>
      <p>PDFlow is not responsible for service interruptions caused by third-party providers.</p>

      <h2 className="text-xl font-bold mt-6 text-neutral-900 dark:text-white">8. Modifications</h2>
      <p>We reserve the right to modify, suspend, or discontinue services without prior notice.</p>

      <h2 className="text-xl font-bold mt-6 text-neutral-900 dark:text-white">9. Changes to Terms</h2>
      <p>These terms may be updated periodically.</p>
      <p>Continued use of the website indicates acceptance of updated terms.</p>

      <h2 className="text-xl font-bold mt-6 text-neutral-900 dark:text-white">10. Contact</h2>
      <p>Questions regarding these terms may be directed to:</p>
      <p><a href="mailto:admin@pdflow.in" className="text-emerald-600 hover:underline">admin@pdflow.in</a></p>
    </StaticPageShell>
  );
}
