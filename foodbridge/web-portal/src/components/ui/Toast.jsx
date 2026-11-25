import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ message, type = "info", duration = 4000 }) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback((msg, duration) => addToast({ message: msg, type: "success", duration }), [addToast]);
  const error = useCallback((msg, duration) => addToast({ message: msg, type: "error", duration }), [addToast]);
  const info = useCallback((msg, duration) => addToast({ message: msg, type: "info", duration }), [addToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast, success, error, info }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            aria-live="polite"
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-[var(--radius-md)] border shadow-[var(--shadow-warm-lg)] backdrop-blur-md transition-all transform animate-slideIn ${
              toast.type === "success"
                ? "bg-emerald-50 border-emerald-300 text-emerald-950"
                : toast.type === "error"
                ? "bg-rose-50 border-rose-300 text-rose-950"
                : "bg-[var(--color-bg-surface)] border-[var(--color-border)] text-[var(--color-forest-text)]"
            }`}
          >
            {toast.type === "success" && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />}
            {toast.type === "error" && <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />}
            {toast.type === "info" && <Info className="w-5 h-5 text-[var(--color-leaf-green)] shrink-0 mt-0.5" />}
            <div className="flex-1 text-sm font-medium font-['Inter'] leading-snug">{toast.message}</div>
            <button
              onClick={() => removeToast(toast.id)}
              aria-label="Dismiss toast"
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    return {
      success: (msg) => console.log("[Success Toast]", msg),
      error: (msg) => console.error("[Error Toast]", msg),
      info: (msg) => console.info("[Info Toast]", msg),
    };
  }
  return context;
}
