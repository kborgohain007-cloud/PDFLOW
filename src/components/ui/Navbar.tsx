'use client';

import React from 'react';
import Link from 'next/link';
import ThemeToggle from '../theme/ThemeToggle';
import Logo from './Logo';
import { Layers, History } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200/30 dark:border-neutral-800/40 bg-white/70 dark:bg-[#09090b]/70 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <Logo className="w-8.5 h-8.5 group-hover:scale-105 transition-transform duration-200" />
          <span className="font-heading font-extrabold text-xl tracking-tight text-neutral-900 dark:text-neutral-50">
            PDF<span className="text-indigo-600 dark:text-indigo-400">LOW</span>
          </span>
        </Link>
        
        <div className="flex items-center gap-1.5 sm:gap-3">
          <Link
            href="/#tools"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800/40 transition-all"
          >
            <Layers className="w-4 h-4" />
            <span className="hidden sm:inline">All Tools</span>
          </Link>
          <Link
            href="/recent"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800/40 transition-all"
          >
            <History className="w-4 h-4" />
            <span className="hidden sm:inline">History</span>
          </Link>
          
          <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-800 mx-1" />
          
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
