import React from "react";

interface BiDataLogoProps {
  className?: string;
  height?: number;
}

export function BiDataLogo({ className = "", height = 40 }: BiDataLogoProps) {
  return (
    <div className={`flex items-center ${className}`}>
      <img
        src="/logo.png"
        alt="Bi-Data Logo"
        height={height}
        className="h-auto object-contain"
        style={{ height: `${height}px` }}
      />
    </div>
  );
}
