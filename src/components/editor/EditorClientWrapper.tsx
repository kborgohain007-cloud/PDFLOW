'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const EditorWorkspace = dynamic(() => import('./EditorWorkspace'), { 
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center bg-neutral-100 dark:bg-neutral-950 text-neutral-500 font-bold">Loading Editor Engine...</div>
});

export default function EditorClientWrapper() {
  return <EditorWorkspace />;
}
