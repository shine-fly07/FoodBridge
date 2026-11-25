import React, { useState, useEffect } from "react";
import { Clock, AlertTriangle, CheckCircle2 } from "lucide-react";

export function ExpiryBadge({ expiresAt, className = "" }) {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(expiresAt));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(expiresAt));
    }, 1000);
    return () => clearInterval(timer);
  }, [expiresAt]);

  function calculateTimeLeft(target) {
    if (!target) return { totalMs: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    const diff = new Date(target).getTime() - Date.now();
    if (diff <= 0) {
      return { totalMs: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    }
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return { totalMs: diff, hours, minutes, seconds, isExpired: false };
  }

  if (timeLeft.isExpired) {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold font-['Quicksand'] bg-rose-100 text-rose-800 border border-rose-300 ${className}`}>
        <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
        <span>Expired</span>
      </span>
    );
  }

  const hoursRemaining = timeLeft.totalMs / 3600000;
  
  // Green: 2h+, Yellow: 1-2h, Red: <1h
  if (hoursRemaining >= 2) {
    return (
      <span
        title="Safe window: >2 hours remaining"
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold font-['Quicksand'] bg-emerald-100 text-emerald-900 border border-emerald-300 ${className}`}
      >
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>{timeLeft.hours}h {timeLeft.minutes}m remaining</span>
      </span>
    );
  }

  if (hoursRemaining >= 1) {
    return (
      <span
        title="Urgent window: 1-2 hours remaining"
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold font-['Quicksand'] bg-amber-100 text-amber-900 border border-amber-300 ${className}`}
      >
        <Clock className="w-3.5 h-3.5 text-amber-600" />
        <span>{timeLeft.hours}h {timeLeft.minutes}m remaining</span>
      </span>
    );
  }

  return (
    <span
      title="Critical window: <1 hour remaining! Urgent pickup needed"
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold font-['Quicksand'] bg-rose-100 text-rose-950 border border-rose-400 animate-pulse ${className}`}
    >
      <AlertTriangle className="w-3.5 h-3.5 text-rose-700" />
      <span>{timeLeft.minutes}m {timeLeft.seconds}s remaining!</span>
    </span>
  );
}
