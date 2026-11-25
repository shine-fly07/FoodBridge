import React from "react";

/**
 * Glossy 3D & Flat-Gloss SVG Food Accents
 * Crafted with zero external dependencies, ultra-lightweight (<3KB total),
 * responsive scaling, and accessible decorative attributes.
 */

export function AppleShape({ variant = "glossy-3d", size = 80, className = "" }) {
  const is3D = variant === "glossy-3d";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block select-none pointer-events-none drop-shadow-md ${className}`}
      aria-hidden="true"
    >
      <defs>
        {is3D ? (
          <>
            {/* 3D Body Radial Gradient */}
            <radialGradient id="appleBodyGrad" cx="38%" cy="32%" r="65%">
              <stop offset="0%" stopColor="#86EFAC" />
              <stop offset="25%" stopColor="#22C55E" />
              <stop offset="70%" stopColor="#15803D" />
              <stop offset="100%" stopColor="#052E16" />
            </radialGradient>

            {/* Specular Top-Left Highlight */}
            <radialGradient id="appleHighlight" cx="30%" cy="26%" r="35%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </radialGradient>

            {/* Rim Refraction Light */}
            <linearGradient id="appleRimLight" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="#4ADE80" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>

            {/* Leaf Gradient */}
            <linearGradient id="appleLeafGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#4ADE80" />
              <stop offset="100%" stopColor="#166534" />
            </linearGradient>

            {/* Stem Gradient */}
            <linearGradient id="appleStemGrad" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#78350F" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>

            {/* Soft Ambient Shadow Filter */}
            <filter id="softBlur" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" />
            </filter>
          </>
        ) : (
          <>
            {/* Flat-Gloss Solid Colors */}
            <linearGradient id="flatAppleBody" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4ADE80" />
              <stop offset="100%" stopColor="#16A34A" />
            </linearGradient>
            <linearGradient id="flatLeaf" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#86EFAC" />
              <stop offset="100%" stopColor="#22C55E" />
            </linearGradient>
          </>
        )}
      </defs>

      {/* Ambient Floor Shadow */}
      <ellipse cx="50" cy="92" rx="30" ry="6" fill="#000000" opacity={is3D ? "0.22" : "0.15"} />

      {/* Stem */}
      <path
        d="M 50 30 C 51 20, 56 12, 64 8"
        stroke={is3D ? "url(#appleStemGrad)" : "#78350F"}
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Leaf */}
      <path
        d="M 52 24 C 62 16, 76 18, 78 28 C 66 32, 54 28, 52 24 Z"
        fill={is3D ? "url(#appleLeafGrad)" : "url(#flatLeaf)"}
      />
      {is3D && (
        <path
          d="M 53 25 C 61 22, 70 24, 76 27"
          stroke="#DCFCE7"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.8"
        />
      )}

      {/* Main Apple Body */}
      <path
        d="M 50 32
           C 40 24, 18 26, 18 48
           C 18 70, 34 88, 50 88
           C 66 88, 82 70, 82 48
           C 82 26, 60 24, 50 32 Z"
        fill={is3D ? "url(#appleBodyGrad)" : "url(#flatAppleBody)"}
      />

      {/* 3D Specular Highlight & Inner Glows */}
      {is3D ? (
        <>
          {/* Top-Left Gloss Dome */}
          <path
            d="M 46 36
               C 38 30, 26 32, 26 46
               C 26 60, 36 68, 44 64
               C 42 54, 42 44, 46 36 Z"
            fill="url(#appleHighlight)"
          />

          {/* Bottom Rim Light Contour */}
          <path
            d="M 28 72 C 38 84, 62 84, 72 72"
            stroke="url(#appleRimLight)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Center Indentation Shadow */}
          <ellipse cx="50" cy="33" rx="7" ry="2.5" fill="#064E3B" opacity="0.45" />

          {/* Micro Pinpoint Specular Dot */}
          <circle cx="34" cy="38" r="3" fill="#FFFFFF" opacity="0.9" />
          <circle cx="39" cy="44" r="1.5" fill="#FFFFFF" opacity="0.6" />
        </>
      ) : (
        <>
          {/* Flat-Gloss Curved Sheen Crescent */}
          <path
            d="M 30 36 C 24 44, 24 56, 32 66 C 26 56, 26 44, 34 38 Z"
            fill="#FFFFFF"
            opacity="0.4"
          />
          <ellipse cx="50" cy="34" rx="5" ry="1.5" fill="#0F766E" opacity="0.3" />
        </>
      )}
    </svg>
  );
}

export function BowlShape({ variant = "glossy-3d", size = 80, className = "" }) {
  const is3D = variant === "glossy-3d";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block select-none pointer-events-none drop-shadow-md ${className}`}
      aria-hidden="true"
    >
      <defs>
        {is3D ? (
          <>
            {/* Ceramic Outer Bowl Depth Gradient */}
            <linearGradient id="bowlOuterGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="40%" stopColor="#F1F5F9" />
              <stop offset="85%" stopColor="#CBD5E1" />
              <stop offset="100%" stopColor="#94A3B8" />
            </linearGradient>

            {/* Soup / Meal Warm Surface Gradient */}
            <radialGradient id="soupGrad" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#FCD34D" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="90%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#B45309" />
            </radialGradient>

            {/* Specular Rim Light */}
            <linearGradient id="bowlRimHighlight" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.3" />
            </linearGradient>

            {/* Steam Glow Gradient */}
            <linearGradient id="steamGrad" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#FDE68A" stopOpacity="0" />
            </linearGradient>
          </>
        ) : (
          <>
            <linearGradient id="flatBowlBody" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F8FAFC" />
              <stop offset="100%" stopColor="#E2E8F0" />
            </linearGradient>
            <linearGradient id="flatSoup" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
          </>
        )}
      </defs>

      {/* Ambient Floor Shadow */}
      <ellipse cx="50" cy="90" rx="34" ry="6" fill="#000000" opacity={is3D ? "0.22" : "0.15"} />

      {/* Steam Doodle Waves */}
      <path
        d="M 38 34 C 36 24, 42 18, 38 10"
        stroke={is3D ? "url(#steamGrad)" : "#F59E0B"}
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.75"
      />
      <path
        d="M 50 32 C 48 20, 56 16, 52 8"
        stroke={is3D ? "url(#steamGrad)" : "#F59E0B"}
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        opacity="0.9"
      />
      <path
        d="M 62 34 C 60 24, 66 18, 62 10"
        stroke={is3D ? "url(#steamGrad)" : "#F59E0B"}
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.75"
      />

      {/* Bowl Base Pedestal */}
      <ellipse cx="50" cy="84" rx="18" ry="4" fill={is3D ? "#94A3B8" : "#CBD5E1"} />

      {/* Ceramic Outer Bowl Shell */}
      <path
        d="M 14 44
           C 14 74, 30 84, 50 84
           C 70 84, 86 74, 86 44
           Z"
        fill={is3D ? "url(#bowlOuterGrad)" : "url(#flatBowlBody)"}
      />

      {/* Soup Inner Surface */}
      <ellipse
        cx="50"
        cy="44"
        rx="36"
        ry="13"
        fill={is3D ? "url(#soupGrad)" : "url(#flatSoup)"}
      />

      {/* Floating Garnish Herbs (Leaf Flakes) */}
      <ellipse cx="44" cy="42" rx="3" ry="1.5" fill="#22C55E" transform="rotate(-15 44 42)" />
      <ellipse cx="56" cy="45" rx="2.5" ry="1.2" fill="#15803D" transform="rotate(25 56 45)" />
      <ellipse cx="50" cy="46" rx="2" ry="1" fill="#4ADE80" />

      {/* Bowl Inner Lip Specular Reflection */}
      {is3D ? (
        <>
          {/* Ceramic Top Rim Ring */}
          <ellipse
            cx="50"
            cy="44"
            rx="36"
            ry="13"
            stroke="url(#bowlRimHighlight)"
            strokeWidth="2"
            fill="none"
          />

          {/* Front Curved Gloss Band */}
          <path
            d="M 22 52 C 32 72, 68 72, 78 52 C 68 66, 32 66, 22 52 Z"
            fill="#FFFFFF"
            opacity="0.45"
          />

          {/* Micro Pinpoint Specular Glint on Rim */}
          <circle cx="28" cy="44" r="1.8" fill="#FFFFFF" opacity="0.95" />
          <circle cx="72" cy="44" r="1.8" fill="#FFFFFF" opacity="0.95" />
        </>
      ) : (
        <>
          <ellipse cx="50" cy="44" rx="36" ry="13" stroke="#CBD5E1" strokeWidth="1.5" fill="none" />
          <path
            d="M 26 56 C 36 68, 64 68, 74 56 C 66 64, 34 64, 26 56 Z"
            fill="#FFFFFF"
            opacity="0.35"
          />
        </>
      )}
    </svg>
  );
}
