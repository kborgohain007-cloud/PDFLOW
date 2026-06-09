'use client';

import React from 'react';
import { useToastStore } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertTriangle, Info, AlertOctagon } from 'lucide-react';

export default function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);
  const dismiss = useToastStore((state) => state.dismiss);

  const getIcon = (type?: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />;
      case 'error':
        return <AlertOctagon className="w-5 h-5 text-rose-500 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-indigo-500 dark:text-indigo-400 shrink-0" />;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 left-6 sm:left-auto z-50 flex flex-col gap-2 w-auto sm:w-[360px] pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.15 } }}
            className="pointer-events-auto flex items-start gap-3 p-4 rounded-xl border border-neutral-200/50 dark:border-neutral-800/50 bg-white/90 dark:bg-neutral-900/95 backdrop-blur-md shadow-lg matte-surface"
          >
            {getIcon(t.type)}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{t.title}</h4>
              {t.description && (
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">{t.description}</p>
              )}
              {t.action && (
                <button
                  onClick={() => {
                    t.action?.onClick();
                    dismiss(t.id);
                  }}
                  className="mt-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors cursor-pointer"
                >
                  {t.action.label}
                </button>
              )}
            </div>
            <button
              onClick={() => dismiss(t.id)}
              className="text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300 transition-colors cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
