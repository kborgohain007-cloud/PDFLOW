'use client';

import React from 'react';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface StaticPageShellProps {
  title: string;
  children: React.ReactNode;
}

export default function StaticPageShell({ title, children }: StaticPageShellProps) {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 mt-[72px]">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Link 
          href="/" 
          className="inline-flex items-center text-sm font-medium text-neutral-500 hover:text-emerald-500 transition-colors mb-8 group"
        >
          <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          Back to Tools
        </Link>
        
        <div className="matte-surface bg-white/70 dark:bg-neutral-900/50 rounded-3xl p-8 md:p-12 border border-neutral-200/50 dark:border-neutral-800/80 backdrop-blur-md shadow-sm">
          <h1 className="text-3xl md:text-4xl font-black text-neutral-900 dark:text-white mb-10 tracking-tight">
            {title}
          </h1>
          
          <div className="prose-static flex flex-col gap-6 text-neutral-700 dark:text-neutral-300">
            {children}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
