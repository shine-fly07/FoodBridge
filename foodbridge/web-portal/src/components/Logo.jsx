import React from "react";

/**
 * FoodBridge River Bridge SVG Logo
 * 
 * Concept:
 * - River Wave: Flowing water curve beneath the bridge.
 * - Arch Bridge: Clean geometric arch spanning from donor bank to recipient bank.
 * - Food Crossing Node: Stylized dish/leaf crossing over the bridge arch with transit particles.
 */
export function Logo({ className = "w-10 h-10", showText = true }) {
  return (
    <div className="flex items-center gap-3 select-none">
      <svg
        className={`${className} shrink-0 transition-transform duration-300 hover:scale-110 hover:-rotate-6`}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="FoodBridge Cute Mascot Logo"
      >
        <defs>
          <filter id="cuteJsxShadow" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#1F3326" floodOpacity="0.18"/>
          </filter>
          <linearGradient id="appleJsxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF6B6B" />
            <stop offset="60%" stopColor="#EE5253" />
            <stop offset="100%" stopColor="#C82333" />
          </linearGradient>
          <linearGradient id="bridgeJsxGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2E7D4F" />
            <stop offset="50%" stopColor="#43A047" />
            <stop offset="100%" stopColor="#F6A623" />
          </linearGradient>
          <linearGradient id="leafJsxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#66BB6A" />
            <stop offset="100%" stopColor="#2E7D4F" />
          </linearGradient>
          <linearGradient id="heartJsxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF8A80" />
            <stop offset="100%" stopColor="#E53935" />
          </linearGradient>
        </defs>

        {/* Soft Shield Background */}
        <rect x="2" y="2" width="60" height="60" rx="18" fill="#2E7D4F" fillOpacity="0.12" stroke="#2E7D4F" strokeOpacity="0.2" strokeWidth="1.5" />

        {/* Connecting Arch Bridge Foundation */}
        <path d="M 10 48 Q 32 24 54 48" stroke="url(#bridgeJsxGrad)" strokeWidth="5" strokeLinecap="round" fill="none" filter="url(#cuteJsxShadow)" />
        <path d="M 16 48 Q 32 30 48 48" stroke="#FFFFFF" strokeWidth="1.8" strokeDasharray="2 3" strokeLinecap="round" fill="none" opacity="0.85" />
        <circle cx="12" cy="48" r="3" fill="#2E7D4F" />
        <circle cx="52" cy="48" r="3" fill="#F6A623" />

        {/* Cute Smiling Mascot Apple */}
        <g filter="url(#cuteJsxShadow)">
          <path d="M 32 16 C 24 16, 17 22, 17 31 C 17 40, 24 45, 32 45 C 40 45, 47 40, 47 31 C 47 22, 40 16, 32 16 Z" fill="url(#appleJsxGrad)" />
          <path d="M 21 24 C 20 28, 20 34, 23 37 C 22 33, 22 28, 24 25 C 23 24.5, 22 24, 21 24 Z" fill="#FFFFFF" opacity="0.45" />
          <path d="M 32 16 C 30 11, 24 10, 22 13 C 24 16, 28 17, 32 16 Z" fill="url(#leafJsxGrad)" />
          <path d="M 32 16 C 35 12, 41 12, 42 15 C 39 17, 35 17, 32 16 Z" fill="#81C784" opacity="0.75" />
          <path d="M 32 17 Q 31 13 33 11" stroke="#5D4037" strokeWidth="2" strokeLinecap="round" fill="none" />
          
          {/* Eyes & Cheeks */}
          <circle cx="27" cy="30" r="2.2" fill="#1F3326" />
          <circle cx="26.3" cy="29.2" r="0.8" fill="#FFFFFF" />
          <circle cx="37" cy="30" r="2.2" fill="#1F3326" />
          <circle cx="36.3" cy="29.2" r="0.8" fill="#FFFFFF" />
          <ellipse cx="23.5" cy="33.5" rx="2.5" ry="1.5" fill="#FF8A80" opacity="0.85" />
          <ellipse cx="40.5" cy="33.5" rx="2.5" ry="1.5" fill="#FF8A80" opacity="0.85" />
          <path d="M 29.5 33.5 Q 32 37 34.5 33.5" stroke="#1F3326" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        </g>

        {/* Floating Care Heart */}
        <path d="M 47 14 C 47 11.5, 44.5 10, 43 11.5 C 41.5 10, 39 11.5, 39 14 C 39 17, 43 19.5, 43 19.5 C 43 19.5, 47 17, 47 14 Z" fill="url(#heartJsxGrad)" filter="url(#cuteJsxShadow)"/>
        
        {/* Sparkles */}
        <path d="M 14 18 L 15 20 L 17 21 L 15 22 L 14 24 L 13 22 L 11 21 L 13 20 Z" fill="#F6A623" opacity="0.9" />
        <path d="M 50 36 L 51 37.5 L 52.5 38 L 51 38.5 L 50 40 L 49 38.5 L 47.5 38 L 49 37.5 Z" fill="#F6A623" opacity="0.75" />
      </svg>

      {showText && (
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold tracking-tight text-white leading-none">
              Food<span className="text-emerald-400">Bridge</span>
            </h1>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-800 font-mono">
              v2.4 Live
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium leading-tight mt-0.5">
            Surplus Food Rescue & River Bridge Logistics
          </p>
        </div>
      )}
    </div>
  );
}
