import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Award, ShieldAlert, Heart, Mail, ExternalLink, Gamepad2, ArrowUpRight } from "lucide-react";
import { Logo } from "./Logo";

export function Footer() {
  const location = useLocation();
  const navigate = useNavigate();

  function handleAnchorClick(e, anchor) {
    e.preventDefault();
    if (location.pathname !== "/") {
      navigate(`/${anchor}`);
    } else {
      const el = document.querySelector(anchor);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }

  const gameUrl = import.meta.env.VITE_GAME_URL || "http://localhost:5173";

  return (
    <footer className="bg-[var(--color-bg-surface)] border-t border-[var(--color-border)] pt-12 pb-8 mt-auto font-['Inter']">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[var(--color-border)]">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="inline-block" aria-label="FoodBridge Home">
              <Logo className="w-10 h-10" showText={true} />
            </Link>
            <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
              FoodBridge connects campus canteens, restaurants, and student volunteers with community shelters to ensure surplus meals reach hungry people instead of landfills.
            </p>
            {/* SDG Badges */}
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
                <Award className="w-3 h-3 text-amber-600" /> SDG 2: Zero Hunger
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                <ShieldAlert className="w-3 h-3 text-emerald-600" /> SDG 12: Responsible Consumption
              </span>
            </div>
          </div>

          {/* Core Roles */}
          <div className="space-y-3">
            <h3 className="font-['Quicksand'] text-xs font-bold uppercase tracking-wider text-[var(--color-forest-text)]">
              Rescue Network
            </h3>
            <ul className="space-y-2 text-xs text-[var(--color-text-muted)] font-medium">
              <li>
                <Link to="/donate" className="hover:text-[var(--color-leaf-green)] transition-colors flex items-center gap-1">
                  <span>Donor Canteen Hub</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </Link>
              </li>
              <li>
                <Link to="/courier" className="hover:text-[var(--color-leaf-green)] transition-colors flex items-center gap-1">
                  <span>Volunteer Courier Board</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </Link>
              </li>
              <li>
                <Link to="/ngo" className="hover:text-[var(--color-leaf-green)] transition-colors flex items-center gap-1">
                  <span>NGO Shelter Hub</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </Link>
              </li>
              <li>
                <Link to="/portal" className="hover:text-[var(--color-leaf-green)] transition-colors flex items-center gap-1">
                  <span>Unified Role Portal</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform & Impact */}
          <div className="space-y-3">
            <h3 className="font-['Quicksand'] text-xs font-bold uppercase tracking-wider text-[var(--color-forest-text)]">
              Platform & Mission
            </h3>
            <ul className="space-y-2 text-xs text-[var(--color-text-muted)] font-medium">
              <li>
                <a
                  href="#problem"
                  onClick={(e) => handleAnchorClick(e, "#problem")}
                  className="hover:text-[var(--color-leaf-green)] transition-colors"
                >
                  The Food Waste Problem
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  onClick={(e) => handleAnchorClick(e, "#how-it-works")}
                  className="hover:text-[var(--color-leaf-green)] transition-colors"
                >
                  How FoodBridge Works
                </a>
              </li>
              <li>
                <a
                  href="#impact"
                  onClick={(e) => handleAnchorClick(e, "#impact")}
                  className="hover:text-[var(--color-leaf-green)] transition-colors"
                >
                  Live Impact Overview
                </a>
              </li>
              <li>
                <Link to="/impact" className="hover:text-[var(--color-leaf-green)] transition-colors">
                  Monthly Impact & Audits
                </Link>
              </li>
              <li>
                <a
                  href="#get-involved"
                  onClick={(e) => handleAnchorClick(e, "#get-involved")}
                  className="hover:text-[var(--color-leaf-green)] transition-colors"
                >
                  Get Involved & Partnerships
                </a>
              </li>
              <li>
                <a
                  href={gameUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--color-tomato-orange)] text-[var(--color-forest-text)] font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Gamepad2 className="w-3.5 h-3.5 text-[var(--color-tomato-orange)]" />
                  <span>2D Food Rescue Game</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-3">
            <h3 className="font-['Quicksand'] text-xs font-bold uppercase tracking-wider text-[var(--color-forest-text)]">
              Community & Contact
            </h3>
            <p className="text-xs text-[var(--color-text-muted)]">
              Have questions about university food recovery, volunteering, or API integrations?
            </p>
            <a
              href="mailto:hello@foodbridge.org"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-[var(--radius-md)] bg-[var(--color-bg-subtle)] hover:bg-[#ebded0] text-xs font-bold text-[var(--color-forest-text)] border border-[var(--color-border)] transition-colors"
            >
              <Mail className="w-4 h-4 text-[var(--color-leaf-green)]" />
              <span>hello@foodbridge.org</span>
            </a>
            <div className="pt-2 text-[11px] text-[var(--color-text-muted)]">
              Open source initiative designed for campus sustainability.
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--color-text-muted)]">
          <p>&copy; {new Date().getFullYear()} FoodBridge. Verified Food Rescue Initiative.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-[var(--color-text-muted)]">
              Built with <Heart className="w-3.5 h-3.5 text-[var(--color-tomato-orange)] fill-current" /> for Zero Hunger
            </span>
            <Link to="/" className="hover:text-[var(--color-leaf-green)]">Home</Link>
            <Link to="/impact" className="hover:text-[var(--color-leaf-green)]">Impact</Link>
            <Link to="/portal" className="hover:text-[var(--color-leaf-green)]">Dashboard</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
