import React from "react";
import { Link } from "react-router-dom";
import { Compass, Home, LayoutDashboard, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/Button";

export function NotFoundView() {
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-6">
      <div className="w-20 h-20 rounded-full bg-[var(--color-bg-subtle)] text-[var(--color-leaf-green)] flex items-center justify-center mx-auto shadow-[var(--shadow-warm-sm)] border border-[var(--color-border)]">
        <Compass className="w-10 h-10 animate-spin" style={{ animationDuration: "12s" }} />
      </div>

      <div className="space-y-2">
        <span className="px-3 py-1 rounded-full text-xs font-bold font-['Quicksand'] bg-[var(--color-tomato-alpha)] text-[var(--color-tomato-dark)]">
          404 Page Not Found
        </span>
        <h1 className="font-['Fraunces'] text-3xl sm:text-4xl font-extrabold text-[var(--color-forest-text)]">
          Lost on the Food Rescue Trail?
        </h1>
        <p className="text-sm text-[var(--color-text-muted)] font-['Inter'] leading-relaxed max-w-md mx-auto">
          The page or resource you are looking for has been moved or doesn&apos;t exist. Let&apos;s get you back on the right path to saving food!
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
        <Link to="/">
          <Button variant="primary">
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Button>
        </Link>
        <Link to="/portal">
          <Button variant="secondary">
            <LayoutDashboard className="w-4 h-4" />
            <span>Open Rescue Portal</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
