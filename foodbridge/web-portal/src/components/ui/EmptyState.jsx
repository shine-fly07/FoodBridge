import React from "react";
import { PackageOpen } from "lucide-react";

export function EmptyState({
  icon: Icon = PackageOpen,
  title = "No active items",
  message = "Check back soon or create a new listing to start food recovery.",
  action,
  className = "",
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-[var(--radius-lg)] border-2 border-dashed border-[var(--color-border)] bg-[var(--color-bg-subtle)]/40 ${className}`}
    >
      <div className="w-14 h-14 rounded-full bg-[var(--color-bg-surface)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-leaf-green)] shadow-[var(--shadow-warm-sm)] mb-4">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="font-['Fraunces'] text-lg font-bold text-[var(--color-forest-text)] mb-1">{title}</h3>
      <p className="text-sm text-[var(--color-text-muted)] font-['Inter'] max-w-md mb-6">{message}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
