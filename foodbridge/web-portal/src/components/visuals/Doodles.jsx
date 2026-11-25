import React from "react";

/**
 * Hand-drawn SVG doodle accents with draw-in animation support.
 */

export function ScribbleUnderline({ color = "#FACC15", className = "" }) {
  return (
    <svg
      viewBox="0 0 240 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`block w-full h-auto overflow-visible ${className}`}
      aria-hidden="true"
    >
      <path
        d="M 4 12
           C 40 4, 80 14, 120 8
           C 160 3, 200 13, 236 8"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="doodle-stroke"
      />
    </svg>
  );
}

export function DoodleCircle({ color = "#22C55E", children, className = "" }) {
  return (
    <span className={`relative inline-block ${className}`}>
      {children}
      <svg
        viewBox="0 0 140 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute -inset-x-3 -inset-y-1 w-[calc(100%+1.5rem)] h-[calc(100%+0.5rem)] pointer-events-none select-none overflow-visible"
        aria-hidden="true"
      >
        <path
          d="M 15 25
             C 10 10, 50 4, 100 6
             C 135 8, 138 28, 120 40
             C 95 48, 30 46, 12 36
             C 4 30, 8 18, 25 12"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="doodle-stroke"
        />
      </svg>
    </span>
  );
}

export function SparkleStar({ color = "#FACC15", size = 24, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block ${className}`}
      aria-hidden="true"
    >
      <path
        d="M 12 2
           C 12 7.5, 16.5 12, 22 12
           C 16.5 12, 12 16.5, 12 22
           C 12 16.5, 7.5 12, 2 12
           C 7.5 12, 12 7.5, 12 2 Z"
        fill={color}
      />
    </svg>
  );
}

export function DoodleArrow({ color = "#38BDF8", className = "" }) {
  return (
    <svg
      width="44"
      height="30"
      viewBox="0 0 44 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block ${className}`}
      aria-hidden="true"
    >
      <path
        d="M 4 22 C 16 6, 28 8, 38 18"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 32 18 L 40 18 L 38 10"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
