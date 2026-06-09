'use client';

import React, { useEffect, useState } from 'react';
import { usePDFlowStore } from '@/store/use-pdflow-store';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = usePDFlowStore((state) => state.theme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  // Prevent flash by avoiding rendering until mounted
  if (!mounted) {
    return (
      <div className="opacity-0 min-h-screen bg-[#09090b]">
        {children}
      </div>
    );
  }

  return <>{children}</>;
}
