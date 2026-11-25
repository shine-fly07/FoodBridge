import React, { useRef, useState, useEffect, useMemo } from "react";

/**
 * WordByWordHighlight
 * 
 * High-performance editorial text reveal animation using IntersectionObserver
 * thresholds to illuminate words as they scroll into view, with zero main-thread scroll polling.
 */
export function WordByWordHighlight({
  text,
  className = "",
  activeColor = "text-[#16281D]",
  inactiveColor = "text-[#476352]/40",
}) {
  const containerRef = useRef(null);
  const [ratio, setRatio] = useState(0);

  const words = useMemo(() => text.split(/\s+/), [text]);

  useEffect(() => {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRatio(1);
      return;
    }

    if (!containerRef.current) return;

    // Use thresholds: 0 to 1 with 0.1 increments
    const thresholds = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) {
          setRatio(entry.intersectionRatio);
        }
      },
      {
        threshold: thresholds,
        rootMargin: "0px 0px -15% 0px",
      }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  const activeCount = Math.floor(ratio * words.length);

  return (
    <p ref={containerRef} className={`leading-relaxed select-none ${className}`}>
      {words.map((word, idx) => {
        const isActive = idx <= activeCount;
        return (
          <span
            key={idx}
            className={`inline-block mr-1.5 transition-colors duration-200 ${
              isActive ? `${activeColor} font-bold opacity-100` : `${inactiveColor} font-normal`
            }`}
          >
            {word}
          </span>
        );
      })}
    </p>
  );
}
