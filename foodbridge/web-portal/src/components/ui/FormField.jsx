import React from "react";

export function Input({ label, error, helperText, id, className = "", ...props }) {
  const inputId = id || props.name || Math.random().toString(36).substring(2, 9);
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-bold font-['Quicksand'] text-[var(--color-forest-text)] uppercase tracking-wider">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full px-3.5 py-2.5 rounded-[var(--radius-md)] border text-sm font-['Inter'] text-[var(--color-forest-text)] bg-[var(--color-bg-surface)] placeholder:text-[var(--color-text-light)] transition-all duration-200 outline-none focus:border-[var(--color-leaf-green)] focus:ring-2 focus:ring-[var(--color-leaf-green)]/20 ${
          error ? "border-rose-400 focus:border-rose-500 focus:ring-rose-200" : "border-[var(--color-border)]"
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs font-medium text-rose-600 mt-1">{error}</p>}
      {helperText && !error && <p className="text-xs text-[var(--color-text-muted)] mt-1">{helperText}</p>}
    </div>
  );
}

export function Select({ label, error, helperText, id, children, className = "", ...props }) {
  const selectId = id || props.name || Math.random().toString(36).substring(2, 9);
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={selectId} className="block text-xs font-bold font-['Quicksand'] text-[var(--color-forest-text)] uppercase tracking-wider">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`w-full px-3.5 py-2.5 rounded-[var(--radius-md)] border text-sm font-['Inter'] text-[var(--color-forest-text)] bg-[var(--color-bg-surface)] transition-all duration-200 outline-none focus:border-[var(--color-leaf-green)] focus:ring-2 focus:ring-[var(--color-leaf-green)]/20 ${
          error ? "border-rose-400 focus:border-rose-500" : "border-[var(--color-border)]"
        } ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs font-medium text-rose-600 mt-1">{error}</p>}
      {helperText && !error && <p className="text-xs text-[var(--color-text-muted)] mt-1">{helperText}</p>}
    </div>
  );
}

export function Textarea({ label, error, helperText, id, rows = 3, className = "", ...props }) {
  const textareaId = id || props.name || Math.random().toString(36).substring(2, 9);
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={textareaId} className="block text-xs font-bold font-['Quicksand'] text-[var(--color-forest-text)] uppercase tracking-wider">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        rows={rows}
        className={`w-full px-3.5 py-2.5 rounded-[var(--radius-md)] border text-sm font-['Inter'] text-[var(--color-forest-text)] bg-[var(--color-bg-surface)] placeholder:text-[var(--color-text-light)] transition-all duration-200 outline-none focus:border-[var(--color-leaf-green)] focus:ring-2 focus:ring-[var(--color-leaf-green)]/20 ${
          error ? "border-rose-400 focus:border-rose-500" : "border-[var(--color-border)]"
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs font-medium text-rose-600 mt-1">{error}</p>}
      {helperText && !error && <p className="text-xs text-[var(--color-text-muted)] mt-1">{helperText}</p>}
    </div>
  );
}
