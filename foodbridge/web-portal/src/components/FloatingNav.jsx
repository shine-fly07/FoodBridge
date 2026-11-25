import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { HeartHandshake, Truck, Building2, BarChart3, LayoutDashboard, Home, ArrowRight } from "lucide-react";

/**
 * FloatingNav
 * 
 * Persistent bottom navigation pill with:
 * - Safe-area inset support (iOS notch / home bar).
 * - Automatic dismissal when keyboard is open (detecting focus on input/textarea).
 * - Proper aria-current="page" for accessibility.
 * - Cohesive styling with top navigation bar.
 */
export function FloatingNav() {
  const location = useLocation();
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    function handleFocusIn(e) {
      const tag = e.target.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") {
        setIsKeyboardOpen(true);
      }
    }

    function handleFocusOut(e) {
      const tag = e.target.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") {
        setIsKeyboardOpen(false);
      }
    }

    window.addEventListener("focusin", handleFocusIn);
    window.addEventListener("focusout", handleFocusOut);

    return () => {
      window.removeEventListener("focusin", handleFocusIn);
      window.removeEventListener("focusout", handleFocusOut);
    };
  }, []);

  // Hide floating dock when keyboard is visible on mobile
  if (isKeyboardOpen) {
    return null;
  }

  const links = [
    { to: "/", label: "Home", icon: Home },
    { to: "/donate", label: "Donate", icon: HeartHandshake },
    { to: "/courier", label: "Courier", icon: Truck },
    { to: "/ngo", label: "NGO Hub", icon: Building2 },
    { to: "/impact", label: "Impact", icon: BarChart3 },
    { to: "/portal", label: "Portal", icon: LayoutDashboard },
  ];

  return (
    <div
      className="fixed bottom-5 inset-x-0 mx-auto w-max z-40 pointer-events-auto px-3"
      style={{ paddingBottom: "max(0px, env(safe-area-inset-bottom, 0px))" }}
    >
      <nav
        aria-label="Bottom Navigation Pill"
        className="bg-[#14281D]/95 border border-[#264D37] shadow-2xl backdrop-blur-xl px-4 sm:px-5 py-2 rounded-full flex items-center gap-2 sm:gap-3.5 text-xs font-semibold text-emerald-100"
      >
        {links.map((link) => {
          const isActive = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              aria-current={isActive ? "page" : undefined}
              className={`px-2.5 sm:px-3 py-1 rounded-full transition-all flex items-center gap-1.5 ${
                isActive
                  ? "bg-[#2E7D4F] text-white font-extrabold shadow-xs"
                  : "text-emerald-200/80 hover:text-white hover:bg-white/10"
              }`}
            >
              <link.icon className="w-3.5 h-3.5 opacity-90 hidden sm:inline" />
              <span>{link.label}</span>
            </Link>
          );
        })}

        <span className="w-px h-4 bg-emerald-700/50 hidden xs:inline" />

        <Link
          to="/donate"
          className="bg-[#4ADE80] hover:bg-[#86EFAC] text-[#0A2612] font-black px-3.5 sm:px-4 py-1.5 rounded-full transition-all shadow-sm flex items-center gap-1 text-[11px] sm:text-xs shrink-0"
        >
          <span>Donate Food</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </nav>
    </div>
  );
}
