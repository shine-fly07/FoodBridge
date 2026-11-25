import React from "react";

export function Badge({ children, variant = "neutral", size = "sm", className = "", ...props }) {
  const sizeStyles = {
    sm: "px-2.5 py-0.5 text-xs",
    md: "px-3 py-1 text-xs font-semibold",
    lg: "px-3.5 py-1.5 text-sm font-semibold",
  };

  const variantStyles = {
    neutral: "bg-[var(--color-bg-subtle)] text-[var(--color-forest-text)] border border-[var(--color-border)]",
    leaf: "bg-[var(--color-leaf-green-alpha)] text-[#155724] border border-[#2E7D4F]/30 font-bold",
    success: "bg-emerald-50 text-[#065F46] border border-emerald-300 font-bold",
    mango: "bg-[var(--color-mustard-alpha)] text-[#78350F] border border-[var(--color-mustard)]/40 font-bold",
    warning: "bg-amber-50 text-[#78350F] border border-amber-300 font-bold",
    danger: "bg-[var(--color-tomato-alpha)] text-[var(--color-tomato-dark)] border border-[var(--color-tomato-orange)]/40 font-bold",
    info: "bg-blue-50 text-blue-900 border border-blue-200 font-semibold",
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
