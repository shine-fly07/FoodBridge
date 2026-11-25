import React, { useRef, useEffect, useState } from "react";

// Single shared IntersectionObserver instance across all components
let sharedObserver = null;
const callbacks = new Map();

function getSharedObserver() {
  if (typeof window === "undefined") return null;
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const cb = callbacks.get(entry.target);
            if (cb) {
              cb();
              callbacks.delete(entry.target);
              sharedObserver.unobserve(entry.target);
            }
          }
        }
      },
      { rootMargin: "0px 0px -40px 0px" }
    );
  }
  return sharedObserver;
}

export function RevealOnScroll({
  children,
  className = "",
  delay = 0,
  tag: Tag = "div",
  ...props
}) {
  const ref = useRef(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsRevealed(true);
      return;
    }

    const obs = getSharedObserver();
    if (!obs || !ref.current) {
      setIsRevealed(true);
      return;
    }

    callbacks.set(ref.current, () => setIsRevealed(true));
    obs.observe(ref.current);

    return () => {
      if (ref.current) {
        callbacks.delete(ref.current);
        obs.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <Tag
      ref={ref}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={`reveal-on-scroll ${isRevealed ? "is-revealed" : ""} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}
