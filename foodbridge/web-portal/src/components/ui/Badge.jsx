import React from "react";

export function Badge({ children, variant = "neutral", size = "sm", className = "", ...props }) {
  const sizeStyles = {
    sm: "px-2.5 py-0.5 text-xs",
    md: "px-3 py-1 text-xs font-semibold",
    lg: "px-3.5 py-1.5 text-sm font-semibold",
  };

  const variantStyles = {
    neutral: "bg-[var(--color-bg-subtle)] text-[var(--color-text-muted)] border border-[var(--color-border)]",
    leaf: "bg-[var(--color-leaf-green-alpha)] text-[var(--color-leaf-green)] border border-[var(--color-leaf-green)]/30 font-semibold",
    success: "bg-emerald-50 text-emerald-800 border border-emerald-300 font-semibold",
    mango: "bg-[var(--color-mustard-alpha)] text-[#8C600B] border border-[var(--color-mustard)]/40 font-semibold",
    warning: "bg-amber-50 text-amber-800 border border-amber-300 font-semibold",
    danger: "bg-[var(--color-tomato-alpha)] text-[var(--color-tomato-dark)] border border-[var(--color-tomato-orange)]/40 font-bold",
    info: "bg-blue-50 text-blue-800 border border-blue-200 font-semibold",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-['Quicksand'] ${sizeStyles[size] || sizeStyles.sm} ${
        variantStyles[variant] || variantStyles.neutral
      } ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
