'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function AnimatedBackground() {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; duration: number }[]>([]);

  useEffect(() => {
    // Generate particles client-side to prevent Next.js hydration mismatches
    const items = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2, // 2px to 6px
      duration: Math.random() * 20 + 20, // 20s to 40s
    }));
    setParticles(items);
  }, []);

  return (
    <div className="mesh-bg">
      {/* Dynamic colorful blobs */}
      <div className="mesh-glow-1" />
      <div className="mesh-glow-2" />
      <div className="mesh-glow-3" />
      
      {/* Floating dust/particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40 dark:opacity-20">
        {particles.map((p) => (
          <motion.span
            key={p.id}
            className="absolute rounded-full bg-indigo-500/20 dark:bg-indigo-400/10"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
            }}
            animate={{
              y: [0, -600],
              opacity: [0, 1, 1, 0],
              x: [0, (Math.random() - 0.5) * 50],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </div>
    </div>
  );
}
