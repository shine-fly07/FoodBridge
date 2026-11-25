import React from "react";

export function Card({ children, className = "", hoverable = false, ...props }) {
  return (
    <div
      className={`bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-5 shadow-[var(--shadow-warm-sm)] transition-all duration-200 ${
        hoverable ? "hover:shadow-[var(--shadow-warm-md)] hover:-translate-y-0.5" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action, className = "" }) {
  return (
    <div className={`flex items-start justify-between gap-4 mb-4 pb-3 border-b border-[var(--color-border)] ${className}`}>
      <div>
        <h3 className="font-['Fraunces'] text-lg font-bold text-[var(--color-forest-text)]">{title}</h3>
        {subtitle && <p className="text-xs text-[var(--color-text-muted)] font-medium mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
