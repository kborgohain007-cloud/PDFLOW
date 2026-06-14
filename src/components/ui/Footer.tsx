import React from 'react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-8 mt-16 border-t border-neutral-200/50 dark:border-neutral-800/50 bg-white/30 dark:bg-neutral-900/30 backdrop-blur-md relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-neutral-500 dark:text-neutral-400">
            &copy; {currentYear} PDFlow. All rights reserved.
          </div>
          
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-medium text-neutral-600 dark:text-neutral-300">
            <Link href="/about" className="hover:text-emerald-500 transition-colors">
              About Us
            </Link>
            <Link href="/privacy-policy" className="hover:text-emerald-500 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-and-conditions" className="hover:text-emerald-500 transition-colors">
              Terms
            </Link>
            <Link href="/disclaimer" className="hover:text-emerald-500 transition-colors">
              Disclaimer
            </Link>
            <Link href="/contact" className="hover:text-emerald-500 transition-colors">
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
