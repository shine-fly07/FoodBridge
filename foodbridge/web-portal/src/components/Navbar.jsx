import React, { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Award,
  ShieldAlert,
  User,
  LogOut,
  Gamepad2,
  RefreshCw,
  HeartHandshake,
  Truck,
  Building2,
  LayoutDashboard,
  BarChart3,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "./ui/Button";

export function Navbar({
  currentUser,
  activeRole,
  onSelectRole,
  onOpenAuth,
  onLogout,
  onRefresh,
  totalDivertedMeals = 120,
  isDemoMode = false,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/donate", label: "Donate", icon: HeartHandshake },
    { to: "/courier", label: "Courier", icon: Truck },
    { to: "/ngo", label: "NGO Hub", icon: Building2 },
    { to: "/portal", label: "Portal", icon: LayoutDashboard },
    { to: "/impact", label: "Impact", icon: BarChart3 },
  ];

  const roles = [
    { key: "donor", label: "Donor / Canteen", desc: "List surplus food" },
    { key: "volunteer", label: "Volunteer Courier", desc: "Claim & deliver" },
    { key: "ngo", label: "NGO Shelter", desc: "Confirm distribution" },
  ];

  const gameUrl = import.meta.env.VITE_GAME_URL || "http://localhost:5173";

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#16281D] focus:text-white focus:rounded-lg focus:shadow-xl focus:font-bold focus:outline-none"
      >
        Skip to main content
      </a>
      <header className="sticky top-0 z-40 bg-[var(--color-bg-surface)]/95 backdrop-blur-md border-b border-[var(--color-border)] shadow-[var(--shadow-warm-sm)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-3">
        {/* Left: Logo */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 group" aria-label="FoodBridge Homepage">
            <Logo className="w-10 h-10" showText={true} />
          </Link>
        </div>

        {/* Center: Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 font-['Quicksand'] font-bold text-sm">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive: navActive }) =>
                  `px-3 py-1.5 rounded-[var(--radius-md)] transition-all flex items-center gap-1.5 ${
                    navActive
                      ? "bg-[var(--color-leaf-green-alpha)] text-[var(--color-leaf-green)] font-extrabold shadow-xs"
                      : "text-[var(--color-text-muted)] hover:text-[var(--color-forest-text)] hover:bg-[var(--color-bg-subtle)]"
                  }`
                }
              >
                {link.icon && <link.icon className="w-4 h-4 opacity-80" />}
                <span>{link.label}</span>
              </NavLink>
            );
          })}

          {/* 2D Rescue Game Link */}
          <a
            href={gameUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Launch 2D Food Rescue Runner Game"
            className="px-2.5 py-1.5 rounded-[var(--radius-md)] text-xs font-bold text-[var(--color-tomato-orange)] hover:bg-[var(--color-tomato-alpha)] transition-all flex items-center gap-1"
          >
            <Gamepad2 className="w-4 h-4" />
            <span>Game</span>
          </a>
        </nav>

        {/* Right: Actions, Role Selector & Auth */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Demo Mode Pill */}
          {isDemoMode && (
            <span
              title="Demo Mode: Operating with local storage cache"
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300 animate-pulse"
            >
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span>Demo Mode</span>
            </span>
          )}

          {/* Refresh Action */}
          {onRefresh && (
            <button
              onClick={onRefresh}
              title="Refresh listings"
              aria-label="Refresh listings"
              className="p-2 rounded-[var(--radius-md)] text-[var(--color-text-muted)] hover:text-[var(--color-forest-text)] hover:bg-[var(--color-bg-subtle)] border border-[var(--color-border)] transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}

          {/* Prominent Navbar CTA */}
          <div className="hidden md:flex items-center">
            <Link to="/donate">
              <Button size="sm" variant="primary" className="font-bold">
                Donate Food
              </Button>
            </Link>
          </div>

          {/* Role Switcher Pill */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="px-3 py-1.5 rounded-[var(--radius-md)] bg-[var(--color-bg-subtle)] hover:bg-[#ebded0] border border-[var(--color-border)] text-xs font-bold font-['Quicksand'] text-[var(--color-forest-text)] flex items-center gap-1.5 transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-[var(--color-leaf-green)]" />
              <span className="capitalize">{activeRole || "Select Role"}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-70" />
            </button>

            {roleDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-52 bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] shadow-[var(--shadow-warm-lg)] py-1.5 z-50 animate-fadeIn"
                onMouseLeave={() => setRoleDropdownOpen(false)}
              >
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-light)]">
                  Switch Role Context
                </div>
                {roles.map((r) => (
                  <button
                    key={r.key}
                    onClick={() => {
                      onSelectRole(r.key);
                      setRoleDropdownOpen(false);
                      navigate(`/portal/${r.key}`);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-semibold flex flex-col hover:bg-[var(--color-bg-subtle)] transition-colors ${
                      activeRole === r.key ? "bg-[var(--color-leaf-green-alpha)] text-[var(--color-leaf-green)] font-bold" : "text-[var(--color-forest-text)]"
                    }`}
                  >
                    <span>{r.label}</span>
                    <span className="text-[10px] text-[var(--color-text-muted)] font-normal">{r.desc}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Auth Button or User Menu */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              <span
                title={`${currentUser.name} (${currentUser.org || currentUser.role})`}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-md)] bg-[var(--color-leaf-green-alpha)] text-[var(--color-leaf-green)] text-xs font-bold font-['Quicksand']"
              >
                <User className="w-3.5 h-3.5" />
                <span className="max-w-[100px] truncate">{currentUser.name}</span>
              </span>
              <button
                onClick={onLogout}
                title="Sign out"
                aria-label="Sign out"
                className="p-2 rounded-[var(--radius-md)] text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Button size="sm" variant="primary" onClick={onOpenAuth}>
              Sign In
            </Button>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
            className="p-2 rounded-[var(--radius-md)] lg:hidden text-[var(--color-forest-text)] hover:bg-[var(--color-bg-subtle)] border border-[var(--color-border)]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[var(--color-bg-surface)] border-b border-[var(--color-border)] px-4 pt-3 pb-6 space-y-3 animate-fadeIn shadow-[var(--shadow-warm-lg)]">
          <div className="flex flex-col space-y-1 font-['Quicksand'] font-bold text-sm">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2.5 rounded-[var(--radius-md)] flex items-center gap-2 ${
                    isActive
                      ? "bg-[var(--color-leaf-green-alpha)] text-[var(--color-leaf-green)] font-extrabold"
                      : "text-[var(--color-forest-text)] hover:bg-[var(--color-bg-subtle)]"
                  }`
                }
              >
                {link.icon && <link.icon className="w-4 h-4 opacity-80" />}
                <span>{link.label}</span>
              </NavLink>
            ))}
            <a
              href={gameUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-[var(--radius-md)] flex items-center gap-2 text-[var(--color-tomato-orange)] font-bold hover:bg-[var(--color-tomato-alpha)]"
            >
              <Gamepad2 className="w-4 h-4" />
              <span>2D Rescue Game</span>
            </a>
          </div>

          <div className="pt-3 border-t border-[var(--color-border)]">
            <p className="text-xs font-bold font-['Quicksand'] uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
              Select Active Role:
            </p>
            <div className="grid grid-cols-3 gap-2">
              {roles.map((r) => (
                <button
                  key={r.key}
                  onClick={() => {
                    onSelectRole(r.key);
                    setMobileMenuOpen(false);
                    navigate(`/portal/${r.key}`);
                  }}
                  className={`py-2 px-2 rounded-[var(--radius-md)] text-xs font-bold text-center border transition-all ${
                    activeRole === r.key
                      ? "bg-[var(--color-leaf-green)] text-white border-[var(--color-leaf-green)] shadow-xs"
                      : "bg-[var(--color-bg-subtle)] text-[var(--color-forest-text)] border-[var(--color-border)]"
                  }`}
                >
                  {r.label.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
    </>
  );
}
