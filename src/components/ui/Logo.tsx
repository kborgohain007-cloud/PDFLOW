import React from 'react';

export default function Logo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Cyan bottom-left square */}
      <rect 
        x="23" 
        y="50" 
        width="36" 
        height="36" 
        rx="2"
        fill="#7ce6e6" 
        opacity="0.9"
      />
      {/* Sky Blue top-left/stem rectangle */}
      <rect 
        x="23" 
        y="23" 
        width="36" 
        height="36" 
        rx="4" 
        fill="#4fc3f7" 
        opacity="0.8"
      />
      {/* Light Blue right loop semicapsule */}
      <rect 
        x="45" 
        y="23" 
        width="32" 
        height="36" 
        rx="18" 
        fill="#9bd5ff" 
        opacity="0.75"
      />
    </svg>
  );
}
