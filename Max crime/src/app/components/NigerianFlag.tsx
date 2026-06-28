import React from 'react';

export function NigerianFlag({ size = 64, className = "" }: { size?: number, className?: string }) {
  return (
    <svg 
      width={size} 
      height={size * 0.6} 
      viewBox="0 0 300 180" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Nigerian Flag"
    >
      <rect width="100" height="180" fill="#008751" />
      <rect x="100" width="100" height="180" fill="#FFFFFF" />
      <rect x="200" width="100" height="180" fill="#008751" />
    </svg>
  );
}
