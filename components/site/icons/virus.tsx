import React from "react";

interface VirusIconProps {
  size?: number | string;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * Virus glyph drawn in the same outline style as the lucide-react icons
 * (24x24 viewBox, 2px stroke, no fill, uses currentColor). Rendered for the
 * "Pathogen Effectors" research area.
 */
export function VirusIcon({ size = 24, style, className }: VirusIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
      className={className}
      aria-hidden="true"
    >
      {/* Capsid */}
      <circle cx="12" cy="12" r="4.5" />
      {/* Axis spikes */}
      <line x1="12" y1="7.5" x2="12" y2="3.4" />
      <line x1="12" y1="16.5" x2="12" y2="20.6" />
      <line x1="7.5" y1="12" x2="3.4" y2="12" />
      <line x1="16.5" y1="12" x2="20.6" y2="12" />
      {/* Diagonal spikes */}
      <line x1="8.8" y1="8.8" x2="5.9" y2="5.9" />
      <line x1="15.2" y1="8.8" x2="18.1" y2="5.9" />
      <line x1="8.8" y1="15.2" x2="5.9" y2="18.1" />
      <line x1="15.2" y1="15.2" x2="18.1" y2="18.1" />
      {/* Spike knobs */}
      <circle cx="12" cy="2.6" r="0.9" />
      <circle cx="12" cy="21.4" r="0.9" />
      <circle cx="2.6" cy="12" r="0.9" />
      <circle cx="21.4" cy="12" r="0.9" />
      <circle cx="5.1" cy="5.1" r="0.9" />
      <circle cx="18.9" cy="5.1" r="0.9" />
      <circle cx="5.1" cy="18.9" r="0.9" />
      <circle cx="18.9" cy="18.9" r="0.9" />
    </svg>
  );
}
