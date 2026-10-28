import React from 'react';

/**
 * OrbitLogo Component
 * Minimalist abstract geometric brand mark:
 * - 270-degree main orbit arc with clean perpendicular cuts
 * - Offset satellite orbit ring nested in the upper-right quadrant
 */
export default function OrbitLogo({ 
  className = "text-neutral-900", 
  size = 28, 
  strokeWidth = 2.2,
  style = {} 
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="butt"
      strokeLinejoin="miter"
      className={className}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        display: 'inline-block',
        verticalAlign: 'middle',
        flexShrink: 0,
        ...style,
      }}
      aria-label="Y16Orbital Abstract Logo"
    >
      {/* 270-degree large circular arc sweeping from top (12 o'clock) around to right (3 o'clock) */}
      <path d="M 11.5 4.5 A 7.5 7.5 0 1 0 19 12" />

      {/* Orbiting satellite ring in the upper-right clearance */}
      <circle cx="17.2" cy="6.3" r="2.0" fill="none" />
    </svg>
  );
}
