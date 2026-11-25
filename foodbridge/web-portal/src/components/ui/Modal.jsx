import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";

export function Modal({ isOpen, onClose, title, children, maxWidth = "max-w-md", className = "" }) {
  const modalRef = useRef(null);
  const previouslyFocusedElementRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    // Save previous active element to restore on close
    previouslyFocusedElementRef.current = document.activeElement;

    const focusableSelector =
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

    const modalEl = modalRef.current;
    if (!modalEl) return;

    // Focus the first interactive element inside the modal
    const focusableElements = modalEl.querySelectorAll(focusableSelector);
    if (focusableElements.length > 0) {
      setTimeout(() => {
        focusableElements[0].focus();
      }, 50);
    }

    function handleKeyDown(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === "Tab") {
        const currentFocusables = modalEl.querySelectorAll(focusableSelector);
        if (currentFocusables.length === 0) return;

        const firstElement = currentFocusables[0];
        const lastElement = currentFocusables[currentFocusables.length - 1];

        if (e.shiftKey) {
          // Shift + Tab: if on first element, wrap to last
          if (document.activeElement === firstElement || !modalEl.contains(document.activeElement)) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab: if on last element, wrap to first
          if (document.activeElement === lastElement || !modalEl.contains(document.activeElement)) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
      // Restore focus to original trigger button
      if (previouslyFocusedElementRef.current && typeof previouslyFocusedElementRef.current.focus === "function") {
        previouslyFocusedElementRef.current.focus();
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn"
      onClick={(e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
          onClose();
        }
      }}
    >
      <div
        ref={modalRef}
        className={`w-full ${maxWidth} bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] shadow-[var(--shadow-warm-lg)] overflow-hidden transition-all transform animate-scaleUp ${className}`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)]">
          <h3 id="modal-title" className="font-['Fraunces'] text-xl font-bold text-[var(--color-forest-text)]">
            {title}
          </h3>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-full hover:bg-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-forest-text)] transition-colors focus-visible:ring-2 focus-visible:ring-[var(--color-leaf-green)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 max-h-[85vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
